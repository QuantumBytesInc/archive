# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python includes
import logging

# Django includes
from django.shortcuts import render, redirect
from django.conf import settings
# Project includes
from project.settings.base import STATIC_URL, RUN_ENV, BASE_URL, CAS_SERVER_URL

log = logging.getLogger(__name__)


def main_view(request):
    if request.get_host() == 'portal.annorath-game.com':
        return redirect('https://www.annorath-game.com', permanent=True)
    elif request.get_host() == 'annorath-game.com':
        return redirect('https://www.annorath-game.com' + request.path, permanent=True)
    else:
        if settings.RUN_ENV != 'production':
            show_live = request.GET.get('show_live', 'false')
            if (show_live == 'true'):
                return render(request, "main/index.html",
                              {'content': '',
                               'STATIC_URL': STATIC_URL,
                               'MAIN_URL': BASE_URL,
                               'GOOGLE_CODE': '',
                               'CAS_URL': CAS_SERVER_URL,
                               })
            else:
                return render(request, "main/index_stage.html",
                              {'content': '',
                               'STATIC_URL': STATIC_URL,
                               'MAIN_URL': BASE_URL,
                               'GOOGLE_CODE': '',
                               'CAS_URL': CAS_SERVER_URL,
                               })
        else:
            #Live production
            return render(request, "main/index.html",
                          {'content': '',
                           'STATIC_URL': STATIC_URL,
                           'MAIN_URL': BASE_URL,
                           'GOOGLE_CODE': '',
                           'CAS_URL': CAS_SERVER_URL,
                           })
