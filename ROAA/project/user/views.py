# Copyright (C) 2016 Quantum Bytes Inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.utils.timezone import utc
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Python imports
import logging
import datetime

# Third party imports
from languages_plus.models import Language
from countries_plus.models import Country

# Other imports
from project.user.models import User
from project.user.utils import validate_data, get_client_ip
from project.user.forms import Reset, Password, Activate
from project.user.email_templates import *
from project import constants

# Set log format
log = logging.getLogger(__name__)

"""
Internal functions
"""
from django.contrib.auth import authenticate, login, logout

def register(data, values):
    """
    Internal: Register new user
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Register new user')
    values['DATA'] = {}

    try:
        # Validate
        validate_data(data, False, False)

        # Calculate token
        token = get_random_string(length=64)

        # Create user
        user = User.objects.create(country=Country.objects.get(pk=data['COUNTRY']),
                                   city=data['CITY'],
                                   state=data['STATE'],
                                   street=data['STREET'],
                                   zipcode=data['ZIPCODE'],
                                   birth_date=data['BIRTH_DATE'],
                                   sex=data['SEX'],
                                   activation_code=token,
                                   language=Language.objects.get(pk=data['LANGUAGE']),
                                   prerequisites=data['PREREQUISITES'],
                                   username=data['USERNAME'],
                                   first_name=data['FIRST_NAME'],
                                   last_name=data['LAST_NAME'],
                                   email=data['EMAIL'],
                                   is_activated=False,
                                   is_active=False,
                                   is_staff=False,
                                   is_superuser=False,
                                   is_locked=False,
                                   is_deleted=False,
                                   is_banned=False,
                                   needs_reactivation=False)

        # Save user
        user.save()
        
        log.info('User successfully registered')

        # Create answer
        values['DATA'] = {}
        values['CODE'] = constants.result_codes['USER_REGISTER_SUCCESSFULLY']

        send_mail(
            activation_text_header,
            activation_text_body % (user.username, settings.BASE_URL, token, settings.PORTAL_URL),
            'Relics of Annorath <noreply@annorath-game.com>',
            [user.email],
            fail_silently=False
        )

    except ValueError as e:
        log.exception(e)
        values['CODE'] = e.args[1]
    except Exception as e:
        log.exception(e)
        values['CODE'] = constants.result_codes['USER_REGISTER_FAILED_MISC']

    # Return answer
    return values


def get_token(request,data, values):
    """
    Internal: Modify user data.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Login user')
    values['DATA'] = {}

    try:
        # Set user and password
        username = data['USERNAME']
        password = data['PASSWORD']
        # Get user
        user = User.objects.get(username=username, password=password)

        if user is not None:
            #user exists
            values['CODE'] = constants.result_codes['USER_LOGIN_SUCCESSFULLY']

            if not request.user.is_authenticated():
                log.debug('User is not authenticated, authenticate called for ' + username)
                user = authenticate(username=user.username, password=password)
            else:
                log.debug('User is authenticated, logout and authenticate called for ' + username)
                logout(request)
                user = authenticate(username=user.username, password=password)

            login(request, user)
            
            log.info('User token requested successfully')
        else:
            #user is not existing
            values['CODE'] = constants.result_codes['USER_LOGIN_USER_NOT_FOUND']


    except ValueError as e:
        log.exception(e.message)
        values['CODE'] = e.args[1]
    except Exception as e:
        log.error(e.message)
        values['CODE'] = constants.result_codes['USER_LOGIN_FAILED_MISC']

    # Return answer
    return values


def modify(data, values):
    """
    Internal: Modify user data.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Modify user')
    values['DATA'] = {}

    try:
        # Get user
        user = User.objects.get(username=data['USERNAME'])

        # Validate
        if user.email == data['EMAIL']:
            validate_data(data, True, True)
        else:
            validate_data(data, True, False)

        user.country = Country.objects.get(pk=data['COUNTRY'])
        user.city = data['CITY']
        user.state = data['STATE']
        user.street = data['STREET']
        user.zipcode = data['ZIPCODE']
        user.birth_date = data['BIRTH_DATE']
        user.sex = data['SEX']
        user.language = Language.objects.get(pk=data['LANGUAGE'])
        user.first_name = data['FIRST_NAME']
        user.last_name = data['LAST_NAME']

        if user.email != data['EMAIL']:
            user.needs_reactivation = True
            user.is_active = False

            # Calculate token
            token = get_random_string(length=64)

            user.activation_code = token
            user.email = data['EMAIL']
            user.is_activated = False

            user.save()

            send_mail(
                reactivation_text_header,
                reactivation_text_body % (user.username, settings.BASE_URL, token, settings.PORTAL_URL),
                'Relics of Annorath <noreply@annorath-game.com>',
                [user.email],
                fail_silently=False
            )

            values['DATA'] = {}

            values['CODE'] = constants.result_codes['USER_MODIFY_NEEDS_REACTIVATION']
        else:
            values['CODE'] = constants.result_codes['USER_MODIFY_SUCCESSFULLY']

        # Save user
        user.save()
        
        log.info('User successfully modified')

    except ValueError as e:
        log.exception(e)
        values['CODE'] = e.args[1]
    except ObjectDoesNotExist as e:
        log.exception(e)
        log.error(data['USERNAME'])
        values['CODE'] = constants.result_codes['USER_MODIFY_USER_NOT_FOUND']
    except Exception as e:
        log.error(e)
        values['CODE'] = constants.result_codes['USER_MODIFY_FAILED_MISC']

    # Return answer
    return values


def ban(data, values):
    """
    Internal: Ban user.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Ban user')
    values['DATA'] = {}
    #
    # try:
    #     # Get user
    #     user = User.objects.get(username=data['USERNAME'])
    #     user.is_banned = True
    #
    #     # Save user
    #     user.save()
    #
    #     values['CODE'] = constants.result_codes['USER_BAN_SUCCESSFULLY']
    #
    # except ObjectDoesNotExist as e:
    #     log.error(e.message)
    #     values['CODE'] = constants.result_codes['USER_BAN_USER_NOT_FOUND']
    # except Exception as e:
    #     log.error(e.message)
    #     values['CODE'] = constants.result_codes['USER_BAN_FAILED_MISC']
    #
    # # Return answer
    return values


def lock(data, values):
    """
    Internal: Lock user.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Lock user')
    values['DATA'] = {}
    #
    # try:
    #     # Get user
    #     user = User.objects.get(username=data['USERNAME'])
    #     user.is_locked = True
    #
    #     # Calculate token
    #     token = get_random_string(length=64)
    #
    #     user.password_recovery_date = datetime.datetime.utcnow().replace(tzinfo=utc)
    #     user.password_recovery_token = token
    #
    #     # Save user
    #     user.save()
    #
    #     send_mail(
    #         reactivation_text_header,
    #         reactivation_text_body % (user.username, settings.BASE_URL, token, settings.PORTAL_URL),
    #         'Relics of Annorath <noreply@annorath-game.com>',
    #         [user.email],
    #         fail_silently=False
    #     )
    #
    #     values['CODE'] = constants.result_codes['USER_LOCK_SUCCESSFULLY']
    #
    # except ObjectDoesNotExist as e:
    #     log.error(e.message)
    #     values['CODE'] = constants.result_codes['USER_LOCK_USER_NOT_FOUND']
    # except Exception as e:
    #     log.error(e.message)
    #     values['CODE'] = constants.result_codes['USER_LOCK_FAILED_MISC']
    #
    # # Return answer
    return values


def get_data(data, values):
    """
    Internal: Get data from user.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Get user data')
    values['DATA'] = {}

    try:
        # Get user
        user = User.objects.get(username=data['USERNAME'])

        values['DATA'] = {'COUNTRY': user.country.pk,
                          'CITY': user.city,
                          'STATE': user.state,
                          'STREET': user.street,
                          'ZIPCODE': user.zipcode,
                          'BIRTH_DATE': user.birth_date,
                          'SEX': user.sex,
                          'LANGUAGE': user.language.pk,
                          'FIRST_NAME': user.first_name,
                          'LAST_NAME': user.last_name,
                          'EMAIL': user.email}

        values['CODE'] = constants.result_codes['USER_DATA_SUCCESSFULLY']
        
        log.info('User data successfully requested')

    except ObjectDoesNotExist as e:
        log.error(e)
        values['CODE'] = constants.result_codes['USER_DATA_USER_NOT_FOUND']
    except Exception as e:
        log.error(e)
        values['CODE'] = constants.result_codes['USER_DATA_FAILED_MISC']

    # Return answer
    return values


"""
Public functions
"""


def reactivate(data, values):
    """
    Public: Reactivate user.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Activating user with token')
    values['DATA'] = {}

    # try:
    #     # Get user
    #     user = User.objects.get(activation_code=data['TOKEN'])
    #     user.needs_reactivation = False
    #
    #     # Save user
    #     user.save()
    #
    #     values['CODE'] = constants.result_codes['USER_REACTIVATE_SUCCESSFULLY']
    #
    # except ObjectDoesNotExist as e:
    #     log.error(e.message)
    #     values['CODE'] = constants.result_codes['USER_REACTIVATE_INVALID_TOKEN']
    # except Exception as e:
    #     log.error(e.message)
    # values['CODE'] = constants.result_codes['USER_REACTIVATE_FAILED_MISC']
    #
    # # Return answer
    return values


def activate(request):
    """
    Public: Activate user.
    :param data: The data
    :param values: The values to return
    :return: Success state with message body
    """
    log.info('Activating user with token')

    if request.method == 'POST':
            form = Activate(request.POST)

            if form.is_valid():
                # Get user
                user = User.objects.get(activation_code=form.cleaned_data['token'])

                user.activation_ip = get_client_ip(request)
                user.activation_date = datetime.datetime.utcnow().replace(tzinfo=utc)
                user.is_activated = True
                user.is_active = True
                user.set_password(form.cleaned_data['password1'])

                # Save user
                user.save()
                
                log.info('User successfully activated')

                return HttpResponseRedirect('/activate_successfully/')

            else:
                return render(request, 'activate.html', {'form': form})

    else:
        form = Activate(initial={'token': request.path_info.split('/')[-1]})
        return render(request, 'activate.html', {'form': form})


def reset(request):
    """
    Public: Set recovery token for user.
    :param request: The data
    :return: State
    """
    log.info('Set recovery user')

    if request.method == 'POST':
        try:
            form = Reset(request.POST)

            if form.is_valid():
                # Get user
                user = User.objects.get(email=form.cleaned_data['account_mail'])

                # Calculate token
                token = get_random_string(length=64)
                user.password_recovery_date = datetime.datetime.utcnow().replace(tzinfo=utc)
                user.password_recovery_token = token
                user.needs_reactivation = True

                # Save user
                user.save()
                
                log.info('User reset successfully')

                send_mail(
                    recovery_text_header,
                    recovery_text_body % (user.username, settings.BASE_URL, token, settings.PORTAL_URL),
                    'Relics of Annorath <noreply@annorath-game.com>',
                    [user.email],
                    fail_silently=False
                )

                return HttpResponseRedirect('/reset_successfully/')

            else:
                return render(request, 'reset.html', {'form': form})

        except ObjectDoesNotExist as e:
            log.error(e)
            return HttpResponseRedirect('/reset_successfully/')

    else:
        form = Reset()
        return render(request, 'reset.html', {'form': form})


def recover(request):
    """
    Public: Set recovery token for user.
    :param request: The data
    :return: State
    """
    if request.method == 'POST':
        try:
            form = Password(request.POST)

            if form.is_valid():
                # Get user
                user = User.objects.get(password_recovery_token=form.cleaned_data['token'])
                user.set_password(form.cleaned_data['password1'])

                # Save user
                user.save()
                
                log.info('User reset token successfully requested')

                send_mail(
                    recovery_done_text_header,
                    recovery_done_text_body % (user.username, settings.PORTAL_URL),
                    'Relics of Annorath <noreply@annorath-game.com>',
                    [user.email],
                    fail_silently=False
                )

                return HttpResponseRedirect('/recover_successfully/')

            else:
                return render(request, 'recover.html', {'form': form})

        except ObjectDoesNotExist as e:
            log.error(e)
            return HttpResponseRedirect('/recover_successfully/')

    else:
        form = Password(initial={'token': request.path_info.split('/')[-1]})
        return render(request, 'recover.html', {'form': form})
