from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', views.menuPreview,name="menuPreview"),
    url(r'^order/(?P<orderId>[0-9a-f-]{36})/$', views.menuOrder),
    url(r'^order/(?P<orderId>[0-9a-f-]{36})/callBell$', views.callBell),
    url(r'^order/(?P<orderId>[0-9a-f-]{36})/setOrder$', views.setOrder),
    url(r'^order/(?P<orderId>[0-9a-f-]{36})/orderDetail$', views.orderDetail),
    url(r'^order/(?P<orderId>[0-9a-f-]{36})/orderDetail.json$', views.orderDetailJson),
    url(r'^foods.json$', views.foods),
    url(r'^idFoods.json$', views.idFoods),
]
