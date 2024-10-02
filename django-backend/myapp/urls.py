from django.urls import path
from .views import prediction

urlpatterns = [
    path('translate/', prediction, name='prediction'),
]