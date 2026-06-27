from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test users if they do not exist'

    def handle(self, *args, **options):
        users_data = [
            {'username': 'admin@example.com', 'email': 'admin@example.com', 'password': 'AdminPass123!', 'role': 'admin'},
            {'username': 'dept@example.com', 'email': 'dept@example.com', 'password': 'DeptPass123!', 'role': 'normal_user'},
            {'username': 'user1@example.com', 'email': 'user1@example.com', 'password': 'User1Pass123!', 'role': 'normal_user'},
            {'username': 'user2@example.com', 'email': 'user2@example.com', 'password': 'User2Pass123!', 'role': 'normal_user'},
        ]

        for data in users_data:
            username = data['username']
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(username=username, email=data['email'], password=data['password'])
                # If your User model has a 'role' field, set it
                if hasattr(user, 'role'):
                    user.role = data['role']
                    user.save()
                self.stdout.write(self.style.SUCCESS(f'Created user {username}'))
            else:
                self.stdout.write(f'User {username} already exists, skipping.')