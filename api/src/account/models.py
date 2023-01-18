from typing import TypeVar
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from utils.base.validators import validate_special_char, validate_phone
from django.dispatch import receiver
from django.db.models.signals import post_save


T = TypeVar('T', bound=AbstractBaseUser)


class UserManager(BaseUserManager):
    def create_base_user(
        self, email, is_active=True,
        is_staff=False, is_admin=False
    ) -> T:
        if not email:
            raise ValueError("User must provide an email")

        user: User = self.model(
            email=self.normalize_email(email)
        )
        user.active = is_active
        user.admin = is_admin
        user.staff = is_staff
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(
        self, email, password=None, is_active=True,
        is_staff=False, is_admin=False
    ) -> T:
        user = self.create_base_user(email, is_active, is_staff, is_admin)
        if not password:
            raise ValueError("User must provide a password")
        user.set_password(password)
        user.save()
        return user

    def create_staff(self, email, password=None) -> T:
        user = self.create_user(email=email, password=password, is_staff=True)
        return user

    def create_superuser(self, email, password=None) -> T:
        user = self.create_user(
            email=email, password=password, is_staff=True, is_admin=True)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)

    active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"

    objects = UserManager()

    def has_perm(self, perm, obj=None):  # pragma: no cover
        return True

    def has_module_perms(self, app_label):  # pragma: no cover
        return True

    def __str__(self) -> str:
        return self.email


class Profile(models.Model):
    SEX = (
        ('M', 'Male'),
        ('F', 'Female'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    fullname = models.CharField(
        max_length=50, validators=[validate_special_char])
    sex = models.CharField(
        choices=SEX, max_length=1, blank=True)
    phone = models.CharField(max_length=20, validators=[validate_phone])
    country = models.CharField(max_length=60, blank=True)

    def __str__(self) -> str:
        return self.fullname


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
