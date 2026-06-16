from django.db import models
import uuid

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('incident_created', 'Incident Created'),
        ('status_update', 'Status Update'),
        ('assignment', 'Assignment'),
        ('escalation', 'Escalation'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.IntegerField(null=True)  # individual user
    department_id = models.UUIDField(null=True) 
    incident_id = models.UUIDField()
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.type

class Escalation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident_id = models.UUIDField()
    triggered_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return str(self.incident_id)