from venv import create

from django.db import models

# Create your models here.
class Incident(models.Model):
    SEVERITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ("urgent", "Urgent"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
    ]
    id = models.IntegerField(primary_key=True)
    reporter_id = models.IntegerField(blank=False, null=False)
    department_id = models.IntegerField(blank=False, null=False)
    category  = models.CharField(max_length=50, blank=False, null=False)
    severity  = models.CharField(max_length=20, choices=SEVERITY_CHOICES, blank=False, null=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    description = models.CharField(max_length=500, blank=False, null=False)
    location = models.CharField(max_length=100, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TimelineEvents(models.Model):
    id = models.IntegerField(primary_key=True)
    incident_id = models.IntegerField(blank=False, null=False)
    actor_id = models.IntegerField(blank=False, null=False)
    event_type = models.CharField(max_length=50, blank=False, null=False)
    note = models.CharField(max_length=500, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

