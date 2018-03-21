from datetime import datetime
from superorder.apps.restaurant_setting.models import OrderItem

def checkOrder(rest,data):
    if not data: return False
    try:
        for d in data:
            # check all food in the rest
            if not rest.food_set.filter(id=d["id"]).exists():
                return False
            # check count >= 0
            if d["count"] < 0:
                return False
    except:
        return False
    return True

def SetOrderWithData(order,data):
    """Add data(foodId,count) into the order"""
    try:
        # print(order, data)
        if not checkOrder(order.restaurant, data):
            return False
        order.orderitem_set.all().delete()  # clear order
        for d in data:
            c = d["count"]
            if c == 0: continue
            OrderItem.objects.create(order=order, food_id=d["id"], count=c, scount=c)
        order.creation_date = datetime.now()
        order.ordered = True
        order.save()
        return True
    except:
        return False
    return False
