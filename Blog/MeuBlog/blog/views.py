from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Artigo
from .serializers import ArtigoSerializer
from django.contrib.auth.models import User

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
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
        '''
        Deleta um artigo específico pelo id
        id_arg é o mesmo nome que colocamos em urls.py
        '''
        id_erro = ""
        erro = False
        for id in request.data:
            artigo = Artigo.objects.get(id=id)
            if artigo:
                artigo.delete()
            else:
                id_erro += str(id)
                erro = True
        if erro:
            return Response({'error': f'item [{id_erro}] não encontrado'},status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

    

class ArtigoView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


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
        '''
        Retorna um artigo específico pelo id
        id_arg é o mesmo nome que colocamos em urls.py
        '''
        queryset = self.singleArtigo(id_arg)
        if queryset:
            serializer = ArtigoSerializer(queryset)
            return Response(serializer.data)
        else:
            # response for IDs that is not an existing car
            return Response(
                { 'msg': f'Artigo com id #{id_arg} não existe' }, 
                status.HTTP_400_BAD_REQUEST,
            )
        
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
        '''
        Atualiza um artigo específico pelo id
        id_arg é o mesmo nome que colocamos em urls.py
        '''
        artigo = self.singleArtigo(id_arg)
        serializer = ArtigoSerializer(artigo, data=request.data)
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
