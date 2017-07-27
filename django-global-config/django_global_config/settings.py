# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
from os.path import os
import mimetypes

gettext = lambda s: s

# Debug options
DEBUG = os.environ["APP_DEBUG"] == 'True'
TEMPLATE_DEBUG = os.environ["APP_DEBUG"] == 'True'

# Extend MIME-Types
mimetypes.add_type("image/svg+xml", ".svg", True)
mimetypes.add_type("image/svg+xml", ".svgz", True)

# Security
ADMINS = ((os.environ["APP_ADMIN_NAME"], os.environ["APP_ADMIN_MAIL"]), )
SECRET_KEY = os.environ["APP_SECRET_KEY"]
ALLOWED_HOSTS = [os.environ["APP_ALLOWED_HOSTS"],]

# Basic environment variables
BASE_URL = 'https://' + os.environ["APP_BASE_URL"] + '/'
RUN_ENV = os.environ["APP_ENVIRONMENT"]

# Locations
TIME_ZONE = 'Europe/Zurich'
LANGUAGE_CODE = 'en-us'

# Languages
LANGUAGES = (
    ('en-us', gettext('English')),
)

USE_I18N = True
USE_L10N = True

# URL configuration
ROOT_URLCONF = 'project.urls'

# CAS
CAS_SERVER_URL = 'https://' + os.environ["APP_CAS_URL"] + '/'
CAS_PROVIDE_URL_TO_LOGOUT = True
CAS_LOGOUT_COMPLETELY = True
CAS_FORCE_SSL_SERVICE_URL = True
CAS_AUTO_CREATE_USER = True
CAS_SERVER_URL_INTERFACE = CAS_SERVER_URL + "interface/request"
CAS_REDIRECT_URL = BASE_URL
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Paths
MEDIA_ROOT = "/srv/application/static"
STATIC_ROOT = "/srv/application/static/"

# AWS configuration for static and media
AWS_STORAGE_BUCKET_NAME = os.environ["APP_AWS_BUCKET"]
AWS_ACCESS_KEY_ID = os.environ["APP_AWS_DATA_KEY"]
AWS_SECRET_ACCESS_KEY = os.environ["APP_AWS_DATA_SECRET"]
AWS_S3_CUSTOM_DOMAIN = os.environ["APP_AWS_URL"]
AWS_PRELOAD_METADATA = True

# Static configuration
STATICFILES_LOCATION = os.environ["APP_ENVIRONMENT"] + '/data/static'
STATICFILES_STORAGE = 'django_global_config.storage.StaticStorage'
STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, STATICFILES_LOCATION)

# Media configuration
MEDIAFILES_LOCATION = os.environ["APP_ENVIRONMENT"] + '/data/media'
MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)

# Storage overwrite
DEFAULT_FILE_STORAGE = 'django_global_config.storage.MediaStorage'

AWS_HEADERS = {
    'Cache-Control': 'max-age=86400',
}

# Collect static
COLLECTFAST_CACHE = 'default'
MAX_ENTRIES = 1000000
COLLECTFAST_ENABLED = True
COLLECTFAST_DEBUG = False
COLLECTFAST_THREADS = 40

# Database backup
DBBACKUP_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
DBBACKUP_STORAGE_OPTIONS = {
    'ACCESS_KEY': os.environ["APP_AWS_DB_KEY"],
    'SECRET_KEY': os.environ["APP_AWS_DB_SECRET"],
    'BUCKET_NAME': os.environ["APP_AWS_BUCKET"],
    'LOCATION': os.environ["APP_ENVIRONMENT"] + '/db',
    'DEFAULT_ACL': 'private'
}

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ["APP_DB_NAME"],
        'USER': os.environ["APP_DB_USER"],
        'PASSWORD': os.environ["APP_DB_PWD"],
        'HOST': os.environ["APP_DB_HOST"],
        'PORT': os.environ["APP_DB_PORT"],
    }
}

# Template directory
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['/srv/application/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'stackdriver': {
            'level': os.environ["APP_LOG_LEVEL"],
            'class': 'logging_stackdriver.logging.Logging',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['stackdriver'],
            'level': os.environ["APP_LOG_LEVEL"],
            'propagate': False,
        },
        'project': {
            'handlers': ['stackdriver'],
            'level': os.environ["APP_LOG_LEVEL"],
            'propagate': False,
        },
    }
}

# Static finders
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cas.middleware.CASMiddleware',
)

# Authentication
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'cas.backends.CASBackend',
)

# Templeate processors
TEMPLATE_CONTEXT_PROCESSORS = ("django.contrib.auth.context_processors.auth",
                               "django.core.context_processors.debug",
                               "django.core.context_processors.i18n",
                               "django.core.context_processors.media",
                               "django.core.context_processors.static",
                               "django.core.context_processors.request",
                               "django.contrib.messages.context_processors.messages",
                               "django.core.context_processors.request")

# Caching
CACHES = {
    'default': {
       'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
       'LOCATION': '/srv/cache',
    }
}

# Installed applications
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'collectfast',
    'django.contrib.staticfiles',
    'grappelli',
    'django.contrib.admin',
    'django_countries',
    'countries_plus',
    'languages_plus',
    'storages',
    'dbbackup',
    'cas',
    'django_ses',
    'health_check',
    'health_check.db',
)

EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_ACCESS_KEY_ID = os.environ.get("APP_AWS_SES_KEY", "")
AWS_SES_SECRET_ACCESS_KEY = os.environ.get("APP_AWS_SES_SECRET", "")

CONN_MAX_AGE = None
