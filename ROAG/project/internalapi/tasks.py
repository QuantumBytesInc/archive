from __future__ import absolute_import

import datetime
import celery
import json
from project.world.views import time_weather_sync
from project.gui import utils
from project.communication.models import Channel
from channels import Group


# Set logging
channel = Channel.objects.get(name='sync')


@celery.decorators.periodic_task(run_every=datetime.timedelta(seconds=5))
def update_weather():
    """
    Check and respawn resources in the world.
    :return: Amount of added resources
    """

    log = update_weather.get_logger()
    log.debug('Update weather')

    # Random weather
    values = {'ERROR': -1, 'ACTION': utils.actions['SYNC_TIME_WEATHER'], 'CALLER': utils.callers['SYNC']}
    values = time_weather_sync(None, values)

    Group('chat-' + channel.uuid,).send({'text': json.dumps(values)})
