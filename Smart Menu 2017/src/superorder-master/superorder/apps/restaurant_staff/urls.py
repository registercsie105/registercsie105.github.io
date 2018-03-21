from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', RedirectView.as_view(pattern_name='home')),
    url(r'^counter/$', views.counter, name="counter"),
    url(r'^waiter/$', views.waiter, name="waiter"),
    url(r'^chef/$', views.chef, name="chef"),
    url(r'^orders.json$', views.ordersJson, name="orders"),
    url(r'^bells.json$', views.bellsJson, name="bells"),
    url(r'^QrcodeUrl.json$', views.QrcodeUrlJson, name="QrcodeUrl"),
    url(r'^editOrder$', views.editOrder, name="editOrder"),
]
