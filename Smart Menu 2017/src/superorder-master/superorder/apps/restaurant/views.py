from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required, permission_required

from django.contrib import messages

from superorder.apps.authentication.models import Restaurant
from superorder.apps.restaurant_setting.models import *
from .utilities import *
from datetime import datetime
import json
from django.core.serializers.json import DjangoJSONEncoder
from superorder.utilities.utilities import QueryEscape

# https://host/r/<restUrl>/
def menuPreview(request, restUrl):
    rest = get_object_or_404(Restaurant, url__iexact=restUrl)
    preview = True
    foodsJsonPath = "/r/" + restUrl + "/foods.json"
    messages.warning(request, "此菜單只能預覽不能點餐！")
    return render(request, 'rest/menu.html',locals())

# https://host/r/<restUrl>/order/<orderId>/
def menuOrder(request, restUrl, orderId):
    rest = get_object_or_404(Restaurant, url__iexact=restUrl)
    restPath = "/r/" + restUrl + "/"
    foodsJsonPath = restPath + "foods.json"
    ordered = False
    try:
        order = rest.order_set.get(orderId=orderId)
        if order.ordered:
            ordered = True
            messages.warning(request, str(order.tableNum) + "桌 : 已完成點餐，此頁面只能預覽。")
        else:
            messages.success(request, str(order.tableNum) + "桌 : QR code正確，開始點餐。")
    except:
        return HttpResponseRedirect(restPath)
    preview = False
    return render(request, 'rest/menu.html', locals())

# https://host/r/<restUrl>/order/<orderId>/orderDetail
def orderDetail(request, restUrl, orderId):
    rest = get_object_or_404(Restaurant, url__iexact=restUrl)
    restPath = "/r/" + restUrl + "/"
    idFoodsJsonPath = restPath + "idFoods.json"
    try:
        order = rest.order_set.get(orderId=orderId)
        if not order.ordered:
            return HttpResponseRedirect("./")
    except:
        return HttpResponseRedirect(restPath)
    return render(request, 'rest/orderDetail.html', locals())

##    Set Order    ##
# https://host/r/<restUrl>/order/<orderId>/callBell
def callBell(request, restUrl, orderId):
    """Set order.bell == True if not have be called"""
    if request.is_ajax() and request.method == "GET":
        try:
            rest = Restaurant.objects.get(url__iexact=restUrl)
            order = rest.order_set.get(orderId=orderId)
            if order.bell:
                return HttpResponse("called")
            else:
                order.bell = True
                order.bellTime = datetime.now()
                order.save()
                return HttpResponse("success")
        except:
            return HttpResponse("error")
    return HttpResponse("error")

# https://host/r/<restUrl>/order/<orderId>/setOrder
def setOrder(request, restUrl, orderId):
    """Add data into order"""
    if request.is_ajax() and request.method == "POST":
        try:
            rest = Restaurant.objects.get(url__iexact=restUrl)
            order = rest.order_set.get(orderId=orderId)
            data = json.loads(request.body.decode('utf-8'))
            if order.ordered:
                return HttpResponse("ordered")
            if SetOrderWithData(order,data):
                return HttpResponse("success")
        except:
            return HttpResponse("error")
    return HttpResponse("error")


##    JSON    ##
def foods(request, restUrl):
    rest = get_object_or_404(Restaurant, url__iexact=restUrl)
    foods = rest.food_set.values(
        'id', 'name', 'price', 'intro', 'src', 'category', 'top10')
    foods = QueryEscape(foods, ['name', 'intro', 'category'])
    return HttpResponse(json.dumps(list(foods), cls=DjangoJSONEncoder),
                        content_type="application/json")

def idFoods(request, restUrl):
    rest = get_object_or_404(Restaurant, url__iexact=restUrl)
    foods = rest.food_set.values(
        'id', 'name', 'price', 'intro', 'src', 'category', 'top10')
    foods = QueryEscape(foods, ['name', 'intro', 'category'])
    idfoods = dict()
    for i in foods:
        idfoods.update({str(i["id"]):i})
    return HttpResponse(json.dumps(idfoods, cls=DjangoJSONEncoder),
                        content_type="application/json")


# https://host/r/<restUrl>/order/<orderId>/orderDetail.json
def orderDetailJson(request, restUrl, orderId):
    rest = get_object_or_404(Restaurant, url__iexact=restUrl)
    order = get_object_or_404(rest.order_set,orderId=orderId)
    od = list(order.orderitem_set.values('food_id', 'count', 'scount'))
    rod = []
    for i in od:
        rod.append(
            {
                'id':i['food_id'],
                'count':i['count'],
                'scount': i['scount'],
            })
    return HttpResponse(json.dumps(rod, cls=DjangoJSONEncoder),
                        content_type="application/json")
