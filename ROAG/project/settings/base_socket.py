# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
import os
from datetime import timedelta
from django_global_config.settings import *
import django

# Minify
HTML_MINIFY = True

INTERNAL_API_ACCESS_KEY = os.environ.get("APP_API_ACCESS_KEY", "")
INTERNAL_API_SECRET_KEY = os.environ.get("APP_API_SECRET_KEY", "")

# URL configuration
ROOT_URLCONF = 'project.gui.urls'

REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': timedelta(hours=10),
    'USER_SERIALIZER': 'knox.serializers.UserSerializer',
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}


# Installed applications
INSTALLED_APPS += (
    'rest_framework',
    'knox',
    'project.login',
    'project.interface',
    'project.world',
    'project.game',
    'project.account',
    'project.internalapi',
    'project.communication',
    'project.translation',
    'project.gui',
    'project.stats',
    'project.item',
    'ws4redis',
)

USE_TZ = True

WEBSOCKET_URL = '/ws/'
WS4REDIS_EXPIRE = 0
WS4REDIS_HEARTBEAT = '{"CALLER":6,"ACTION":7,"DATA":{}}'

WS4REDIS_CONNECTION = {
    'host': 'roag-redis',
    'port': 6379,
    'db': 1,
    'password': 'notsosecurebutnotneeded',
}

TEMPLATE_CONTEXT_PROCESSORS += (
    'ws4redis.context_processors.default',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(funcName)s():%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        },
    },
    'handlers': {
        'logfile_django': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/srv/log/django.log',
            'formatter': 'standard'
        },
        'logfile_api': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/srv/log/api.log',
            'formatter': 'standard'
        },
        'logfile_internal': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/srv/log/internal.log',
            'formatter': 'standard'
        },
        'default': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/srv/log/default.log',
            'formatter': 'standard'
        },
    },
    'loggers': {
        '': {
            'handlers': ['logfile_django'],
            'level': 'INFO',
            'propagate': True
        },
        'django.request': {
            'handlers': ['logfile_django'],
            'level': 'INFO',
            'propagate': True,
        },
        'django': {
            'handlers': ['logfile_django'],
            'level': 'INFO',
            'propagate': True,
        },
        'login': {
            'handlers': ['logfile_api'],
            'level': 'INFO',
            'propagate': False
        },
        'interface': {
            'handlers': ['logfile_api'],
            'level': 'INFO',
            'propagate': False
        },
        'internalapi': {
            'handlers': ['logfile_internal'],
            'level': 'INFO',
            'propagate': False
        },
        'account': {
            'handlers': ['logfile_api'],
            'level': 'INFO',
            'propagate': False
        },
        'communication': {
            'handlers': ['logfile_api'],
            'level': 'INFO',
            'propagate': False
        },
        'item': {
            'handlers': ['logfile_api'],
            'level': 'INFO',
            'propagate': False
        },
        'django_ajax': {
            'handlers': ['logfile_api'],
            'level': 'INFO',
            'propagate': False
        },
    }
}

SESSION_COOKIE_DOMAIN = ".annorath-game.com"
CAS_ADMIN_PREFIX = ''

django.setup()
from project.internalapi.utils import allowed_channels
WS4REDIS_ALLOWED_CHANNELS = allowed_channels
from ws4redis import settings as private_settings
private_settings.WS4REDIS_ALLOWED_CHANNELS = WS4REDIS_ALLOWED_CHANNELS


