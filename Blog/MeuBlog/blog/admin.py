from django.contrib import admin
# Register your models here.
from blog.models import Artigo, Categoria
admin.site.register(Artigo)
admin.site.register(Categoria)
