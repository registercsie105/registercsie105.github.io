from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', views.setting_home, name="setting"),
    url(r'^profile/$', views.setting_profile, name="ProfileSetting"),
    url(r'^staff/$', views.setting_staff, name="StaffSetting"),
    url(r'^company/$', views.setting_company, name="CompanySetting"),
    url(r'^menu/$', views.setting_menu, name="MenuSetting"),
    url(r'^output/$', views.output, name="output"),
]
