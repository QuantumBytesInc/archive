# Copyright (C) 2017 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Django imports
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist
from project import constants
from django.utils.timezone import utc

# Python imports
import uuid
import logging
import datetime

# Model imports
from project.user.models import User
from project.user.models import LoginFailed

log = logging.getLogger(__name__)


"""
Public API functions
"""

def verify_credentials(request, data, values):
    """
    Private API
    Just for ROAG to ROAA call
    :param request: The request
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('GUI - Verify credentials - Call')
    values['DATA'] = {}

    try:
        # Encoded json
        if "USERNAME" not in data or \
                        "PASSWORD" not in data:
            ValueError('Missing key', constants.result_codes['GUI_VERIFY_CREDENTIALS_FAILED_MISSING_VALUES'])
        # Set user and password
        passed_username = data['USERNAME']
        passed_password = data['PASSWORD']

        user = User.objects.get(username__iexact=passed_username)

        if user is not None:
            # Get failed login counter
            failed, created = LoginFailed.objects.get_or_create(user=user, defaults={'count': 0, 'user': user})
            if (user.is_activated == False):
                failed.count += 1
                failed.save()
                values['DATA'] = {}
                ValueError('User not activated', constants.result_codes['GUI_VERIFY_CREDENTIALS_FAILED_USER_NOT_ACTIVATED'])
            if user.is_active == False:
                failed.count += 1
                failed.save()
                values['DATA'] = {}
                ValueError('User not active', constants.result_codes['GUI_VERIFY_CREDENTIALS_FAILED_USER_NOT_ACTIVE'])
            if failed.count > 999:
                failed.count += 1
                failed.save()
                values['DATA'] = {}
                ValueError('User not active', constants.result_codes['GUI_VERIFY_CREDENTIALS_FAILED_BRUTE_FORCE_ATTEMPT'])

            # We're fine and checked everything now
            if not request.user.is_authenticated():
                log.debug('User is not authenticated, authenticate called for ' + passed_username)
                user = authenticate(username=user.username, password=passed_password)
            else:
                log.debug('User is authenticated, logout and authenticate called for ' + passed_username)
                user = authenticate(username=user.username, password=passed_password)

            if user is not None:
                log.debug('GUI - Verify credentials - User Login')

                # Reset counter
                failed.count = 0
                failed.save()


                # Prepare data
                values['DATA'] = {}

                # Set code
                values['CODE'] = constants.result_codes['GUI_VERIFY_CREDENTIALS_SUCCESSFULLY']
            else:
                failed.count += 1
                failed.save()
                values['DATA'] = {}
                # Wrong credentials
                values['CODE'] = constants.result_codes['GUI_VERIFY_CREDENTIALS_FAILED_WRONG_USER_OR_PASSWORD']
        else:
            # We can't log the failed attempt because the user doesn't exist
            # Don't say API that just username doesn't exist.
            values['DATA'] = {}
            values['CODE'] = constants.result_codes['GUI_VERIFY_CREDENTIALS_FAILED_WRONG_USER_OR_PASSWORD']

    except ValueError as e:
        log.error(e)
        values['CODE'] = e.args[1]
    except ObjectDoesNotExist as e:
        log.error(e)
        values['CODE'] = constants.result_codes['GUI_LOGIN_BY_TOKEN_UNSUCCESSFULLY']
    except Exception as e:
        log.error(e)
        values['CODE'] = constants.result_codes['GUI_LOGIN_BY_TOKEN_UNSUCCESSFULLY']

    # Return answer
    return values
