from django.db import models
from .helpers import get_file_path
from superorder.apps.authentication.models import Restaurant
import uuid
from datetime import datetime

# Create your models here.
class Food(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=5, decimal_places=1)
    intro = models.TextField(blank=True)
    src = models.ImageField(upload_to=get_file_path, null=True, blank=True)
    category = models.CharField(max_length=50)
    top10 = models.BooleanField(default=False)
    restaurant = models.ForeignKey(Restaurant)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']

class Order(models.Model):
    orderId = models.UUIDField(default=uuid.uuid4, editable=False)
    creation_date = models.DateTimeField(default=datetime.now)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    peopleNum = models.PositiveIntegerField()
    tableNum = models.PositiveIntegerField()
    bell = models.BooleanField(default=False)
    bellTime = models.DateTimeField(default=datetime.now, blank=True)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        return self.restaurant.name + " : " + str(self.orderId)
    class Meta:
        ordering = ('creation_date',)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    count = models.PositiveIntegerField()
    scount = models.PositiveIntegerField()

    def __str__(self):
        return str(self.order)+ " : " + self.food.name
