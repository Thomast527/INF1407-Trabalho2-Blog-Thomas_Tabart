from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Artigo
from .serializers import ArtigoSerializer
from django.contrib.auth.models import User

class ArtigosView(APIView):

    def get(self, request):
        artigos = Artigo.objects.all().order_by('-data_publicacao')
        serializer = ArtigoSerializer(artigos, many=True)
        return Response(serializer.data)
    
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
    def post(self, request):
        serializer = ArtigoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
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
        
    def put(self, request, id_arg):
        '''
        Atualiza um carro específico pelo id
        id_arg é o mesmo nome que colocamos em urls.py
        '''
        artigo = self.singleArtigo(id_arg)
        serializer = ArtigoSerializer(artigo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)