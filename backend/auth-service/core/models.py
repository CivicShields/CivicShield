from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('normal_user', 'Normal User'),
        ('department_user', 'Department User'),
        ('admin', 'Admin'),
    ]
    email = models.EmailField(unique=True) 
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='normal_user')
    department_id = models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email