from django.contrib import admin
from superorder.apps.restaurant_setting.models import *

# Register your models here.

class FoodAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'top10', 'restaurant')
    search_fields = ('name',)
    list_filter = ('category',)
    ordering = ('restaurant','id')


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'restaurant', 'orderId', 'creation_date',
                    'peopleNum', 'tableNum', 'bell', 'bellTime', 'ordered')
    list_filter = ('restaurant',)
    ordering = ('restaurant', 'creation_date')


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id','order', 'food', 'count', 'scount')
    list_filter = ('order',)
    ordering = ('order','id')

admin.site.register(Food, FoodAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
