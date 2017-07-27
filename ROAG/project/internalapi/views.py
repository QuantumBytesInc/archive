# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import utc

# Python imports
import json
import logging
import datetime

# Third party imports

# Other imports
from project.gui import utils
from project.account.models import Character, Token
from project.world.models import DateTimeROA
from project.stats.models import CharacterJoin
from project.login.views import get_user_by_token

# Set log format
log = logging.getLogger(__name__)


def character_spawn(data, values):
    """
    Spawn character in the world
    :param data: The data
    :param values:  The values
    :return: Value map
    """
    log.debug('Get character for spawn')

    try:
        charId = data['ID']
        token = data['TOKEN']

        found_user = get_user_by_token(token)

        if found_user is not None:

            # Get user object
            character = Character.objects.get(user=found_user, id=charId)

            # Set spawn flag
            character.is_spawned = True

            # FIXME: Remove this
            if character.position == '0;0;0':
                character.position = '-3029;244;-356'

            # Save
            character.save()

            # Set values
            values['DATA'] = {'ID': character.id, 'NICKNAME': character.nickname, 'POS': character.position}
            values['CODE'] = utils.result_codes['CHARACTER_SPAWN_SUCCESSFULLY']

            # Add stats entry
            CharacterJoin.objects.create(date=datetime.datetime.utcnow().replace(tzinfo=utc),
                                         character=character).save()

            return values
        else:
            log.error("Character - Spawn - Invalid token / user not found")
            values['CODE'] = utils.result_codes['CHARACTER_SPAWN_INVALID_TOKEN']

    except ObjectDoesNotExist as e:
        log.error("Character - Spawn - Error - " + str(e))
        values['CODE'] = utils.result_codes['CHARACTER_SPAWN_FAILED_MISC']

        return values


def character_set_position(data, values):
    """
    Set current character position
    :param data: The data
    :param values:  The values
    :return: Value map
    """
    log.debug('Set character position')

    try:
        charId = data['ID']
        position = data['POS']

        # Get user object
        character = Character.objects.get(id=charId)

        # Set spawn flag
        character.position = position

        # Save
        character.save()

        # Set values
        values['DATA'] = {}
        values['CODE'] = utils.result_codes['CHARACTER_SET_POSITION_SUCCESSFULLY']

    except ObjectDoesNotExist as e:
        log.error("Character - Set Position - Error - " + str(e))
        values['CODE'] = utils.result_codes['CHARACTER_SET_POSITION_FAILED_MISC']

    return values


def set_time(data, values):
    """

    :param data:
    :param values:
    :return:
    """
    log.debug('Set new time')

    roa_date = DateTimeROA.objects.filter()[0]
    roa_date.year = data['YEAR']
    roa_date.month = data['MONTH']
    roa_date.day = data['DAY']
    roa_date.seconds = data['SECONDS']

    current_time = datetime.datetime.utcnow()
    current_time = current_time.replace(tzinfo=utc)

    roa_date.last_sync = current_time
    roa_date.save()

    values['CODE'] = utils.result_codes['SYNC_SET_TIME_SUCCESSFULLY']

    return values


def get_time(data, values):
    """

    :param data:
    :param values:
    :return:
    """
    log.debug('Get time')

    roa_date = DateTimeROA.objects.filter()[0]

    minutes, seconds = divmod(roa_date.seconds, 60)
    hours, minutes = divmod(minutes, 60)
    values['DATA'] = {'YEAR': "%04d" % roa_date.year,
                      'MONTH': "%02d" % roa_date.month,
                      'DAY': "%02d" % roa_date.day,
                      'TIME': "%02d:%02d:%02d" % (hours, minutes, seconds)}

    values['CODE'] = utils.result_codes['SYNC_SET_TIME_SUCCESSFULLY']

    return values