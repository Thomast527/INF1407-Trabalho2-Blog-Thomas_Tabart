from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Artigo
from .serializers import ArtigoSerializer
from django.contrib.auth.models import User

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from rest_framework.decorators import authentication_classes

class ArtigosView(APIView):
    @swagger_auto_schema(
        operation_summary='Lista todos os artigos',
        operation_description="Obter informações sobre todos os artigos",
        request_body=None,  # opcional
        responses={200: ArtigoSerializer()}
    ) 
    def get(self, request):
        artigos = Artigo.objects.all().order_by('-data_publicacao')
        serializer = ArtigoSerializer(artigos, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Remover artigos",
        operation_description="""
            Remove um ou mais artigos.  
            Aceita os formatos:

            - **Um único objeto**: `{ "id": 3 }`
            - **Uma lista de IDs**: `[3, 4, 10]`

            Somente o autor do artigo pode removê-lo.
        """,
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            oneOf=[
                openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={"id": openapi.Schema(type=openapi.TYPE_INTEGER)},
                    required=["id"]
                ),
                openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_INTEGER)
                )
            ]
        ),
        responses={
            204: "Artigos removidos",
            400: openapi.Response(description="Requisição inválida"),
            403: openapi.Response(description="Sem permissão"),
            404: openapi.Response(description="Artigo não encontrado")
        },
        security=[{'Token': []}]
    )

    def delete(self, request):

        data = request.data

        if isinstance(data, dict):
            artigo_ids = [data.get("id")]

        elif isinstance(data, list):
            artigo_ids = data

        else:
            return Response(
                {"erro": "Formato de dados inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        for artigo_id in artigo_ids:

            if not artigo_id:
                return Response(
                    {"erro": "ID do artigo não enviado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                artigo = Artigo.objects.get(id=artigo_id)
            except Artigo.DoesNotExist:
                return Response(
                    {"erro": f"Artigo com id {artigo_id} não encontrado"},
                    status=status.HTTP_404_NOT_FOUND
                )

            if artigo.autor != request.user:
                return Response(
                    {"erro": "Você não tem permissão para apagar este artigo."},
                    status=status.HTTP_403_FORBIDDEN
                )

            artigo.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ArtigoView(APIView):
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        return [IsAuthenticated()]


    @swagger_auto_schema(
        operation_summary='Criar artigo',
        operation_description="Cria um novo artigo. Apenas usuários do grupo 'Escritor' podem publicar.",
        security=[{"Token": []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'titulo': openapi.Schema(
                    default='My trip to London',
                    description='Título do artigo',
                    type=openapi.TYPE_STRING
                ),
                'conteudo': openapi.Schema(
                    default="My first trip into a foreign country was in England when I was 12...",
                    description='Conteúdo do artigo',
                    type=openapi.TYPE_STRING
                ),
                'categoria': openapi.Schema(
                    default=1,
                    description='ID da categoria do artigo',
                    type=openapi.TYPE_INTEGER
                ),
            },
            required=['titulo', 'conteudo', 'categoria'],
        ),
        responses={
            201: openapi.Response(description="Artigo criado", schema=ArtigoSerializer()),
            400: "Dados inválidos",
            403: "Usuário sem permissão para publicar",
        },
    )
    def post(self, request):
        if not request.user.groups.filter(name__iexact="escritor").exists():
            return Response(
                {"erro": "Você não tem permissão para publicar artigos."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data['autor'] = request.user.id  

        serializer = ArtigoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @swagger_auto_schema(
        operation_summary="Obter dados de um artigo",
        operation_description="Retorna os dados de um artigo específico e se o usuário logado é o autor.",
        manual_parameters=[
            openapi.Parameter(
                'id_arg',
                in_=openapi.IN_PATH,
                description="ID do artigo",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Dados do artigo",
                examples={
                    "application/json": {
                        "dados": {
                            "id": 1,
                            "titulo": "Meu artigo",
                            "conteudo": "Conteúdo...",
                            "categoria": 2,
                            "autor": 4
                        },
                        "est_autor": True
                    }
                }
            ),
            404: "Artigo não encontrado"
        }
    )

    def get(self, request, id_arg):
        artigo = self.singleArtigo(id_arg)

        if not artigo:
            return Response(
                {'msg': f'Artigo com id #{id_arg} não existe'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ArtigoSerializer(artigo)

        est_autor = False
        if request.user.is_authenticated:
            est_autor = (artigo.autor == request.user)

        return Response({
            "dados": serializer.data,
            "est_autor": est_autor
        })


    def singleArtigo(self, id_arg):
        try:
            return Artigo.objects.get(id=id_arg)
        except Artigo.DoesNotExist:
            return None


    @swagger_auto_schema(
        operation_summary="Atualizar artigo",
        operation_description="Atualiza um artigo existente. Apenas o autor pode atualizar.",
        security=[{'Token': []}],
        manual_parameters=[
            openapi.Parameter(
                'id_arg',
                in_=openapi.IN_PATH,
                description="ID do artigo",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['titulo', 'conteudo', 'categoria', 'autor'],
            properties={
                'titulo': openapi.Schema(type=openapi.TYPE_STRING),
                'conteudo': openapi.Schema(type=openapi.TYPE_STRING),
                'categoria': openapi.Schema(type=openapi.TYPE_INTEGER),
                'autor': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            200: openapi.Response(
                description="Artigo atualizado",
                schema=ArtigoSerializer()
            ),
            400: "Dados inválidos",
            403: "Sem permissão",
            404: "Artigo não encontrado",
        }
    )

    def put(self, request, id_arg):
        artigo = self.singleArtigo(id_arg)
        if not artigo:
            return Response(
                {"erro": "Artigo não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        if artigo.autor != request.user:
            return Response(
                {"erro": "Você não tem permissão para alterar este artigo."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ArtigoSerializer(artigo, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)



from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaList(APIView):
    @swagger_auto_schema(
        operation_summary="Listar categorias",
        operation_description="Retorna todas as categorias cadastradas.",
        responses={
            200: openapi.Response(
                description="Lista de categorias",
                schema=CategoriaSerializer(many=True)
            )
        }
    )

    def get(self, request):
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data)
