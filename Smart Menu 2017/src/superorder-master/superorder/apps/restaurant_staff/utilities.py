import requests
import json

def getOrderJson(order):
    orderdir = {
        'tableId' : order.id,
        'tableNum' : order.tableNum,
        'order' : []
    }
    for i in order.orderitem_set.all():
        orderdir['order'].append({
            'id': i.food_id,
            'count': i.count,
            'scount': i.scount,
        })
    return orderdir

def getUserRest(req):
    if req.user.has_perm("authentication.can_manage_restaurant"):
        rest = req.user.restaurant
    else:
        rest = req.user.workat
    return rest

def getRequestHost(req):
    if req.is_secure():
        host = "https://" + req.get_host()
    else:
        host = "http://" + req.get_host()
    return host

def getShortenerURL(url):
    apikey = "AIzaSyD0kbpU9pY626tzY6HPxSkPVNL2OhkZpyw"
    api_url = "https://www.googleapis.com/urlshortener/v1/url?key="+apikey
    payload = {'longUrl': url}
    headers = {'content-type': 'application/json'}
    r = requests.post(api_url, data=json.dumps(payload), headers=headers)
    return json.loads(r.text)['id']


def deleteOrder(r, id):
    try:
        r.order_set.get(id=id).delete()
        return False
    except:
        pass
    return True


def deleteBell(r, id):
    try:
        o = r.order_set.get(id=id)
        o.bell = False
        o.save()
        return False
    except:
        pass
    return True


def editFoodOrder(r, id, order):
    try:
        o = r.order_set.get(id=id)
        food = o.orderitem_set.get(food_id=order["id"])
        scount = order["scount"]
        count = food.count
        if 0 <= scount <= count:
            food.scount = scount
            food.save()
        elif scount == -1:
            food.delete()
        else:
            raise
        return False
    except:
        pass
    return True
