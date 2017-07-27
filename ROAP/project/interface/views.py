# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Django imports
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Python imports
import json
import logging
import sys
import os
# Third party imports
from django_ajax.decorators import ajax

# Other imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.realpath('__file__')), 'roa-constants/constants')))
#External include
import roap_utils as utils

from project.interface import utils as api


# Set log format
log = logging.getLogger(__name__)


def main(request):
    """
    Main view with empty html code, after this step angularjs does the work.
    :param request: The request
    :return: The template
    """
    return render(request, "index.html", {})


@csrf_exempt
@ajax
def api_request(request):
    """Ajax function for api requests
    :param request: The request
    :return: JSON for evaluation
    """
    # Check post values
    if getattr(request, 'limited2', False):
        log.error('Rate limit exceeded')
        return json.dumps(
            {'ERROR': utils.global_errors['ERROR_RATE_LIMIT'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})
    try:
        caller = int(request.POST['CALLER'])
        action = int(request.POST['ACTION'])
        data = request.POST['DATA']
    except KeyError as e:
        log.exception(e, extra={'request': request})
        return json.dumps(
            {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})

    values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': action, 'CALLER': caller}

    # Check if caller and action are valid
    try:
        if caller in utils.callers.values():
            if action in utils.actions.values():
                # Login/logout does not need authentication
                if caller == utils.callers['PORTAL']:
                    log.debug('Portal action called')
                    api.portal_actions(request, action, data, values)
                elif caller == utils.callers['FEATURES']:
                    log.debug('Feature action called')
                    api.features_actions(request, action, data, values)
                elif caller == utils.callers['CONTACT']:
                    log.debug('Contact action called')
                    api.contact_actions(request, action, data, values)
                elif caller == utils.callers['CUSTOMER']:
                    log.debug('Customer action called')
                    api.customer_actions(request, action, data, values)
                else:
                    # Authenticated error
                    log.error('Logic error, FIXME')
                    values['ERROR'] = utils.global_errors['ERROR_MISC_ERROR']
            else:
                # Unknown action
                log.error('Unknown action')
                values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
        else:
            # Unknown caller
            log.error('Unknown caller')
            values['ERROR'] = utils.global_errors['ERROR_CALLER_UNKNOWN']

        # Create json answer
        answer = json.dumps(values)

        return answer
    except Exception as e:
        log.exception(e, extra={'request': request})
        return json.dumps(
            {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})
