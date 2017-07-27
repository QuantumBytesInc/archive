# Copyright (C) 2017 Quantum Bytes Inc. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Django imports
from django.utils.timezone import utc
from django.utils.crypto import get_random_string

# Python imports
import logging

# Third party imports

# Other imports
from project.user import views as authentication
from project.gui import views as gui_views
from project import constants as constants

# Set log format
log = logging.getLogger(__name__)


def user_actions(request, action, data, values):
    """
    Handles all user related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == constants.actions['USER_DATA']:
        values = authentication.get_data(data, values)
    elif action == constants.actions['USER_REGISTER']:
        values = authentication.register(data, values)
    elif action == constants.actions['USER_MODIFY']:
        values = authentication.modify(data, values)
    elif action == constants.actions['USER_LOCK']:
        values = authentication.lock(data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = constants.global_errors['ERROR_ACTION_UNKNOWN']
    return values


def gui_actions(request, action, data, values):
    """
    Handles all gui related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == constants.actions['GUI_VERIFY_CREDENTIALS']:
        values = gui_views.verify_credentials(request, data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = constants.global_errors['ERROR_ACTION_UNKNOWN']
    return values



