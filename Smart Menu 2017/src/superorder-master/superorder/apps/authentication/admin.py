from django.contrib import admin
from superorder.apps.authentication.models import Restaurant

# Register your models here.
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('id','name','phone','address',
                    'applicant', 'applicant_phone', 'is_active', 'url', 'employee')
    search_fields = ('name',)
    list_filter = ('is_active',)
    ordering = ('name',)


admin.site.register(Restaurant,RestaurantAdmin)
