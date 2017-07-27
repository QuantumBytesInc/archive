# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
import os
from datetime import timedelta
from django_global_config.settings import *

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
    'channels',
)

USE_TZ = True
SESSION_COOKIE_DOMAIN = ".annorath-game.com"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [('redis://:notsosecurebutnotneeded@roag-redis:6379/0')],
        },
        "ROUTING": "project.routing.channel_routing",
    },
}

UNIGINE_SERVER = 'roau-app'

BROKER_URL = 'redis://:notsosecurebutnotneeded@roag-redis:6379/10'
CELERY_RESULT_BACKEND = 'redis://:notsosecurebutnotneeded@roag-redis:6379/10'

CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']

CELERY_TIMEZONE = 'UTC'

#lars.saalbach@quantum-bytes.com: Attention!
#SESSION EXPIRE is needed, because sometimes if you start the game client,
# he still has a valid session backwards (which should not be the case)
# thats why we expire the session when closing the browser/game awell as saving the request every time
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True
