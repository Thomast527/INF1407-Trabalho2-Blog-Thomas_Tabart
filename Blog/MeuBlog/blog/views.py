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

    def post(self, request):
        serializer = ArtigoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
