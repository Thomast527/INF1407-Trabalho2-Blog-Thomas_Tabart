from django.urls import path
from blog import views

app_name = 'blog'

urlpatterns = [
    path("lista/", views.ArtigosView.as_view(), name='lista-carros'),
    path('umcarro/', views.ArtigosView.as_view(), name='um-carro'),
]