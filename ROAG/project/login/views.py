# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib.auth import authenticate, login, logout, get_user
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.utils.timezone import utc
from django.conf import settings
from knox.auth import TokenAuthentication, AuthToken
from knox.crypto import hash_token
from knox.settings import CONSTANTS
from django.utils import timezone

from django.contrib.auth.signals import user_logged_in
# Python imports
import uuid
import json
import logging
import datetime
import requests
import sys
import os

from rest_framework.authentication import (
    get_authorization_header
)

# Model imports
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from project.account.models import Token, Character
from project.login.models import LoginFailed
from project.stats.models import UserLogin, LauncherDownload, CharacterJoin, PlayDuration

# Other imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.realpath('__file__')), 'roa-constants/constants')))
# External include
import roaa_utils as roaa_interface

from project.gui import utils

# Set logging
log = logging.getLogger(__name__)

IS_DEV = True

DEV_USER = [
    {'USERNAME': 'hansblub',
     'TOKEN': 'FFFDDDAAA3493409340',
     },
    {'USERNAME': 'testing',
     'TOKEN': 'AAADDDAAA3493409340',
     },
]


def user_login(request, data, values):
    """
    Private API called by Interface-Login and checking the user
    :param request: The request
    :param data:  The data as json
    :param values: The result values
    :return: The values with new data
    """
    try:
        values['DATA'] = {'TOKEN': ''}
        log.debug("LOGIN - Login - Called")

        # Encoded json
        encoded = data

        # Get user and password
        passed_username = encoded['USERNAME']
        # Password will be send to ROAA aswell because it needs to be checked
        passed_password = encoded['PASSWORD']

        # Strip all spaces and have a look if the variable is not empty
        if passed_username is None or \
                        passed_username.strip() == '' or \
                        passed_password is None or \
                        passed_password.strip() == '':
            log.error("LOGIN - Login - Values missing")
            values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_FAILED_MISSING_VALUES']
            return values

        log.info("GUI - LOIN - USER: " + passed_username)

        # username_exactly doesn't work because it crashes django.db.utils.IntegrityError: duplicate key value violates unique constraint "auth_user_username_key" DETAIL:  Key (username)=() already exists.
        # user, created = User.objects.get_or_create(username='hansblub')
        # if created == True:
        #    # Saftey
        #    user.username = 'hansblub'
        #    user.save()

        if IS_DEV:
            # When we're in dev mode, we're checking for a normal login by website.
            for dev_user in DEV_USER:
                if (dev_user["USERNAME"] == passed_username):
                    log.debug("LOGIN - Login  - Dummy account login " + passed_username)
                    # Set right backend because our cas provider
                    user, created = User.objects.get_or_create(username=passed_username)
                    user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, user)
                    # Delete old token, even from testing users
                    __delete_old_user_tokens(user)
                    # Create new token which will be passed back now
                    new_token = AuthToken.objects.create(user)
                    values['DATA'] = {'TOKEN': new_token}
                    characters = Character.objects.filter(user=user)
                    for character in characters:
                        character.is_spawned = False
                        character.save()

                    values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_SUCCESSFULLY']
                    return values

        # We're now online with a complete normal user, so we're checking against ROAA
        ##Call ROAA
        verify_login_params = {
            "CALLER": roaa_interface.callers['GUI'],
            "ACTION": roaa_interface.actions['GUI_VERIFY_CREDENTIALS'],
            "DATA": {
                "USERNAME": passed_username,
                "PASSWORD": passed_password
            }
        }

        response = __send_request(verify_login_params)
        json_response = response.json()

        log.debug("LOGIN - Login - RESPONSE - " + str(json_response))

        if json_response["CODE"] == roaa_interface.result_codes['GUI_VERIFY_CREDENTIALS_SUCCESSFULLY']:
            # Verify successfully
            user, created = User.objects.get_or_create(username=passed_username)
            if created:
                log.debug('LOGIN - Login - User didn\'t exist, so he got created ' + passed_username)
                # User doesn't exist, so create him without any password
                # Set username, because django bug.
                user.username = passed_username
                user.password = ""
                user.save()
            if user is not None:
                log.debug('LOGIN - Login - User found successfully ' + passed_username)
                # Set right backend because our cas provider
                user.backend = 'django.contrib.auth.backends.ModelBackend'
                login(request, user)

                __delete_old_user_tokens(user)
                # Create new token which will be passed back now
                new_token = AuthToken.objects.create(user)
                values['DATA'] = {'TOKEN': new_token}

                # Set code
                values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_SUCCESSFULLY']
                # Reset characters
                characters = Character.objects.filter(user=user)

                for character in characters:
                    character.is_spawned = False
                    character.save()

                log.debug('LOGIN - Login - User token created successfully')

        else:
            # Couldn't be verifyfied
            # Something terrible happend
            log.error("LOGIN - Login - Wrong credentials provided")

            # Attention - The CODE is the self on ROAA and ROAG, so we're just matching the code.
            values['CODE'] = json_response["CODE"]

        return values

    except (ObjectDoesNotExist, KeyError, ValueError) as e:
        log.error("LOGIN - Login - Exception triggered" + str(e))

        values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_FAILED_WRONG_USER_OR_PASSWORD']

        return values


def user_login_by_token(request, data, values):
    """
    User login by token
    :param request: The request
    :param data:  The data as json
    :param values: The result values
    :return: The values with new data
    """
    try:
        log.debug("LOGIN - User login by token - Called")


        authenticated = login_user_by_header_token(request)
        #Get user after authentication process, else the user object is wrong
        user = get_user(request)
        if user is not None and authenticated:
            log.debug("LOGIN - User login by token - User is successfully authenticated")
            __delete_old_user_tokens(user)

            log.debug("LOGIN - User login by token - Token deleted, create new one")
            new_token = AuthToken.objects.create(user)
            values['DATA'] = {'TOKEN': new_token}
            log.debug("LOGIN - User login by token - New token: " + str(new_token))

            # Set code
            values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_BY_TOKEN_SUCCESSFULLY']

            # Reset characters
            characters = Character.objects.filter(user=user)

            for character in characters:
                character.is_spawned = False
                character.save()

        else:
            # Something terrible happend
            log.error("LOGIN - User login by token - User could not be authenticated, logout this request")
            user_logout(request)
            values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_BY_TOKEN_UNSUCCESSFULLY']
            values['DATA'] = {}

        return values

    except (ObjectDoesNotExist, KeyError, ValueError) as e:
        log.error("LOGIN - User login by token - Exception triggered" + str(e))
        log.error("LOGIN - User login by token - Because of exception, logout this request")
        user_logout(request)
        values['CODE'] = utils.result_codes['AUTHENTICATION_LOGIN_FAILED_WRONG_USER_OR_PASSWORD']
        values['DATA'] = {}

        return values


def user_logout(request, values):
    """
    Logout the user.
    :param request: The request
    :param values: The result values
    :return:
    """
    log.debug("LOGIN - User logout - Called")

    try:
        user = get_user(request)

        if not user.is_anonymous() and user.is_authenticated():
            # Encoded json
            log.debug("LOGIN - User logout - User is authenticated")
            values['DATA'] = {}
            if Character.objects.filter(user=user, is_spawned=True).count() > 0:
                last_join = CharacterJoin.objects.filter(
                    character=Character.objects.get(user=user, is_spawned=True)).order_by(
                    '-id')
                if last_join is not None and last_join.count() > 0:
                    duration, created = PlayDuration.objects.get_or_create(join=last_join[0],
                                                                           defaults={'character': last_join.character,
                                                                                     'join': last_join})
                    if created:
                        delta = datetime.datetime.utcnow().replace(tzinfo=utc) - last_join.date
                        duration.duration = delta.total_seconds()
                        duration.save()
                        log.debug("LOGIN - User logout - Stats saved")

    except (ObjectDoesNotExist, IndexError, MultipleObjectsReturned) as e:
        log.error("LOGIN - User logout - Exception triggered" + str(e))
        if user.is_authenticated():
            # Reset characters
            characters = Character.objects.filter(user=user)
            for character in characters:
                if character.is_spawned:
                    character.is_spawned = False
                    character.save()

    if not user.is_anonymous():
        # Reset characters
        characters = Character.objects.filter(user=user)

        for character in characters:
            if character.is_spawned:
                character.is_spawned = False
                character.save()

        try:
            request.user.auth_token_set.all().delete()
        except Exception as e:
            log.error("LOGIN - User logout - Exception triggered" + str(e))

        try:
            # Search token manualy if the call is not within web - so the user reference wouldn't have tokens at all
            __delete_old_user_tokens(user)
        except Exception as e:
            log.error("LOGIN - User logout - Exception triggered" + str(e))
    else:
        log.debug("LOGIN - User logout - User is anonym, we cant delete something")

    logout(request)
    log.debug("LOGIN - User logout - Successfully")
    # Delete old tokens
    values['CODE'] = utils.result_codes['AUTHENTICATION_LOGOUT_SUCCESSFULLY']
    return values


@login_required
def user_refresh_token(request, data, values):
    """
    User login view
    :param request: The request
    :param data:  The data as json
    :param values: The result values
    :return: The values with new data
    """
    try:
        log.debug("LOGIN - User refresh token - Called")
        values['DATA'] = {'TOKEN': ''}
        user_to_refresh = get_user(request)
        __delete_old_user_tokens(user_to_refresh)
        new_token = AuthToken.objects.create(user=user_to_refresh)
        values['DATA'] = {'TOKEN': new_token}
        log.debug("LOGIN - User refresh token - New token: " + str(new_token))
        values['CODE'] = utils.result_codes['AUTHENTICATION_TOKEN_REFRESH_SUCCESSFULLY']
        return values

    except Exception as e:
        log.error("LOGIN - User refresh token - Exception triggered" + str(e))
        logout(request)
        values['CODE'] = utils.result_codes['AUTHENTICATION_TOKEN_REFRESH_FAILED_MISC']
        return values


def user_aes_encryption(request, data, values):
    """
    Get encryption key.
    :param request: The request
    :param values: The result values
    :return:
    """
    try:
        log.debug('LOGIN - AES encryption - Called')

        # Encoded json
        encoded = data

        # Set token and user
        token = encoded['TOKEN']

        token = Token.objects.get(token=token)
        user = User.objects.get(id=token.user)

        # Validate token life time
        if datetime.datetime.utcnow().replace(tzinfo=utc) - datetime.timedelta(minutes=5) < token.created:
            values['DATA'] = {'HEART_BEAT': '729308A8E815F6A46EB3A8AE6D5463CA7B64A0E2E11BC26A68106FC7697E727E37011'}
            values['CODE'] = utils.result_codes['AUTHENTICATION_HEART_BEAT_SUCCESSFULLY']

        else:
            values['DATA'] = {'HEART_BEAT': ''}
            values['CODE'] = utils.result_codes['AUTHENTICATION_HEART_BEAT_FAILED_MISC']

        return values

    except (ObjectDoesNotExist, KeyError, ValueError) as e:
        log.error("LOGIN - User aes encryption - Exception triggered" + str(e))
        values['CODE'] = utils.result_codes['AUTHENTICATION_HEART_BEAT_FAILED_MISC']
        values['DATA'] = {'HEART_BEAT': ''}

        return values


def get_token_validity(token):
    log.debug("LOGIN - Get token validity - Token : " + token)
    for auth_token in AuthToken.objects.all():
        digest = hash_token(token, auth_token.salt)
        if (digest == auth_token.digest):
            if auth_token.expires < timezone.now():
                log.error("LOGIN - Get token validity - Token expired")
                return False
            else:
                log.debug("LOGIN - Get token validity - Token valid")
                return True

    log.error("LOGIN - Get token validity - Token not found")
    return False


def get_user_by_token(token):
    log.debug("LOGIN - User by token - Token: " + token)
    for auth_token in AuthToken.objects.all():
        digest = hash_token(token, auth_token.salt)
        if (digest == auth_token.digest):
            auth_token.user.backend = 'django.contrib.auth.backends.ModelBackend'
            log.debug("LOGIN - User by token - User found")
            return auth_token.user

    log.error("LOGIN - User by token - User not found")
    return None


# obsolete
def login_development_user(request):
    log.debug("LOGIN - Login development user - Called")
    try:
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'token':
            log.debug("LOGIN - Login development user - No Token exists")
        if len(auth) == 2:
            # Everything is fine
            token_in_header = auth[1]
            log.debug("LOGIN - Login development user - Token found: " + str(token_in_header))
            for dev_user in DEV_USER:
                if dev_user["TOKEN"] == token_in_header:
                    log.debug("LOGIN - Login development user  - Token passes ")
                    # Set right backend because our cas provider
                    user, created = User.objects.get_or_create(username=dev_user["USERNAME"])
                    user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, user)
                    characters = Character.objects.filter(user=user)
                    for character in characters:
                        character.is_spawned = False
                        character.save()
                    return True

    except Exception as e:
        log.error("LOGIN - Login development user - Exception triggered" + str(e))

    log.error("LOGIN - Login development user - User could not be found")
    return False


def login_user_by_header_token(request):
    try:
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'token':
            log.debug("LOGIN - User by header token - No token exists")
        if len(auth) == 2:
            # Everything is fine
            token_in_header = auth[1]
            log.debug("LOGIN - User by header token - Token found: " + str(token_in_header))
            for auth_token in AuthToken.objects.all():
                digest = hash_token(token_in_header, auth_token.salt)
                if (digest == auth_token.digest):
                    auth_token.user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, auth_token.user)
                    return True
    except Exception as e:
        log.error("LOGIN - User by header token - Exception triggered" + str(e))

    log.error("LOGIN - User by header token - User could not be found")
    return False


def __delete_old_user_tokens(user):
    auth_tokens = AuthToken.objects.filter(user=user)
    if (auth_tokens.count() > 0):
        auth_tokens.delete()


##Obsolete
def __delete_token(request):
    try:
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'token':
            log.info("Delete Token - No token exist to be deleted")
        if len(auth) == 2:
            # Everything is fine
            token_in_header = auth[1]
            log.info("Delete Token - Delete token " + str(token_in_header))
            for auth_token in AuthToken.objects.all():
                digest = hash_token(token_in_header, auth_token.salt)
                if (digest == auth_token.digest):
                    auth_token.delete()
                    return
    except Exception as e:
        log.error("Delete Token -  Exception triggered")


def __send_request(params):
    """
    Sends the request to the RoA-Authentication server
    :param params: Inherits action, data, caller
    :return: The request response from ROAA
    """
    # Set access data
    params['ACCESS'] = settings.INTERNAL_API_ACCESS_KEY
    params['SECRET'] = settings.INTERNAL_API_SECRET_KEY

    # Send request
    response = requests.post(settings.CAS_SERVER_URL_INTERFACE, data=None, json=params, verify=False,
                             headers={'Referer': settings.CAS_SERVER_URL,
                                      "X-Requested-With": "XMLHttpRequest",
                                      "X-Custom-User-Agent": "Custom Portal Website 1.0",
                                      "User-Agent": "Custom Portal Website",
                                      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"})

    return response
