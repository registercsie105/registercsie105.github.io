from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse

from django.utils.http import is_safe_url


from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

from django.contrib import messages
from superorder.apps.authentication.models import Restaurant
from .forms import RegisterForm
from .utilities import *

def login(request):
    login_success_path = reverse('login_success')
    if request.user.is_authenticated():
        messages.warning(request,"帳號已登入，請先登出!")
        return HttpResponseRedirect(reverse('home'))

    if request.method == "POST":
        next = request.POST.get('next',login_success_path)
        if not is_safe_url(next):
            next = login_success_path
        username = request.POST.get('username','')
        password = request.POST.get('password','')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            auth.login(request, user)
            messages.success(request,"登入成功!")
            return HttpResponseRedirect(next)
        else:
            messages.error(request,"帳號或密碼錯誤，請重新輸入。")
    else:
        next = request.GET.get('next',login_success_path)
    return render(request,'login.html',locals())

def staffLogin(request):
    login_success_path = reverse('login_success')
    if request.user.is_authenticated():
        messages.warning(request, "帳號已登入，請先登出!")
        return HttpResponseRedirect(reverse('home'))

    if request.method == "POST":
        next = request.POST.get('next', login_success_path)
        if not is_safe_url(next):
            next = login_success_path

        # get employee username from Restaurant applicant
        username = request.POST.get('username', '')
        try:
            u = User.objects.get(username=username)
            employeeName = u.restaurant.employee.username
        except:
            employeeName = None

        password = request.POST.get('password', '')
        user = auth.authenticate(username=employeeName, password=password)
        if user is not None and user.is_active:
            auth.login(request, user)
            messages.success(request, "員工登入成功!")
            return HttpResponseRedirect(next)
        else:
            messages.error(request, "帳號或密碼錯誤，請重新輸入。")
    else:
        next = request.GET.get('next', login_success_path)
    return render(request, 'staffLogin.html', locals())

@login_required
def login_success(request):
    if request.user.has_perm("authentication.can_manage_restaurant"):
        return HttpResponseRedirect(reverse('setting'))
    elif Restaurant.objects.filter(employee=request.user).exists():
        return HttpResponseRedirect(reverse('counter'))
    else:
        return HttpResponseRedirect(reverse('home'))

def logout(request):
    auth.logout(request)
    messages.success(request,"帳號已登出")
    return HttpResponseRedirect(reverse('home'))

def register(request):
    if request.user.is_authenticated():
        messages.warning(request,"帳號已登入，請先登出!")
        return HttpResponseRedirect(reverse('home'))
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        rest_from = RegisterForm(request.POST)
        if all((form.is_valid(),rest_from.is_valid())):
            user = form.save()
            rest = rest_from.save(commit=False)
            rest.applicant = user
            rest.url = genUniqueRandomUrl()
            rest.employee = getNewEmployeeUser()
            rest.save()

            # add can_manage_restaurant permission
            content_type = ContentType.objects.get_for_model(Restaurant)
            permission = Permission.objects.get(
                content_type=content_type, codename='can_manage_restaurant')
            user.user_permissions.set([permission])
            messages.success(request,"註冊成功!")
            return HttpResponseRedirect('/auth/login/')
        else:
            messages.error(request,"註冊失敗，請填寫正確資料!")
    else:
        form = UserCreationForm()
        rest_from = RegisterForm()
    return render(request,'register.html',locals())
