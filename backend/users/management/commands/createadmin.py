from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = 'admin@velaur.pk'
        username = 'admin'
        password = 'velaur@2024'
        
        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write('✅ Superuser created!')
        else:
            self.stdout.write('⚠️ Admin already exists!')