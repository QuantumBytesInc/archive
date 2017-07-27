# Django configuration
import os
from django_global_config.settings import *

# Application definition
INSTALLED_APPS += (
    'mama_cas',
    'snowpenguin.django.recaptcha2',
    'project.user',
    'project.internalapi',
    'project.gui',
    'project.account',
)

MIDDLEWARE_CLASSES += (
    'htmlmin.middleware.HtmlMinifyMiddleware',
    'htmlmin.middleware.MarkRequestMiddleware',
)

# Remove CAS from global config
MIDDLEWARE_CLASSES = tuple(filter(lambda el: el != 'cas.middleware.CASMiddleware', MIDDLEWARE_CLASSES))

AUTH_USER_MODEL = 'user.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

HTML_MINIFY = True

RECAPTCHA_PRIVATE_KEY = os.environ["APP_RECAPTCHA_PRIVATE"]
RECAPTCHA_PUBLIC_KEY = os.environ["APP_RECAPTCHA_PUBLIC"]

PORTAL_URL = os.environ["APP_PORTAL_URL"]

# CAS
MAMA_CAS_ENABLE_SINGLE_SIGN_OUT = True
MAMA_CAS_TICKET_RAND_LEN = 64
MAMA_CAS_ATTRIBUTE_CALLBACKS = ('project.utils.custom_attributes', )
MAMA_CAS_FOLLOW_LOGOUT_URL = True
MAMA_CAS_VALID_SERVICES = {
    '^https://[^\.]+\.annorath-game\.com',
    '^https://[^\.]+\.quantum-bytes\.com',
}

# Session
SESSION_COOKIE_AGE = 432000  # One week
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_SECURE = True

USE_TZ = True
