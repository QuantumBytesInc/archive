# Copyright (C) 2016 Quantum Bytes Inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.core.validators import validate_email
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.http import JsonResponse

# Python imports
import datetime
import json
import regex
import logging

# Third party imports
from languages_plus.models import Language
from countries_plus.models import Country
from django_ajax.decorators import ajax

# Other imports
from project.user.models import User
from project import constants

# Set log format
log = logging.getLogger(__name__)


@ajax
def ajax_request(request):
    """
    JSON function for internal requests
    :param request: The request
    :return: JSON for evaluation
    """
    try:
        if request.method != 'POST':
            raise ValueError('Only POST requests supported', constants.global_errors['ERROR_ONLY_POST_SUPPORTED'])

        # Load json
        data = json.loads(request.body)

        # Values dict
        values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': data['ACTION'], 'CALLER': data['CALLER']}

        # Check if caller and action are valid
        if values['CALLER'] == constants.callers['USER']:
            if values['ACTION'] in {constants.actions['USER_RECOVER_INIT'],
                                    constants.actions['USER_ACTIVATE'],
                                    constants.actions['USER_RECOVER'],
                                    constants.actions['USER_REACTIVATE']}:
                # Do requests
                from project.internalapi.views import user_actions
                user_actions(request, values['ACTION'], values['DATA'], values)
            else:
                # Unknown action
                raise ValueError('Invalid action', constants.global_errors['ERROR_ACTION_UNKNOWN'])
        else:
            # Unknown caller
            raise ValueError('Invalid caller', constants.global_errors['ERROR_CALLER_UNKNOWN'])

        # Create json answer
        dict((k.lower(), v) for k, v in values.iteritems())

        return JsonResponse(values)

    except KeyError as e:
        log.exception(e.message)
        return JsonResponse({'ERROR': e.args[1]})
    except ValueError as e:
        log.exception(e.message)
        return JsonResponse({'ERROR': e.args[1]})


def validate_data(data, is_mod, skip_mail):
    """
    Validate general user data.
    :param data: The data
    :param is_mod: Is user modification
    """
    # Validate country
    try:
        Country.objects.get(pk=data['COUNTRY'])
    except ObjectDoesNotExist:
        raise ValueError('Country not found', constants.result_codes['USER_REGISTER_COUNTRY_NOT_FOUND'])

    # Validate city
    if len(data['CITY']) > User._meta.get_field('city').max_length:
        raise ValueError('City is to long', constants.result_codes['USER_REGISTER_CITY_TO_LONG'])
    if not data['CITY']:
        raise ValueError('City is empty', constants.result_codes['USER_REGISTER_CITY_EMPTY'])
    if regex.match(
            r"^([0-9a-zA-Z\u0080-\u024F\s]{1}[0-9a-zA-Z\s\u0080-\u024F\. |\-| |']*[0-9a-zA-Z\u0080-\u024F\.\s']{1})$",
            data['CITY']) is None:
        raise ValueError('City contains invalid characters', constants.result_codes['USER_REGISTER_CITY_INVALID'])

    # Validate state
    if len(data['STATE']) > User._meta.get_field('state').max_length:
        raise ValueError('State is to long', constants.result_codes['USER_REGISTER_STATE_TO_LONG'])
    if not data['STATE']:
        raise ValueError('State is empty', constants.result_codes['USER_REGISTER_STATE_EMPTY'])
    if regex.match(
            r"^([0-9a-zA-Z\u0080-\u024F\s]{1}[0-9a-zA-Z\s\u0080-\u024F\. |\-| |']*[0-9a-zA-Z\u0080-\u024F\.\s']{1})$",
            data['STATE']) is None:
        raise ValueError('State contains invalid characters', constants.result_codes['USER_REGISTER_STATE_INVALID'])

    # Validate street
    if len(data['STREET']) > User._meta.get_field('state').max_length:
        raise ValueError('Street is to long', constants.result_codes['USER_REGISTER_STREET_TO_LONG'])
    if not data['STREET']:
        raise ValueError('Street is empty', constants.result_codes['USER_REGISTER_STREET_EMPTY'])
    if regex.match(
            r"^([0-9a-zA-Z\u0080-\u024F\s]{1}[0-9a-zA-Z\s\u0080-\u024F\. |\-| |']*[0-9a-zA-Z\u0080-\u024F\.\s']{1})$",
            data['STREET']) is None:
        raise ValueError('Street contains invalid characters', constants.result_codes['USER_REGISTER_STREET_INVALID'])

    # Validate zipcode
    if len(data['ZIPCODE']) > User._meta.get_field('state').max_length:
        raise ValueError('Zipcode is to long', constants.result_codes['USER_REGISTER_ZIPCODE_TO_LONG'])
    if not data['ZIPCODE']:
        raise ValueError('Zipcode is empty', constants.result_codes['USER_REGISTER_ZIPCODE_EMPTY'])
    if regex.match(
            r"^([0-9a-zA-Z\u0080-\u024F\s]{1}[0-9a-zA-Z\s\u0080-\u024F\. |\-| |']*[0-9a-zA-Z\u0080-\u024F\.\s']{1})$",
            data['ZIPCODE']) is None:
        raise ValueError('Zipcode contains invalid characters', constants.result_codes['USER_REGISTER_ZIPCODE_INVALID'])

    # Validate birth date
    try:
        datetime.datetime.strptime(data['BIRTH_DATE'], '%Y-%m-%d')
    except ValueError:
        raise ValueError('Incorrect date format for birth date, should be YYYY.MM.DD',
                         constants.result_codes['USER_REGISTER_BIRTH_DATE_INVALID'])

    # Validate sex
    if any(data['SEX'] in s for s in ['FEM', 'MAL']) is not True:
        raise ValueError('Invalid sex, FEM or MAL allowed', constants.result_codes['USER_REGISTER_SEX_INVALID'])

    # Validate language
    try:
        Language.objects.get(pk=data['LANGUAGE'])
    except ObjectDoesNotExist:
        raise ValueError('Language not found', constants.result_codes['USER_REGISTER_LANGUAGE_NOT_FOUND'])

    # Validate prerequisites
    if not is_mod:
        if isinstance(data['PREREQUISITES'], bool) is not True:
            raise ValueError('Prerequisites must be boolean',
                             constants.result_codes['USER_REGISTER_PREREQUISITES_INVALID'])

    # Validate username
    if is_mod is not True:
        if regex.match(r'^([a-zA-Z0-9\s])+$', data['USERNAME']) is None:
            raise ValueError('Username contains invalid characters',
                             constants.result_codes['USER_REGISTER_USERNAME_INVALID'])
        if len(data['USERNAME']) > User._meta.get_field('state').max_length:
            raise ValueError('Username is to long', constants.result_codes['USER_REGISTER_USERNAME_TO_LONG'])
        if not data['USERNAME']:
            raise ValueError('Username is empty', constants.result_codes['USER_REGISTER_USERNAME_EMPTY'])
        try:
            User.objects.get(username=data['USERNAME'])
            raise ValueError('Username is taken', constants.result_codes['USER_REGISTER_USERNAME_TAKEN'])
        except ObjectDoesNotExist:
            pass

    # Validate first name
    if regex.match(
            r"^([0-9a-zA-Z\u0080-\u024F\s]{1}[0-9a-zA-Z\s\u0080-\u024F\. |\-| |']*[0-9a-zA-Z\u0080-\u024F\.\s']{1})$",
            data['FIRST_NAME']) is None:
        raise ValueError('First name contains invalid characters',
                         constants.result_codes['USER_REGISTER_FIRST_NAME_INVALID'])
    if not data['FIRST_NAME']:
        raise ValueError('First name is empty', constants.result_codes['USER_REGISTER_FIRST_NAME_EMPTY'])
    if len(data['FIRST_NAME']) > User._meta.get_field('state').max_length:
        raise ValueError('First name is to long', constants.result_codes['USER_REGISTER_FIRST_NAME_TO_LONG'])

    # Validate last name
    if regex.match(
            r"^([0-9a-zA-Z\u0080-\u024F\s]{1}[0-9a-zA-Z\s\u0080-\u024F\. |\-| |']*[0-9a-zA-Z\u0080-\u024F\.\s']{1})$",
            data['LAST_NAME']) is None:
        raise ValueError('Last name contains invalid characters',
                         constants.result_codes['USER_REGISTER_LAST_NAME_INVALID'])
    if not data['LAST_NAME']:
        raise ValueError('Last name is empty', constants.result_codes['USER_REGISTER_LAST_NAME_EMPTY'])
    if len(data['LAST_NAME']) > User._meta.get_field('state').max_length:
        raise ValueError('Lase name is to long', constants.result_codes['USER_REGISTER_LAST_NAME_TO_LONG'])

    # Validate email
    try:
        validate_email(data['EMAIL'])
    except ValidationError:
        raise ValueError('Invalid e-mail address found', constants.result_codes['USER_REGISTER_EMAIL_INVALID'])
    try:
        if not skip_mail:
            User.objects.get(email=data['EMAIL'])
            raise ValueError('E-Mail is taken', constants.result_codes['USER_REGISTER_EMAIL_TAKEN'])
    except ObjectDoesNotExist:
        pass


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip