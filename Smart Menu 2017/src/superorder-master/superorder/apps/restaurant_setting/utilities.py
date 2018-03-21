from .forms import *
import re
import base64
from django.core.files.base import ContentFile
from superorder.utilities.utilities import getRandomFileName
from PIL import Image
from django.contrib import messages


def isBase64Image(imgStr):
    """check imgStr is a base64 encoded image"""
    if re.match("^data\:image\/(png|jpg|jpeg|gif)\;base64\,", imgStr):
        return True
    else:
        return False

def getImgContentFile(img):
    """conver base64 image to ContentFile"""
    format, imgstr = img.split(';base64,')
    ext = format.split('/')[-1]
    file = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
    return file

def NewFood(r, foods):
    """add foods into r(restaurant)

    r     : Restaurant
    foods : list of dict
    """
    hasError = False
    for i in foods:
        try:
            food_form = FoodForm(i)
            if food_form.is_valid():
                food = food_form.save(commit=False)

                # store base64 type image into food.src
                if isBase64Image(i["src"]):
                    file = getImgContentFile(i["src"])
                    try:
                        Image.open(file)
                        food.src = file
                    except IOError:
                        print("Not a image.")
                        hasError = True
                food.restaurant = r
                food.save()
            else:
                hasError = True
        except:
            print("new error")
            hasError = True
    return hasError


def EditFood(r, foods):
    """edit foods from r(restaurant)"""
    hasError = False
    for i in foods:
        try:
            f = r.food_set.get(pk=i["id"])
            food_form = FoodForm(i, instance=f)
            if food_form.is_valid():
                food = food_form.save(commit=False)
                if isBase64Image(i["src"]):
                    file = getImgContentFile(i["src"])
                    try:
                        Image.open(file)
                        food.src.delete()
                        food.src = file
                    except IOError:
                        print("Not a image.")
                        hasError = True
                food.save()
            else:
                hasError = True
        except:
            print("edit error")
            hasError = True
    return hasError

def DeleteFood(r, foods):
    """delete foods from r(restaurant)"""
    hasError = False
    for i in foods:
        try:
            f = r.food_set.get(pk=i["id"])
            f.src.delete()
            f.delete()
        except:
            print("delete error")
            hasError = True
    return hasError
