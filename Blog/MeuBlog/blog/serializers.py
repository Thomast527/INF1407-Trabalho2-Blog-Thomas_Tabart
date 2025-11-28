from rest_framework import serializers
from .models import Artigo, Categoria

class ArtigoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artigo
        fields = '__all__'
        read_only_fields = ['autor']  

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['autor'] = request.user
        return super().create(validated_data)

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

