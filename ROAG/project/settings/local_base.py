# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
import os
os.environ["APP"] = ""
os.environ["APP_ADMIN_MAIL"] = ""
os.environ["APP_ADMIN_NAME"] = ""
os.environ["APP_ALLOWED_HOSTS"] = ""
os.environ["APP_API_ACCESS_KEY"] = ""
os.environ["APP_API_SECRET_KEY"] = "LKJASD(!LASDJLKASDPPQHWEXCNNXCYI"
os.environ["APP_AWS_BUCKET"] = ""
os.environ["APP_AWS_DATA_KEY"] = ""
os.environ["APP_AWS_DATA_SECRET"] = ""
os.environ["APP_AWS_DB_KEY"] = ""
os.environ["APP_AWS_DB_SECRET"] = ""
os.environ["APP_AWS_PRELOAD"] = ""
os.environ["APP_AWS_SES_KEY"] = ""
os.environ["APP_AWS_SES_SECRET"] = ""
os.environ["APP_AWS_URL"] = ""
os.environ["APP_BASE_URL"] = ""
os.environ["APP_CAS_URL"] = ""
os.environ["APP_DB_HOST"] = ""
os.environ["APP_DB_NAME"] = ""
os.environ["APP_DB_PORT"] = ""
os.environ["APP_DB_PWD"] = ""
os.environ["APP_DB_USER"] = ""
os.environ["APP_DEBUG"] = "True"
os.environ["APP_DEFAULT_FROM_EMAIL"] = ""
os.environ["APP_ENVIRONMENT"] = ""
os.environ["APP_SECRET_KEY"] = "LK!223156asd12asJASD(!LASDJLKASDPPQHWEXCNNXCYI"
os.environ["APP_LOG_LEVEL"] = "INFO"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "stackdriver_local.json"

from datetime import timedelta
from project.settings.base import *

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.environ["APP_LOG_LEVEL"],
        },
        'project': {
            'handlers': ['console'],
            'level': os.environ["APP_LOG_LEVEL"],
        },
    },
}

USE_TZ = True

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
MEDIA_ROOT = "."
