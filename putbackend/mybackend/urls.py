from django.urls import path
from . import views

urlpatterns = [
    path('api/products/', views.products),
    path('api/products/<int:k>/', views.product_detail),
]