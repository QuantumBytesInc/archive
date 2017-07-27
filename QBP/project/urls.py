# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cms.sitemaps import CMSSitemap
from django.conf import settings
from django.conf.urls import *  # NOQA
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from cas.views import login, logout
from project import utils
from project.views import send_mail

admin.autodiscover()

urlpatterns = [
    url(r'^ht/$', include('health_check.urls')),
    url(r'^user/login/$', login, name='login'),
    url(r'^user/logout/$', logout, name='logout'),
    url(r'^send_request/', send_mail),
    url(r'^admin/', include(admin.site.urls)),  # NOQA
    url(r'^sitemap\.xml$', sitemap,
        {'sitemaps': {'cmspages': CMSSitemap}}),
    url(r'^select2/', include('django_select2.urls')),
    url(r'^', include('cms.urls')),
    url(r'^ht/$', include('health_check.urls')),
]

# Internal stuff
urlpatterns += [
    url(r'^system/update_all', utils.update_all),
]
