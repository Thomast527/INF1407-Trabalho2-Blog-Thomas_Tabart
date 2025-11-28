from django.urls import path
from accounts import views
from django.urls import include
app_name = 'accounts'
urlpatterns = [
    path('token-auth/', views.CustomAuthToken.as_view(), name='token-auth'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('register/', views.RegisterView.as_view(), name="register"),
    path("me/", views.MeView.as_view()),

]