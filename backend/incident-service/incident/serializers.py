from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    severity = serializers.ChoiceField(choices=Incident.SEVERITY_CHOICES)
    class Meta:
        model = Incident
        fields = ["id", "reporter_id", "department_id", "category", "severity", "status", "description", "location"]
        extra_kwargs = {
            "id": {"read_only": True},
        }
