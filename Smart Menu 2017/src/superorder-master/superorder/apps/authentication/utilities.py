from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from superorder.apps.authentication.models import Restaurant

def genUniqueRandomUrl():
    while True:
        r = get_random_string(4)
        if not Restaurant.objects.filter(url__iexact=r).exists():
            return r


def genUniqueRandomUsername():
    while True:
        u = get_random_string(30)
        if not User.objects.filter(username=u).exists():
            return u

def getNewEmployeeUser():
    return User.objects.create_user(username=genUniqueRandomUsername())
