from django.contrib import admin

from django.contrib import admin
from .models import Notification, Escalation

admin.site.register(Notification)
admin.site.register(Escalation)