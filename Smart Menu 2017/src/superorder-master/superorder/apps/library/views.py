from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect


from django.contrib.auth.decorators import login_required, permission_required

from superorder.apps.authentication.models import Restaurant

import json
from django.core.serializers.json import DjangoJSONEncoder
from superorder.utilities.utilities import QueryEscape

# Create your views here.
def resturent_name(request):
    r = Restaurant.objects.values('name', 'url','logo').order_by('-pk')
    r = QueryEscape(r,['name'])
    return HttpResponse(json.dumps(list(r)), content_type="application/json")


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def resturent_foods(request):
    foods = request.user.restaurant.food_set.values(
        'id', 'name', 'price', 'intro', 'src', 'category', 'top10')
    foods = QueryEscape(foods, ['name', 'intro', 'category'])
    return HttpResponse(json.dumps(list(foods), cls=DjangoJSONEncoder),
                        content_type="application/json")
