# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import logging
import datetime

from django.utils.timezone import utc

# Model imports
from project.world.models import DateTimeROA, Weather, ResourceSpawned

# Other imports
from project.gui import utils
from project.communication.views import get_user_character_active

# Set logging
log = logging.getLogger(__name__)


def time_weather_sync(request, values):
    """
    Time and weather sync
    :param data: The data
    :param values: The values
    :return:
    """
    # Set time
    log.debug('WORLD - Time weather sync - Called')
    roa_date = DateTimeROA.objects.filter()[0]

    minutes, seconds = divmod(roa_date.seconds, 60)
    hours, minutes = divmod(minutes, 60)

    current_time = datetime.datetime.utcnow()
    current_time = current_time + datetime.timedelta(minutes=-5)
    current_time = current_time.replace(tzinfo=utc)

    if roa_date.weather_sync < current_time:

        current_time = current_time + datetime.timedelta(minutes=5)
        current_time = current_time.replace(tzinfo=utc)
        roa_date.weather_sync = current_time
        roa_date.save()

        try:
            weather = Weather.objects.get(active=True)
            weather.active = False
            weather_new = Weather.objects.get(id=weather.id+1)
            weather_new.active = True
            weather_new.save()
            weather.save()
        except Exception as e:
            weather = Weather.objects.get(active=True)
            weather.active = False
            weather.save()
            weather = Weather.objects.get(id=1)
            weather.active = True
            weather.save()

    weather = Weather.objects.get(active=True)

    # Prepare values
    values['CODE'] = utils.result_codes['SYNC_TIME_WEATHER_SUCCESSFULLY']
    log.debug('WORLD - Time weather sync - Successfully')
    values['DATA'] = {
        'rain': weather.rain,
        'cloud': weather.clouds,
        'fog': weather.fog,
        'snow': weather.snow,
        'wind': weather.wind,
        'date': "%04d-%02d-%02d" % (roa_date.year, roa_date.month, roa_date.day),
        'time': "%02d:%02d" % (hours, minutes),
        'name': weather.name,
    }

    return values


def resource_init_sync(request, values):
    """
    Initial synchronization for resources on world join.
    :param request: Request object
    :param values: Map with JSON values
    :return: Filled map
    """
    log.debug('WORLD - Resource init sync - Called')

    # Prepare data
    resources = []

    # Get current terrain
    character = get_user_character_active(request)
    terrain = character.location.terrain

    # Get all resources for the terrain
    for resource in ResourceSpawned.objects.filter(terrain=terrain, deleted=False):
        resources.append({
            'id': resource.id,
            'template_id': resource.master.id,
            'x': resource.x,
            'y': resource.y
        })

    log.debug('WORLD - Resource init sync - Successfully')
    values['CODE'] = utils.result_codes['SYNC_SPAWN_RESOURCES_INIT_SUCCESSFULLY']
    values['DATA'] = resources

    return values


def gather_resource(request, data, values):
    """
    Gather resource request
    :param request:  The request
    :param request:  The data
    :param values:  The values
    :return: Filled map
    """
    # Get character
    log.debug('WORLD - Gather resource - Called')
    character = get_user_character_active(request)

    # Check resource for gathering

    # Calculate material gathered

    # Save resource

    # Save material

    # Answer request
    return None
