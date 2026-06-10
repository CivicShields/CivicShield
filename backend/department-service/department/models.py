from django.db import models
from django.core.validators import RegexValidator
import uuid

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
 
    name = models.CharField(max_length=100, unique=True)
    contact_email = models.EmailField(unique=True)
    contact_phone = models.CharField(
        validators=[phone_regex], 
        max_length=17, 
        blank=True, 
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

class Assignment(models.Model):
    incident_id = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    assigned_by = models.IntegerField()
    assigned_at = models.DateTimeField(auto_now_add=True)

