from django.db import models
from django.contrib.auth.models import User
from .helpers import get_file_path

# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=20)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=50)

    applicant = models.OneToOneField(User, on_delete=models.CASCADE)
    applicant_name = models.CharField(max_length=20)
    applicant_phone = models.CharField(max_length=15)
    applicant_email = models.EmailField()

    url = models.SlugField(max_length=20, unique=True)
    logo = models.ImageField(upload_to=get_file_path, null=True, blank=True)

    employee = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="workat", null=True)

    is_active = models.BooleanField(default=False)
    def __str__(self):
        return self.name
    class Meta:
        permissions = (
            ("can_manage_restaurant","Can manage restaurant"),
        )
