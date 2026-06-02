from rest_framework import serializers
from .models import product 
class product_serializer(serializers.ModelSerializer):
    class Meta:
        model=product
        fields='__all__'