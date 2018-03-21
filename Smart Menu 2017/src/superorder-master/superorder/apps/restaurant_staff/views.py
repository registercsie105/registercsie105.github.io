from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required

from django.contrib import messages

from superorder.apps.authentication.models import Restaurant
from superorder.apps.restaurant_setting.models import *
from superorder.apps.restaurant_setting.forms import OrderForm

import json
from django.core.serializers.json import DjangoJSONEncoder
from superorder.utilities.utilities import QueryEscape
from .utilities import *

@login_required
def counter(request):
    rest = getUserRest(request)
    idFoodsJsonPath = "/r/" + rest.url + "/idFoods.json"
    return render(request, 'reststaff/counter.html', locals())


@login_required
def waiter(request):
    rest = getUserRest(request)
    idFoodsJsonPath = "/r/" + rest.url + "/idFoods.json"
    return render(request, 'reststaff/waiter.html', locals())


@login_required
def chef(request):
    rest = getUserRest(request)
    idFoodsJsonPath = "/r/" + rest.url + "/idFoods.json"
    return render(request, 'reststaff/chef.html', locals())


@login_required
def ordersJson(request):
    rest = getUserRest(request)
    ordersQuery = rest.order_set.filter(ordered=True).order_by('creation_date')
    orders = []
    for i in ordersQuery:
        orders.append(getOrderJson(i))
    return HttpResponse(json.dumps(orders, cls=DjangoJSONEncoder),
                        content_type="application/json")

@login_required
def bellsJson(request):
    """response call bell Json order by bellTime"""
    rest = getUserRest(request)
    bellsQuery = rest.order_set.filter(bell=True).order_by('bellTime')
    bells = []
    for i in bellsQuery:
        bells.append({
            'tableId': i.id,
            'tableNum': i.tableNum
        })
    return HttpResponse(json.dumps(bells, cls=DjangoJSONEncoder),
                        content_type="application/json")


@login_required
def QrcodeUrlJson(request):
    """Create a order and return Qrcode Url"""
    if request.is_ajax() and request.method == "POST":
        try:
            rest = getUserRest(request)
            data = json.loads(request.body.decode('utf-8'))
            order_form = OrderForm(data)
            if order_form.is_valid():
                order = order_form.save(commit=False)
                order.restaurant = rest
                order.save()
                url = getRequestHost(request) + "/r/" + \
                    rest.url + "/order/" + str(order.orderId) + "/"
                goo_url = getShortenerURL(url)
                # TEST
                # print(url)
                # goo_url = "https://goo.gl/mqaH"
                return HttpResponse(goo_url)
            raise
        except:
            return HttpResponse("error")
    return HttpResponse("error")


@login_required
def editOrder(request):
    if request.is_ajax() and request.method == "POST":
        try:
            rest = getUserRest(request)
            data = json.loads(request.body.decode('utf-8'))
            e = True
            if data["action"] == "deleteOrder":
                e = deleteOrder(rest, data["tableId"])
            elif data["action"] == "deleteBell":
                e = deleteBell(rest, data["tableId"])
            elif data["action"] == "editOrder":
                e = editFoodOrder(rest, data["tableId"], data["order"])
            if e: raise
            return HttpResponse("success")
        except Exception as e:
            return HttpResponse("error")
    return HttpResponse("error")
