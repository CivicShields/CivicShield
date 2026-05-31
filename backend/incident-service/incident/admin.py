from django.contrib import admin
from .models import Incident, TimelineEvents

admin.register(Incident)
admin.register(TimelineEvents)