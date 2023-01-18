from django.urls import path
from . import views

app_name = 'auth'
urlpatterns = [
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('token/user/refresh/',
         views.TokenRefreshAPIView.as_view(), name='refresh'),
    path('user/', views.UserAPIView.as_view(), name='user'),
    path('speech-to-text/', views.SpeechToTextView.as_view(), name='speech'),
]
