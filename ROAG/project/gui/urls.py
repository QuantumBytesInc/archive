# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.views.static import serve
from django.views.decorators.csrf import csrf_exempt
# View imports
from project.interface import views as interface
from project.internalapi import utils as api
from project.stats.views import AnalyticsIndexView
from project import utils
from cas.views import login, logout
from django.http import HttpResponse
# Discover
admin.autodiscover()

# URLs
urlpatterns = [
    url(r'^grappelli/', include('grappelli.urls')),  # grappelli URLS
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', interface.main),
    url(r'^interface/request/', interface.api_request),
    url(r'^interface/login/', interface.login_request),
    url(r'^interface/logout/', interface.logout_request),
    url(r'^interface/launcher/', interface.launcher_request),
    url(r'^interface/log_anonymous/', interface.log_anonymous_request),
    url(r'^interface/log/', interface.log_request),
    url(r'^internal/request/', api.internal_request),
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    url(r'^imperavi/', include('imperavi.urls')),
    url(r'^tinymce/', include('tinymce.urls')),
    url(r'^ht/$', include('health_check.urls')),
    url(r'^stats/stats', AnalyticsIndexView.as_view(), name='Stats'),
    url(r'^robots\.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")),
]

urlpatterns += [
    url(r'^accounts/login/$', login, name='login'),
    url(r'^accounts/logout/$', logout, name='logout'),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]

# Internal stuff
urlpatterns += [
    url(r'^system/update_all/', utils.update_all),
    url(r'^system/update/', utils.update),
]

urlpatterns += staticfiles_urlpatterns()


