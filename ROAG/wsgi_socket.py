"""
WSGI config for dummy project.
This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.
Usually you will have the standard Django WSGI application here, but it also
might make sense to replace the whole Django WSGI application with a custom one
that later delegates to the Django one. For example, you could introduce WSGI
middleware here, or combine a Django application with an application of another
framework.
"""
from gevent import monkey; monkey.patch_all()
import os
import sys
import gevent.socket
import redis.connection

application = None
path = '/srv/application'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.base_socket")

if path not in sys.path:
    sys.path.append(path)

from ws4redis.uwsgi_runserver import uWSGIWebsocketServer
redis.connection.socket = gevent.socket

if application is None:
    application = uWSGIWebsocketServer()
