"""superorder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include,url
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static
from superorder.apps.core.views import home

urlpatterns = [
    url(r'^$', home, name='home'),
    url(r'^auth/', include('superorder.apps.authentication.urls')),
    url(r'^lib/', include('superorder.apps.library.urls')),
    url(r'^setting/', include('superorder.apps.restaurant_setting.urls')),
    url(r'^staff/', include('superorder.apps.restaurant_staff.urls')),
    url(r'^r/(?P<restUrl>[\w-]+)/', include('superorder.apps.restaurant.urls')),
    url(r'^admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)