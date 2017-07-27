# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
import os
from django_global_config.settings import *

# Minify
HTML_MINIFY = True

# Security
INTERNAL_API_ACCESS_KEY = os.environ["APP_API_ACCESS_KEY"]
INTERNAL_API_SECRET_KEY = os.environ["APP_API_SECRET_KEY"]

# Middleware
MIDDLEWARE_CLASSES = (
    'django_seo_js.middleware.EscapedFragmentMiddleware',
    'django_seo_js.middleware.UserAgentMiddleware',
    'htmlmin.middleware.HtmlMinifyMiddleware',
    'htmlmin.middleware.MarkRequestMiddleware'
) + MIDDLEWARE_CLASSES

# Installed applications
INSTALLED_APPS += (
    'django_ajax',
    'django_seo_js',
    'project',
    'project.interface',
    'project.gui',
    'project.news',
    'project.faq',
    'project.features',
    'project.linkedwords',
    'project.contacts',
    'project.crawler',
)

# Captcha
GOOGLE_CAPTCHA_SECRET = os.environ["APP_GOOGLE_CAPTCHA_SECRET"]

#SEO_JS_PRERENDER_TOKEN = "HRYCKfuSYfrFTbrGCE5t"
SEO_JS_BACKEND = "django_seo_js.backends.PrerenderHosted"
SEO_JS_PRERENDER_URL = "http://roap-prerender:3000/"  # Note trailing slash.
SEO_JS_PRERENDER_RECACHE_URL = "http://roap-prerender:3000/recache"
