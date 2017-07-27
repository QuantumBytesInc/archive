# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib.auth.decorators import login_required

# Python imports
import logging

# View imports
from project.login import views as login_views
from project.account import views as account_views
from project.communication import views as channel_views
from project.world import views as world_views
from project.item import views as item_views

# Other imports
from project.gui import utils
from project.account.models import Character
from django.contrib.auth.models import User

# Set logging
log = logging.getLogger(__name__)


def authentication_actions(request, action, data, values):
    """
    Handles all authenticated related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    log.debug("API - Authentication - Actions - Called")
    if action == utils.actions['AUTHENTICATION_LOGIN']:
        #Not supporteda nymore.
        #values = login_views.user_login(request, data, values)
        values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    elif action == utils.actions['AUTHENTICATION_LOGOUT']:
        values = login_views.user_logout(request, data, values)
    elif action == utils.actions['AUTHENTICATION_TOKEN_REFRESH']:
        if request.user.is_authenticated():
            values = login_views.user_refresh_token(request, data, values)
        else:
            values['ERROR'] = utils.global_errors['ERROR_NOT_AUTHENTICATED']
    elif action == utils.actions['AUTHENTICATION_LOGIN_BY_TOKEN']:
        values = login_views.user_login_by_token(request, data, values)
    elif action == utils.actions['AUTHENTICATION_HEART_BEAT']:
        values = login_views.user_aes_encryption(request, data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    return values


@login_required
def account_actions(request, action, data, values):
    """
    Handles all account related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    log.debug("API - Account - Actions - Called")
    if action == utils.actions['ACCOUNT_SETTINGS_GET']:
        return account_views.settings_get(request, data, values)
    elif action == utils.actions['ACCOUNT_SETTINGS_SET']:
        return account_views.settings_set(request, data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_MISC_ERROR']


@login_required
def character_actions(request, action, data, values):
    """
    Handles all character related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    log.debug("API - Character - Actions - Called")
    if action == utils.actions['CHARACTER_LIST']:
        return account_views.character_list(request, values)
    elif action == utils.actions['CHARACTER_SPAWN']:
        return account_views.character_spawn(request, data, values)
    elif action == utils.actions['CHARACTER_CREATE']:
        return account_views.character_create(request, data, values)
    elif action == utils.actions['CHARACTER_DELETE']:
        return account_views.character_delete(request, data, values)


@login_required
def channel_actions(request, action, data, values):
    """
    Handles all channel related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    log.debug("API - Channel - Actions - Called")
    if action == utils.actions['CHANNEL_GET_BY_NAME']:
        return channel_views.channel_by_name(request, data, values)
    elif action == utils.actions['CHANNEL_GET_LIST']:
        return channel_views.get_channel_list(request, values)
    elif action == utils.actions['CHANNEL_GET_USER_LIST']:
        return channel_views.get_channel_user_list(request, data, values)


@login_required
def sync_actions(request, action, data, values):
    """
    Handles all sync related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    log.debug("API - Sync - Actions - Called")
    if action == utils.actions['SYNC_TIME_WEATHER']:
        return world_views.time_weather_sync(request, values)
    elif action == utils.actions['SYNC_SPAWN_RESOURCES_INIT']:
        return world_views.resource_init_sync(request, values)


def storage_actions(id, action, data, values):
    """
    Handles all storage related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    log.debug("API - Storage - Actions - Called")

    character = Character.objects.get(user=User.objects.get(id=id), is_spawned=True)

    if action == utils.actions['STORAGE_GET_EQUIPPED_BAGS']:
        return item_views.get_equipped_bags(character, values)
    elif action == utils.actions['STORAGE_GET_DETAILS']:
        return item_views.get_details(character, data, values)
    elif action == utils.actions['STORAGE_ADD']:
        return item_views.add(character, data, values)
    elif action == utils.actions['STORAGE_DESTROY_ITEM']:
        return item_views.destroy(character, data, values)
    elif action == utils.actions['STORAGE_MOVE']:
        return item_views.move(character, data, values)
    elif action == utils.actions['STORAGE_SWAP_ITEM']:
        return item_views.swap(character, data, values)
    elif action == utils.actions['STORAGE_STACK']:
        return item_views.stack(character, data, values)
    elif action == utils.actions['STORAGE_UNSTACK']:
        return item_views.unstack(character, data, values)
