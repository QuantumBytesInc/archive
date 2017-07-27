from __future__ import absolute_import

import datetime
import celery
import logging
import json
import socket
from django.utils.timezone import utc


from project.communication.models import HeartBeat, Channel, UserList
from project.gui import utils
from project.interface.models import ServerState
from project.settings.base import UNIGINE_SERVER
from project.stats.models import CharacterJoin, PlayDuration


# Set logging
log = logging.getLogger(__name__)


@celery.decorators.periodic_task(run_every=datetime.timedelta(seconds=5))
def check_for_server_state():
    """
    Check if unigine server is available
    :return:
    """
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((UNIGINE_SERVER, 22110))
    except:
        result = 1

    obj, created = ServerState.objects.get_or_create(id=1,
                                                     defaults={
                                                         'last_check': datetime.datetime.utcnow().replace(tzinfo=utc),
                                                         'state': result})
    obj.state = result
    obj.save()

    return result
