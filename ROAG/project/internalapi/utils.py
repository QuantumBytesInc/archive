# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.views.decorators.csrf import csrf_exempt
from ws4redis.publisher import RedisPublisher
from ws4redis.redis_store import RedisMessage
from django.core.exceptions import PermissionDenied
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.utils.timezone import utc

# Python imports
import logging
import random
import json
from datetime import datetime

# View imports
from project.account import views as account_views
from project.communication.models import Channel, ChannelRight, UserList

# Third party imports
from django_ajax.decorators import ajax

# Other imports
from project.gui import utils
from project.internalapi import views as api
from project.communication.views import get_user_character_active

from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes
from rest_framework.response import Response

# Set logging
log = logging.getLogger(__name__)


def allowed_channels(request, channels):
    log.error('called allowed_channels')

    try:
        # Get channel from request
        uuid = request.path_info
        uuid = uuid.split('/')[2]

        # Only authenticated users
        if request.user.is_authenticated():

            # Get character
            character = get_user_character_active(request)

            # Get channel
            user_channels = []
            channel = Channel.objects.get(uuid=uuid)

            if channel.name == 'sync':
                user_channels.append('subscribe-broadcast')

            elif ChannelRight.objects.get(character=character, channel=channel):
                user_channels.append('subscribe-broadcast')
                p, created = UserList.objects.get_or_create(channel=channel, character=character)
                p.save()

            current_time = datetime.utcnow()
            current_time = current_time.replace(tzinfo=utc)

            publisher = RedisPublisher(facility=uuid, broadcast=True)

            # Prepare data
            values_sending = {'ERROR': -1,
                              'CODE': utils.result_codes['CHANNEL_JOIN_SUCCESSFULLY'],
                              'DATA': {'USER': character.nickname,
                                       'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour,
                                                                        current_time.minute,
                                                                        current_time.second)},
                              'ACTION': utils.actions['CHANNEL_JOIN'], 'CALLER': utils.callers['CHANNEL']}

            if channel.name != 'sync':
                publisher.publish_message(RedisMessage(json.dumps(values_sending)))

            return user_channels

        else:
            raise PermissionDenied('Not allowed to subscribe nor to publish on the Websocket!')

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        return ''  # Empy list, no access


def character_actions(action, data, values):
    """
    Handles all character related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == utils.actions['CHARACTER_SPAWN']:
        return account_views.internal_character_spawn(data, values)


def character_actions(action, data, values):
    """
    Character actions
    :param action: The action
    :param data: The data
    :param values: The values
    :return: JSON values
    """
    if action == utils.actions['CHARACTER_SPAWN']:
        return api.character_spawn(data, values)
    if action == utils.actions['CHARACTER_SET_POSITION']:
        return api.character_set_position(data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_MISC_ERROR']


def sync_actions(action, data, values):
    """
    Sync actions for world stuff
    :param action:
    :param data:
    :param values:
    :return:
    """
    if action == utils.actions['SYNC_SET_TIME']:
        return api.set_time(data, values)
    elif action == utils.actions['SYNC_GET_TIME']:
        return api.get_time(data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_MISC_ERROR']


@api_view(['POST'])
@parser_classes((JSONParser,))
def internal_request(request):
    """Ajax function for internal requests
    :param request: The request
    :return: JSON for evaluation
    """
    #log.info("INTERNAL_API - Internal request - Called")
    # Check post values
    request_id = 0

    action = 0
    caller = 0
    try:
        #log.info("INTERNAL_API - Internal request - Checking data: " + str(request.data))
        data = request.data
        request_id = data['REQUEST']
        caller = int(data['CALLER'])
        action = int(data['ACTION'])
        data = data['DATA']

    except Exception as e:
        #log.error("INTERNAL_API - Internal request - Could not load json")
        error_values = {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': -1,
                        'CALLER': -1}
        dict((k.lower(), v) for k, v in error_values.items())
        #log.info('INTERNAL_API - Request - Answer - ' + str(error_values))
        return Response(error_values)

    # Values dict

    values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': action, 'CALLER': caller, 'REQUEST': request_id}
    # Check if caller and action are valid
    if caller == utils.callers['CHARACTER']:
        if action in utils.actions.values():
            # Do requests
            character_actions(action, data, values)
        else:
            # Unknown action
            #log.error("INTERNAL_API - Internal request - Unkown action")
            values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    elif caller == utils.callers['SYNC']:
        if action in utils.actions.values():
            sync_actions(action, data, values)
        else:
            # Unknown action
            #log.error("INTERNAL_API - Internal request - Unkown action")
            values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    else:
        #log.error("INTERNAL_API - Internal request - Unkown caller")
        # Unknown caller
        values['ERROR'] = utils.global_errors['ERROR_CALLER_UNKNOWN']

    # Create json answer
    dict((k.lower(), v) for k, v in values.items())

    #log.info('INTERNAL_API - Request - Answer - ' + str(values))
    return Response(values)
