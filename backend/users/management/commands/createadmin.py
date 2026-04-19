from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = 'admin@velaur.pk'
        username = 'admin'
        password = 'Velaur@ssh'

        if User.objects.filter(email=email).exists():
            # Already exists — update password
            user = User.objects.get(email=email)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write('✅ Admin password updated!')
        else:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write('✅ Superuser created!')