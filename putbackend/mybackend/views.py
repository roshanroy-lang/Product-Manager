from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from .models import product as product_model
from .serializer import product_serializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated


# Create your views here.
@api_view(['GET', 'POST'])
def products(request):
    if request.method == 'GET':
        a = product_model.objects.all()
        b = product_serializer(a, many=True)
        return Response(b.data)

    a = product_serializer(data=request.data)
    if a.is_valid():
        a.save()
        return Response(a.data, status=status.HTTP_201_CREATED)
    return Response(a.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, k):
    product = get_object_or_404(product_model, id=k)

    if request.method == 'GET':
        b = product_serializer(product)
        return Response(b.data)

    if request.method == 'PUT':
        serializer = product_serializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
