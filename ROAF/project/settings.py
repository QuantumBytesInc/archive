# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
import os
from django_global_config.settings import *


INSTALLED_APPS += (
    'spirit.core',
    'spirit.admin',
    'spirit.search',

    'spirit.user',
    'spirit.user.admin',
    'spirit.user.auth',

    'spirit.category',
    'spirit.category.admin',

    'spirit.topic',
    'spirit.topic.admin',
    'spirit.topic.favorite',
    'spirit.topic.moderate',
    'spirit.topic.notification',
    'spirit.topic.poll',  # todo: remove in Spirit v0.5
    'spirit.topic.private',
    'spirit.topic.unread',

    'spirit.comment',
    'spirit.comment.bookmark',
    'spirit.comment.flag',
    'spirit.comment.flag.admin',
    'spirit.comment.history',
    'spirit.comment.like',
    'spirit.comment.poll',
    'djconfig',
    'haystack',
)


MIDDLEWARE_CLASSES += (
    'spirit.user.middleware.TimezoneMiddleware',
    'spirit.user.middleware.LastIPMiddleware',
    'spirit.user.middleware.LastSeenMiddleware',
    'spirit.user.middleware.ActiveUserMiddleware',
    'spirit.core.middleware.PrivateForumMiddleware',
    'djconfig.middleware.DjConfigMiddleware',
)

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(os.path.dirname(__file__), 'search/whoosh_index'),
    },
}



ST_TOPIC_PRIVATE_CATEGORY_PK = 1

ST_RATELIMIT_ENABLE = True
ST_RATELIMIT_CACHE_PREFIX = 'srl'
ST_RATELIMIT_CACHE = 'default'
ST_RATELIMIT_SKIP_TIMEOUT_CHECK = False

ST_NOTIFICATIONS_PER_PAGE = 20

ST_COMMENT_MAX_LEN = 3000
ST_MENTIONS_PER_COMMENT = 30
ST_DOUBLE_POST_THRESHOLD_MINUTES = 30

ST_YT_PAGINATOR_PAGE_RANGE = 3

ST_SEARCH_QUERY_MIN_LEN = 3

ST_USER_LAST_SEEN_THRESHOLD_MINUTES = 1

ST_PRIVATE_FORUM = False

ST_ALLOWED_UPLOAD_IMAGE_FORMAT = ('jpeg', 'png', 'gif')
ST_ALLOWED_URL_PROTOCOLS = {
    'http', 'https', 'mailto', 'ftp', 'ftps',
    'git', 'svn', 'magnet', 'irc', 'ircs'}

ST_UNICODE_SLUGS = True

ST_UNIQUE_EMAILS = True
ST_CASE_INSENSITIVE_EMAILS = True

# Tests helpers
ST_TESTS_RATELIMIT_NEVER_EXPIRE = False

ST_BASE_DIR = os.path.dirname(__file__)


LOGIN_URL = 'spirit:user:auth:login'
LOGIN_REDIRECT_URL = 'spirit:user:update'




LANGUAGES = [
    ('de', gettext('German')),
    ('en', gettext('English')),
    ('es', gettext('Spanish')),
    ('fr', gettext('French')),
    ('hu', gettext('Hungarian')),
    ('pl', gettext('Polish')),
    ('pl-pl', gettext('Poland Polish')),
    ('ru', gettext('Russian')),
    ('sv', gettext('Swedish')),
    ('tr', gettext('Turkish')),
    ('zh-hans', gettext('Simplified Chinese')),
]


TEMPLATES[0]['OPTIONS']['context_processors'] += [
    'djconfig.context_processors.config',
]


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'spirit_cache',
    },
}

CACHES.update({
    'st_rate_limit': {
        'BACKEND': CACHES['default']['BACKEND'],
        'LOCATION': 'spirit_rl_cache',
        'TIMEOUT': None
    }
})