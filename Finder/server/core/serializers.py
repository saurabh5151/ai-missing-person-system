from rest_framework import serializers
from .models import MissingPerson

class MissingPersonPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissingPerson
        fields = [
            "id",
            "name",
            "age",
            "last_seen_location",
            "photo",
        ]
