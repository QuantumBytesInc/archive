# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.conf.urls import url, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from django.conf import settings
from django.http import HttpResponse
from django.views.static import serve
from django.views.decorators.cache import cache_page

# Project includes
from project import views
from project.interface import views as interface
from project.news.feeds import LatestEntriesFeed
from project.utils import sitemap
from cas.views import login, logout
from django_cloud_update.utils import sync_cloud, fetch

# Autodiscover for admin
admin.autodiscover()

# Basic
urlpatterns = [
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT})
]

# External views
urlpatterns += [
    url(r'^$', views.main_view),
    url(r'^index', cache_page(60 * 15)(views.main_view)),
    url(r'^latest/feed/$', cache_page(60 * 15)(LatestEntriesFeed())),
    url(r'^sitemap', sitemap),
    url(r'^ht/$', include('health_check.urls')),
]

# Interface
urlpatterns += [
    url(r'^interface/request', interface.api_request),
]

# Robots
if settings.RUN_ENV != 'production':
    urlpatterns += [
        url(r'^robots\.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")),
    ]
else:
    urlpatterns += [
        url(r'^robots\.txt$',
            cache_page(60 * 15)(lambda r: HttpResponse("User-agent: *\nDisallow:", content_type="text/plain"))),
    ]

# Authentication
urlpatterns += [
    url(r'^accounts/login/$', login, name='login'),
    url(r'^accounts/logout/$', logout, name='logout'),
]

# Internal stuff
if settings.RUN_ENV != 'production':
    urlpatterns += [
        url(r'^fetch/', fetch),
        url(r'^sync/', sync_cloud),
    ]


# Catch all
urlpatterns += [
    url(r'^.*/$', views.main_view),
]

# Static files
urlpatterns += staticfiles_urlpatterns()
