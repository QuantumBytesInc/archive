# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import get_user
from knox.auth import TokenAuthentication, AuthToken

# Rest framework imports
from rest_framework.decorators import authentication_classes, api_view, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from rest_framework.decorators import detail_route, parser_classes

# Python imports
import json
import logging
import urllib.parse as urlparse
import os

# Third party imports
from django_ajax.decorators import ajax

# Other imports
from project.gui import utils
from project.interface import utils as api
from project.interface import authentication as roa_authentication
from project.interface.models import ServerState
from project.login import views as login_views

# Set log format
log = logging.getLogger(__name__)


class DisableCSRF(object):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)


def main(request):
    """
    Main view with empty html code, after this step angularjs does the work.
    :param request: The request
    :return: The template
    """
    if request.get_host() == "gui.annorath-game.com":
        # Live-System
        return render(request, "index_live.html", {})
    else:
        show_live = request.GET.get('show_live', 'false')
        if (show_live == 'true'):
            return render(request, "index_live.html", {})
        else:
            return render(request, "index_stage.html", {})


@api_view(['POST'])
@authentication_classes((roa_authentication.CsrfExemptSessionAuthentication, SessionAuthentication))
@parser_classes((JSONParser,))
def log_anonymous_request(request):
    # Check post values
    log.debug('API - Log Anonymous - Called')

    if getattr(request, 'limited2', False):
        log.error('API - Log Anonymous - Rate limit exceeded')
        return Response({"ERROR": 2})
    try:
        log.info('API - Log Anonymous - Checking data - ' + str(request.data))

        log_level = int(request.data['LOG_LEVEL'])
        log_message = str(request.data['LOG_MESSAGE'])
    except KeyError as e:
        log.error('API - Log Anonymous - Invalid json format')
        return Response({"ERROR": 1})

    log_ip = "- empty -"
    if 'LOG_IP' in request.data:
        log_ip = request.data['LOG_IP']
    else:
        try:
            log_ip = request.META['REMOTE_ADDR']
        except Exception as e:
            log_ip = "- not retrieved -"

    log.info("API - Log Anonymous: Level: %s, IP: %s, Model:-1, Message: %s" % (str(log_level), log_ip, log_message))

    return Response({"ERROR": -1})


@api_view(['POST'])
@authentication_classes((TokenAuthentication, roa_authentication.CsrfExemptTokenAuthentication))
@permission_classes([IsAuthenticated, ])
@parser_classes((JSONParser,))
def log_request(request):
    # Check post values
    log.debug('API - Log - Called')

    user = get_user(request)

    if user.is_authenticated() == False:
        isAuthenticated = login_views.login_user_by_header_token(request)
        if isAuthenticated == False:
            log.error("API - Log - User had valid token, but we couldn't find and login him")
            return Response({"ERROR": 2})

    try:
        log.info('API - Log - Checking data - ' + str(request.data))
        log_level = int(request.data['LOG_LEVEL'])
        log_message = str(request.data['LOG_MESSAGE'])
    except KeyError as e:
        log.error('API - Log - Invalid json format')
        return Response({"ERROR": 1})

    log_ip = "- empty -"
    if 'LOG_IP' in request.data:
        log_ip = request.data['LOG_IP']
    else:
        try:
            log_ip = request.META['REMOTE_ADDR']
        except Exception as e:
            log_ip = "- not retrieved -"
    user_id = user.id
    user_name = user.username

    log.info("API - Log: Level: %s, IP: %s, Model:%s (%s), Message: %s" % (
        str(log_level), log_ip, user_id, user_name, log_message))

    return Response({"ERROR": -1})


@api_view(['POST'])
@authentication_classes((roa_authentication.CsrfExemptSessionAuthentication, SessionAuthentication))
@parser_classes((JSONParser,))
def login_request(request):
    # Check post values
    log.info('API - Login - Called')

    if getattr(request, 'limited2', False):
        log.error('API - Login - Rate limit exceeded')
        return Response(
            {'ERROR': utils.global_errors['ERROR_RATE_LIMIT'], 'CODE': -1, 'DATA': {'TOKEN': ''}, 'ACTION': -1,
             'CALLER': -1})
    try:
        log.info('API - Login - Checking data - ' + str(request.data))
        caller = int(request.data['CALLER'])
        action = int(request.data['ACTION'])
        data = request.data['DATA']
    except KeyError as e:
        log.error('API - Login - Invalid json format, aborting')
        return Response(
            {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {'TOKEN': ''}, 'ACTION': -1,
             'CALLER': -1})

    # Values dict
    values = {'ERROR': -1, 'CODE': '', 'DATA': {'TOKEN': ''}, 'ACTION': action, 'CALLER': caller}

    login_views.user_login(request, data, values)

    log.info('API - Login - Answer - ' + str(values))
    return Response(values)


@api_view(['POST'])
@authentication_classes((roa_authentication.CsrfExemptSessionAuthentication, SessionAuthentication))
@parser_classes((JSONParser,))
def launcher_request(request):
    log.info('API - Launcher - Called')
    if getattr(request, 'limited2', False):
        log.error('Rate limit exceeded')
        return Response(
            {'ERROR': utils.global_errors['ERROR_RATE_LIMIT'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})
    try:
        log.info('API - Launcher - Checking data - ' + str(request.data))

        caller = int(request.data['CALLER'])
        action = int(request.data['ACTION'])

    except KeyError as e:
        log.error('API - Launcher - Invalid json format, aborting')
        return Response(
            {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})

    # Values dict
    values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': action, 'CALLER': caller}
    if caller in utils.callers.values():
        if action in utils.actions.values():
            if caller == utils.callers['LAUNCHER']:
                log.debug('API - Launcher - Version check')
                values['CODE'] = utils.result_codes['LAUNCHER_VERSION_CHECK_SUCCESSFULLY']
                values['DATA'] = {'VALUE': '6.2', }
        else:
            # Unknown action
            log.error('API - Launcher - Unkown action')
            values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    else:
        # Unknown caller
        log.error('API - Launcher - Unkown caller')
        values['ERROR'] = utils.global_errors['ERROR_CALLER_UNKNOWN']

    log.info('API - Laucher - Answer - ' + str(values))
    return Response(values)


@api_view(['POST'])
@authentication_classes((roa_authentication.CsrfExemptSessionAuthentication, SessionAuthentication))
@parser_classes((JSONParser,))
def logout_request(request):
    log.info('API - Logout - Called')
    # Check post values
    if getattr(request, 'limited2', False):
        log.error('API - Logout - Rate limit exceeded')
        return Response(
            {'ERROR': utils.global_errors['ERROR_RATE_LIMIT'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})
    try:

        log.info('API - Logout - Checking data - ' + str(request.data))
        caller = int(request.data['CALLER'])
        action = int(request.data['ACTION'])
        data = request.data['DATA']

    except KeyError as e:
        log.error('API-Logout - Invalid json format, aborting')
        return Response(
            {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})
    # Values dict
    values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': action, 'CALLER': caller}
    login_views.user_logout(request, values)
    log.info('API - Logout - Answer - ' + str(values))
    return Response(values)


@api_view(['GET', 'POST', 'PUT'])
@authentication_classes((TokenAuthentication, roa_authentication.CsrfExemptTokenAuthentication))
@permission_classes([IsAuthenticated, ])
@parser_classes((JSONParser,))
def api_request(request):
    """Ajax function for api requests
    :param request: The request
    :return: JSON for evaluation
    """

    log.debug('API - Request - Called')
    # Check post values
    if getattr(request, 'limited2', False):
        log.error('API - Request - Rate limit exceeded')
        return Response(
            {'ERROR': utils.global_errors['ERROR_RATE_LIMIT'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})
    try:
        log.info("API - Request - Checking data: " + str(request.data))
        caller = int(request.data['CALLER'])
        action = int(request.data['ACTION'])
        data = request.data['DATA']

    except KeyError as e:
        log.error('API - Request - Invalid json format, aborting')
        return Response(
            {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': -1, 'CALLER': -1})

    # Values dict
    values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': action, 'CALLER': caller}

    # User is validated by token authentication class now, the problem is, the user won't be logged in if for example the launcher is calling.
    # Thats why we need to find the user by the header token and get the user for it from knox
    user = get_user(request)

    # Check if caller and action are valid
    if caller in utils.callers.values():
        if action in utils.actions.values():
            # Get server state
            try:
                test = 1
                # Get state
                # state = ServerState.objects.get(id=1)

                # Check for connection problems

                # LS outcommented.
                # if state.state != 0:
                #    log.error('Unigine server is offline: ' + str(state.state))
                #    return Response({'ERROR': utils.global_errors['ERROR_SERVER_OFFLINE'],
                #                       'CODE': -1, 'DATA': {}, 'ACTION': action, 'CALLER': caller})

            except ObjectDoesNotExist as e:
                log.error('API - Request - Server error, no state found')
                return Response(
                    {'ERROR': utils.global_errors['ERROR_MISC_ERROR'], 'CODE': -1, 'DATA': {}, 'ACTION': action,
                     'CALLER': caller})

            # Login/logout does not need authentication
            if caller == utils.callers['AUTHENTICATION']:
                api.authentication_actions(request, action, data, values)
            else:

                if user.is_authenticated() == False:
                    # If we run into this block the user requested external (launcher e.g.) and has already a valid token but is not authenticated.
                    log.debug("API - Request - User is not authenticated, authenticated by token")
                    isAuthenticated = login_views.login_user_by_header_token(request)
                    if isAuthenticated == False:
                        log.error("API - Request - User had valid token, but we couldn't find and login him")
                        return Response(
                            {'ERROR': utils.global_errors['ERROR_USER_NOT_AUTHENTICATED'], 'CODE': -1, 'DATA': {},
                             'ACTION': action,
                             'CALLER': caller})

                # All other views needs authenticated user
                if user.is_authenticated():
                    # Check for Caller
                    if caller == utils.callers['CHARACTER']:
                        api.character_actions(request, action, data, values)
                    elif caller == utils.callers['ACCOUNT']:
                        api.account_actions(request, action, data, values)
                    elif caller == utils.callers['CHANNEL']:
                        api.channel_actions(request, action, data, values)
                    elif caller == utils.callers['SYNC']:
                        api.sync_actions(request, action, data, values)
                    else:
                        # This should never be called right?
                        log.error('API - Request - Invalid/Unsupported caller')
                        values['ERROR'] = utils.global_errors['ERROR_MISC_ERROR']
                else:
                    # Authenticated error
                    log.error('API - Request - User is not authenticated, deny all access')
                    values['ERROR'] = utils.global_errors['ERROR_NOT_AUTHENTICATED']
        else:
            # Unknown action
            log.error('API - Request - Unknown action')
            values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    else:
        # Unknown caller
        log.error('API - Request - Unknown caller')
        values['ERROR'] = utils.global_errors['ERROR_CALLER_UNKNOWN']

    # Create json answer
    log.info('API - Request - Answer - ' + str(values))
    answer = Response(values)

    return answer


def update():
    return 0
