from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect

from django.contrib import auth
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages

from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm, SetPasswordForm

from django.core.files.base import ContentFile

import json
import base64
from .forms import *
from superorder.apps.authentication.models import Restaurant
from .models import Food
from .utilities import *


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def setting_home(request):
    return redirect('ProfileSetting')
    # return render(request, 'restset/setting.html', locals())


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def setting_profile(request):
    """
    1. show restaurant profile
    2. password reset
    """
    page = "profile"
    if request.method == "POST":
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(request, '密碼更改成功!')
            return redirect('ProfileSetting')
        else:
            messages.error(request, '密碼更改失敗，請填寫正確資料。')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'restset/profileSet.html', {'page': page, 'form': form})


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def setting_staff(request):
    page = "staff"
    if request.method == "POST":
        form = SetPasswordForm(request.user.restaurant.employee, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, '員工密碼設定成功!')
            return redirect('StaffSetting')
    else:
        form = SetPasswordForm(request.user.restaurant.employee)
    return render(request, 'restset/staffSet.html', {'page': page, 'form': form})


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def setting_company(request):
    page = "company"
    if request.method == "POST" and 'changeurl' in request.POST:
        form = ChangeUrlForm(request.POST)
        if form.is_valid():
            r = request.user.restaurant
            r.url = form.cleaned_data['url']
            r.save()
            messages.success(request, '網址更改成功!')
            return redirect('CompanySetting')
        else:
            messages.error(request, '網址更改失敗，請確認輸入是否正確。')
    else:
        form = ChangeUrlForm()
    if request.method == "POST" and 'uploadimg' in request.POST:
        imgform = UploadImageForm(request.POST, request.FILES)
        if imgform.is_valid():
            logo = imgform.cleaned_data['logo']
            if logo and logo.size <= 10485760:
                ext = logo.name.split('.')[-1]
                if ext.lower() not in ["png", "jpg", "gif", "jpeg"]:
                    messages.error(request, '副檔名錯誤。')
                    return redirect('CompanySetting')

                r = request.user.restaurant
                if r.logo:
                    r.logo.delete()
                r.logo = logo
                r.save()
                messages.success(request, '上傳成功!')
                return redirect('CompanySetting')
            else:
                if not logo:
                    messages.error(request, '請選擇圖片後再上傳。')
                else:
                    messages.error(request, '圖片大小必須<=10MB。')
        else:
            messages.error(request, '上傳失敗。')

    return render(request, 'restset/companySet.html', {'page': page, 'form': form})


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def setting_menu(request):
    page = "menu"
    if request.is_ajax() and request.method == "POST":
        try:
            hasError = False
            data = json.loads(request.body.decode('utf-8'))
            for i in data:
                try:
                    e = False
                    if i.get("action") == "new":
                        e = NewFood(request.user.restaurant,i['food'])
                    elif i.get("action") == "edit":
                        e = EditFood(request.user.restaurant,i['food'])
                    elif i.get("action") == "delete":
                        e = DeleteFood(request.user.restaurant,i['food'])
                    if e:
                        hasError = True
                except:
                    print("error")
                    hasError = True
            if hasError:
                messages.warning(request, '儲存完成，但發生某些錯誤。')
            else:
                messages.success(request, '儲存成功!')
            return HttpResponse("success")
        except:
            messages.error(request, '儲存過程發生錯誤。')
            return HttpResponse("error")

    return render(request, 'restset/menuSet.html', {'page': page})


@permission_required('authentication.can_manage_restaurant', raise_exception=True)
def output(request):
    return render(request, 'restset/output.html')
