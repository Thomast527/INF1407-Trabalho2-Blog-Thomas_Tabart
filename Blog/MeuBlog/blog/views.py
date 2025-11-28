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
        operation_description='Remove um artigo',
        request_body=ArtigoSerializer,
        responses={ 
            204: ArtigoSerializer(), 
            404: None,
        },
    )
    def delete(self, request):

        data = request.data

        # --- 1) Cas d'un seul id envoyé dans un dict ---
        if isinstance(data, dict):
            artigo_ids = [data.get("id")]

        # --- 2) Cas d'une liste d'IDs ---
        elif isinstance(data, list):
            artigo_ids = data

        else:
            return Response(
                {"erro": "Formato de dados inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- 3) Suppression article par article ---
        for artigo_id in artigo_ids:

            # id absent ?
            if not artigo_id:
                return Response(
                    {"erro": "ID do artigo não enviado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # article existe ?
            try:
                artigo = Artigo.objects.get(id=artigo_id)
            except Artigo.DoesNotExist:
                return Response(
                    {"erro": f"Artigo com id {artigo_id} não encontrado"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # permission ?
            if artigo.autor != request.user:
                return Response(
                    {"erro": "Você não tem permissão para apagar este artigo."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # suppression
            artigo.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



    


class ArtigoView(APIView):
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        # Toute méthode nécessite authentification
        return [IsAuthenticated()]


    @swagger_auto_schema(
		operation_summary='Criar carro', operation_description="Criar um novo carro",
		request_body=openapi.Schema(
			type=openapi.TYPE_OBJECT,
			properties={
				'titulo': openapi.Schema(default='My trip to London', description='Titulo do artigo', type=openapi.TYPE_STRING,),
				'conteudo': openapi.Schema(default="My first trip into a foreign country was in England when I was 12...", description='Contento do artigo', type=openapi.TYPE_STRING,),
				'categoria': openapi.Schema(default=1, description='Id of the category of the article', type=openapi.TYPE_INTEGER),
			},
		),
		responses={201: ArtigoSerializer(), 400: 'Dados errados',},
	)
    def post(self, request):
        data = request.data.copy()
        data['autor'] = request.user.id  # impose l’auteur authentifié
        serializer = ArtigoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

    @swagger_auto_schema(
 	 	operation_summary='Dados de um Artigo',
		operation_description="Obter informações sobre um artigo específico",
		responses={
			  200: ArtigoSerializer(),
			  400: 'Mensagem de erro',
              404: 'Artigo não encontrado',
	  	},
		 manual_parameters=[
		    openapi.Parameter(
                'id_arg', 
                in_=openapi.IN_PATH,
			    default=1,
			    type=openapi.TYPE_INTEGER,
			    required=True,
			    description='id do artigo na URL',
                example=1,
			),
		],
	)
    def get(self, request, id_arg):
        artigo = self.singleArtigo(id_arg)

        if not artigo:
            return Response(
                {'msg': f'Artigo com id #{id_arg} não existe'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ArtigoSerializer(artigo)

        # Vérifie si l'utilisateur est l'auteur
        est_autor = False
        if request.user.is_authenticated:
            est_autor = (artigo.autor == request.user)

        return Response({
            "dados": serializer.data,
            "est_autor": est_autor
        })

        
    def singleArtigo(self, id_arg):
        try:
            queryset = Artigo.objects.get(id=id_arg)
            return queryset
        except Artigo.DoesNotExist: # id não existe
            return None
    

    @swagger_auto_schema(
	  	operation_summary='Atualiza artigo', 
        operation_description="Atualizar um artigo existente",
		request_body=openapi.Schema(
			type=openapi.TYPE_OBJECT,
			properties={
                'id': openapi.Schema(default=1, description='Id of the article', type=openapi.TYPE_INTEGER),
                'titulo': openapi.Schema(default='My trip to London', description='Titulo do artigo', type=openapi.TYPE_STRING,),
				'conteudo': openapi.Schema(default="My first trip into a foreign country was in England when I was 12...", description='Contento do artigo', type=openapi.TYPE_STRING,),
				'categoria': openapi.Schema(default=1, description='Id of the category of the article', type=openapi.TYPE_INTEGER),
				'autor': openapi.Schema(default=1, description='Id of the autor of the article', type=openapi.TYPE_INTEGER),
			},
        ),
        responses={200: ArtigoSerializer(), 400: ArtigoSerializer(),	},
        manual_parameters=[
            openapi.Parameter(
                'id_arg',
                openapi.IN_PATH, 
                default=1, 
                type=openapi.TYPE_INTEGER, 
                required=True, 
                description='id do artigo na URL',
            ),
        ],
	)
    def put(self, request, id_arg):
        # 1) Récupère l'article
        artigo = self.singleArtigo(id_arg)
        if not artigo:
            return Response(
                {"erro": "Artigo não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2) Vérifie si l’utilisateur est le propriétaire
        if artigo.autor != request.user:
            return Response(
                {"erro": "Você não tem permissão para alterar este artigo."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 3) Continuer si autorisé
        serializer = ArtigoSerializer(artigo, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)



from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaList(APIView):
    def get(self, request):
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data)
