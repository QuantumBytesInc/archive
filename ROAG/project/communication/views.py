# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib.auth.decorators import login_required
from django.utils.timezone import utc
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.contrib.auth import get_user

# Python imports
import logging
from datetime import datetime

# Model imports
from project.communication.models import Channel, ChannelRight, UserList
from project.account.models import Character

# Other imports
from project.gui import utils

# Set logging
log = logging.getLogger(__name__)


@login_required
def get_user_character_active(request):
    """
    Get the current logged-in character
    :param request: The request
    :return: Character object
    """
    try:
        log.debug('COMMUNICATION - Get user character active - Called')
        request_user = get_user(request)
        # log.error("Get user character active - user get")
        character_objects = Character.objects.get(user=request_user, is_spawned=True)
        # log.error("Return character obejcts")
        return character_objects
    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('COMMUNICATION - Get user character active - Exception: ' + str(e))
        raise


@login_required
def channel_by_name(request, data, values):
    """
    Get the channel id by name.
    :param request: The request
    :param data: The data
    :param values: Value map for json answer
    :return: Value map
    """
    log.debug('COMMUNICATION - Channel by name - Called')

    # Encoded json
    encoded = data

    # Get channel
    channel = Channel.objects.get(name=encoded['NAME'])

    if channel:
        # Set code
        values['CODE'] = utils.result_codes['CHANNEL_GET_BY_NAME_SUCCESSFULLY']

        # Set data
        values['DATA'] = {'id': channel.uuid}

    else:
        # Set error
        values['CODE'] = utils.result_codes['CHANNEL_GET_BY_NAME_NOT_FOUND']

        # Set dummy data
        values['DATA'] = {'id': channel.uuid}

    return values


@login_required
def get_channel_list(request, values):
    """
    Get a list with all channels a given user can connected to.
    :param request: The request
    :param values: The values
    :return:
    """
    log.debug('COMMUNICATION - Channel list - Called')

    # Get
    try:
        character = get_user_character_active(request)

        # Get channels
        channels = []
        channels_temp = ChannelRight.objects.filter(character=character)

        # Add to list
        for channel in channels_temp:
            if channel.channel.name != 'sync':
                channels.append({'UUID': channel.channel.uuid, 'NAME': channel.channel.name})

        values['CODE'] = utils.result_codes['CHANNEL_GET_LIST_SUCCESSFULLY']
        values['DATA'] = channels
        return values

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('COMMUNICATION - Channel list - Exception' + str(e))
        values['CODE'] = utils.result_codes['CHANNEL_GET_LIST_FAILED_MISC']
        return values
    except Exception as e:
        log.error('COMMUNICATION - Channel list - Exception' + str(e))
        values['CODE'] = utils.result_codes['CHANNEL_GET_LIST_FAILED_MISC']
        return values


@login_required
def get_channel_user_list(request, data, values):
    """
    Get a list with all connected users to a specific channel.
    :param request: The request
    :param data: The data
    :param values: The values
    :return:
    """
    log.debug('COMMUNICATION - Channel user list - Called')

    # Encoded json
    encoded = data

    # Get uuid for channel
    uuid = encoded['UUID']

    # Get list
    users = []

    try:
        users_temp = UserList.objects.filter(channel=Channel.objects.get(uuid=uuid))

        for user in users_temp:
            users.append(user.character.nickname)

        current_time = datetime.utcnow()
        current_time = current_time.replace(tzinfo=utc)

        # Set values
        values['DATA'] = {'USERS': users,
                          'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour, current_time.minute, current_time.second)}

        log.debug('COMMUNICATION - Channel user list - Successfully')
        values['CODE'] = utils.result_codes['CHANNEL_GET_USER_LIST_SUCCESSFULLY']

        return values

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('COMMUNICATION - Channel user list - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['CHANNEL_GET_USER_LIST_FAILED_MISC']

        return values
