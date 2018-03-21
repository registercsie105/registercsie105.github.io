from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', RedirectView.as_view(pattern_name='home')),
    url(r'^register/$',views.register,name='register'),
    url(r'^login/$',views.login,name='login'),
    url(r'^staffLogin/$', views.staffLogin, name='staffLogin'),
    url(r'^login_success/$',views.login_success,name='login_success'),
    url(r'^logout/$',views.logout,name='logout'),
]