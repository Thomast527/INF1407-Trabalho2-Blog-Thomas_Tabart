"""
URL configuration for MeuBlog project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.urls import path, include
from MeuBlog.settings import SERVER_URL

from rest_framework import routers
from rest_framework import permissions
from rest_framework.documentation import include_docs_urls
from rest_framework.schemas import get_schema_view
from drf_yasg.views import get_schema_view as yasg_schema_view
from drf_yasg import openapi


schema_view = yasg_schema_view(
    openapi.Info(
        title="API Blog",
        default_version='v1',
        description="API for the Blog",
        contact=openapi.Contact(email="thomas@aqui.com"),
        license=openapi.License(name='GNU GPLv3'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url=SERVER_URL,
)

schema_view.security_definitions = {
    "Token": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "description": "Use o formato: Token <seu_token>",
    }
}



urlpatterns = [
    path('docs/', include_docs_urls(title = 'Documentação da API')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("admin/", admin.site.urls),
    path("blog/", include ('blog.urls')),
    path('accounts/', include('accounts.urls')),
    path('openapi', get_schema_view(
        title="API para Artigos", description="API para obter dados dos artigos",
        ), 
        name = 'openapi-schema'
    ),    
]
