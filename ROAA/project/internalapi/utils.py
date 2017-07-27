# Copyright (C) 2016 Quantum Bytes Inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Python imports
import logging
import json

# Third party imports

# Other imports
from project import constants
from project.internalapi.views import user_actions, gui_actions
from project import settings

# Set log format
log = logging.getLogger(__name__)

@csrf_exempt
def api_request(request):
    """
    JSON function for internal requests
    :param request: The request
    :return: JSON for evaluation
    """
    try:
        if request.method != 'POST':
            raise ValueError('Only POST requests supported', constants.global_errors['ERROR_ONLY_POST_SUPPORTED'])

        # Load json
        log.error(request.body)
        data = json.loads(request.body.decode('utf-8'))

        #if data['ACCESS'] != settings.INTERNAL_API_ACCESS_KEY and data['SECRET'] != settings.INTERNAL_API_SECRET_KEY:
        #    raise ValueError('Invalid credentials', constants.global_errors['ERROR_INVALID_CREDENTIALS'])

        # Values dict
        values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': data['ACTION'], 'CALLER': data['CALLER']}

        # Check if caller and action are valid
        if values['CALLER'] == constants.callers['USER']:
            if values['ACTION'] in {constants.actions['USER_REGISTER'],
                                    constants.actions['USER_MODIFY'],
                                    constants.actions['USER_DATA'],
                                    constants.actions['USER_LOCK']}:
                # Do requests
                user_actions(request, values['ACTION'], data['DATA'], values)
            else:
                # Unknown action
                raise ValueError('Invalid action', constants.global_errors['ERROR_ACTION_UNKNOWN'])
        elif values['CALLER'] == constants.callers['GUI']:
            if values['ACTION'] in {constants.actions['GUI_VERIFY_CREDENTIALS']}:
                gui_actions(request, values['ACTION'], data['DATA'], values)
        else:
            # Unknown caller
            raise ValueError('Invalid caller', constants.global_errors['ERROR_CALLER_UNKNOWN'])

        # Create json answer
        dict((k.lower(), v) for k, v in values.items())

        return JsonResponse(values)

    except KeyError as e:
        log.exception(e)
        return JsonResponse({'ERROR': e.args[1]})
    except ValueError as e:
        log.exception(e)
        return JsonResponse({'ERROR': e.args[1]})
