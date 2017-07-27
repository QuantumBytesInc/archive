"""appliaction URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
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
from django.contrib import admin
from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.conf.urls import handler404

from project.internalapi.utils import api_request
from project.user.views import reset, recover, activate
from project.settings import PORTAL_URL

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'', include('mama_cas.urls')),
    url(r'^interface/request', api_request),
    url(r'^reset/', reset),
    url(r'^reset_successfully/', TemplateView.as_view(template_name='reset_successfully.html')),
    url(r'^recover/', recover),
    url(r'^recover_successfully/', TemplateView.as_view(template_name='recover_successfully.html')),
    url(r'^activate/', activate),
    url(r'^activate_successfully/', TemplateView.as_view(template_name='activate_successfully.html')),
    url(r'^ht/$', include('health_check.urls')),
    url(r'^grappelli/', include('grappelli.urls')),
]

urlpatterns += (url(r'^admin/django-ses/', include('django_ses.urls')),)

handler404 = 'project.utils.error404'
