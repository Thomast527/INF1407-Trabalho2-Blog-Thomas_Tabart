from django.urls import path
from blog import views

app_name = 'blog'

urlpatterns = [
    path("lista/", views.ArtigosView.as_view(), name='lista-carros'),
    path('umartigo/', views.ArtigoView.as_view(), name='um-carro'),
    path('umartigo/<int:id_arg>/', views.ArtigoView.as_view(), name='consulta-artigo'),
]