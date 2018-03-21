from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', RedirectView.as_view(pattern_name='home')),
    url(r'^resturent_name.json$',views.resturent_name),
    url(r'^resturent_foods.json$', views.resturent_foods),
]
