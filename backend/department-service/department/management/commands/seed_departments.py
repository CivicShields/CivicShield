from django.core.management.base import BaseCommand
from department.models import Department   # adjust import to your actual model

class Command(BaseCommand):
    help = 'Creates test departments if they do not exist'

    def handle(self, *args, **options):
        depts_data = [
            {'name': 'Fire Department', 'contact_email':'fire@department.com', 'contact_phone': '+265082772622'},
            {'name': 'Water Department', 'contact_email': 'water@department.com', 'contact_phone': '+265082772623'},
            {'name': 'Police Department', 'contact_phone': 'police@department.com', 'contact_phone': '+265082772624'},
        ]

        for data in depts_data:
            name = data['name']
            if not Department.objects.filter(name=name).exists():
                Department.objects.create(**data)
                self.stdout.write(self.style.SUCCESS(f'Created department {name}'))
            else:
                self.stdout.write(f'Department {name} already exists, skipping.')