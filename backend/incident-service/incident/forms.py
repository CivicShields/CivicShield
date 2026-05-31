from django import forms
from .models import Incident


class IncidentForm(forms.ModelForm):
    class Meta:
        model = Incident
        fields = ["department_id", "category", "severity", "status", "description", "location"]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.fields["status"].disabled = True
    