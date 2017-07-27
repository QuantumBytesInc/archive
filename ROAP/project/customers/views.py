# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import json
import requests
import sys
import os

# Django imports
from django.conf import settings
from languages_plus.models import Language
from countries_plus.models import Country
from django_cache_decorator import django_cache_decorator

# Project imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.realpath('__file__')), 'roa-constants/constants')))
#External include
import roap_utils as utils
import roaa_utils as authUtils

# Logging
import logging
import requests

log = logging.getLogger(__name__)


@django_cache_decorator(time=60 * 15)
def get_languages(request, values):
    """
    Get possible languages
    :param request: The request
    :param values: The value dict
    :return: The data
    """
    languages_arr = []

    for lang in Language.objects.all():
        lang_obj = {
            'KEY': lang.pk,
            'VALUE': str(lang),
        }
        languages_arr.append(lang_obj)
    values['DATA'] = languages_arr


@django_cache_decorator(time=60 * 15)
def get_countries(request, values):
    """
    Get possible countries
    :param request: The request
    :param values: The value dict
    :return: The data
    """
    country_arr = []

    for country in Country.objects.all():
        country_obj = {
            'KEY': country.pk,
            'VALUE': str(country),
        }
        country_arr.append(country_obj)
    values['DATA'] = country_arr


def __check_captcha(client_response):
    try:

        log.info("Check - Captcha: " + client_response)
        data = {'secret': settings.GOOGLE_CAPTCHA_SECRET,
                'response': client_response
                }
        google_response = requests.post('https://www.google.com/recaptcha/api/siteverify', data)
        json_response = google_response.json()
        if json_response['success'] == True:
            log.info("Check - Captcha - Response - True")
            return True
        else:
            log.info("Check - Captcha - Response - False")
            return False

    except Exception as e:
        log.info("Check - Captcha - Response - Exception False")
        return False


def register(data, values):
    """
    Try to register a new user
    :param data: Data from registration request
    :param values: The value dict
    :return: The data
    """
    try:
        # Encoded json
        encoded = json.loads(data)

        # Set user and password
        if "COUNTRY" not in encoded or \
                "CITY" not in encoded or \
                "STATE" not in encoded or \
                "STREET" not in encoded or \
                "ZIPCODE" not in encoded or \
                "BIRTH_DATE" not in encoded or \
                "SEX" not in encoded or \
                "LANGUAGE" not in encoded or \
                "USERNAME" not in encoded or \
                "FIRST_NAME" not in encoded or \
                "LAST_NAME" not in encoded or \
                "EMAIL" not in encoded or \
                "PREREQUISITES" not in encoded or \
                "SPAM_DETECTION" not in encoded:
            raise ValueError('Missing key', utils.result_codes['CUSTOMER_REGISTER_FAILED_MISSING_VALUES'])

        if not encoded["PREREQUISITES"]:
            raise ValueError('Age of majority / privacy policy / NDA not accepted',
                       utils.result_codes['CUSTOMER_REGISTER_FAILED_PREREQUISITES_INVALID'])

        if __check_captcha(encoded["SPAM_DETECTION"]) == False:
            log.error("Register - Captcha not valid")
            raise ValueError('Captcha not valid', utils.result_codes['CUSTOMER_REGISTER_FAILED_CAPTCHA_INVALID'])

        # Set data
        params = {'ACTION': authUtils.actions['USER_REGISTER'],
                  'CALLER': authUtils.callers['USER'],
                  'DATA': {"COUNTRY": encoded["COUNTRY"],
                           "CITY": encoded["CITY"],
                           "STATE": encoded["STATE"],
                           "STREET": encoded["STREET"],
                           "ZIPCODE": encoded["ZIPCODE"],
                           "BIRTH_DATE": encoded["BIRTH_DATE"],
                           "SEX": encoded["SEX"],
                           "LANGUAGE": encoded["LANGUAGE"],
                           "PREREQUISITES": True,
                           "USERNAME": encoded["USERNAME"],
                           "FIRST_NAME": encoded["FIRST_NAME"],
                           "LAST_NAME": encoded["LAST_NAME"],
                           "EMAIL": encoded["EMAIL"],
                           "CAPTCHA": encoded["SPAM_DETECTION"]
                           }}

        # Send request sync
        response = send_request(params)
        # Set code bases on answer
        if response.json()["CODE"] == authUtils.result_codes['USER_REGISTER_SUCCESSFULLY']:
            values['CODE'] = utils.result_codes['CUSTOMER_REGISTER_SUCCESSFULLY']
        else:
            values['CODE'] = response.json()["CODE"]

    except ValueError as e:
        log.error(e)
        values['CODE'] = e.args[1]


def set_data(request, data, values):
    """
    Modify user profile
    :param request: The request
    :param data: The json data
    :param values: The return dict
    :return: The data
    """
    try:
        if not request.user.is_authenticated():
            raise ValueError('User is not authenticated',
                       utils.result_codes['CUSTOMER_MODIFY_FAILED_NOT_LOGGED_IN'])

        # Encoded json
        encoded = json.loads(data)

        # Set user and password
        if "COUNTRY" not in encoded or \
                "CITY" not in encoded or \
                "STATE" not in encoded or \
                "STREET" not in encoded or \
                "ZIPCODE" not in encoded or \
                "BIRTH_DATE" not in encoded or \
                "SEX" not in encoded or \
                "LANGUAGE" not in encoded or \
                "FIRST_NAME" not in encoded or \
                "LAST_NAME" not in encoded or \
                "EMAIL" not in encoded:
            raise ValueError('Missing key', utils.result_codes['CUSTOMER_MODIFY_FAILED_MISSING_VALUES'])

        # Set values
        params = {'ACTION': authUtils.actions['USER_MODIFY'],
                  'CALLER': authUtils.callers['USER'],
                  'DATA': {"COUNTRY": encoded["COUNTRY"],
                           "CITY": encoded["CITY"],
                           "STATE": encoded["STATE"],
                           "STREET": encoded["STREET"],
                           "ZIPCODE": encoded["ZIPCODE"],
                           "BIRTH_DATE": encoded["BIRTH_DATE"],
                           "SEX": encoded["SEX"],
                           "LANGUAGE": encoded["LANGUAGE"],
                           "USERNAME": get_username(request),
                           "FIRST_NAME": encoded["FIRST_NAME"],
                           "LAST_NAME": encoded["LAST_NAME"],
                           "EMAIL": encoded["EMAIL"]
                           }}

        response = send_request(params)
        values['CODE'] = response.json()["CODE"]

    except ValueError as e:
        log.error(e)
        values['CODE'] = e.args[1]


def get_data(request, values):
    """
    Get user data
    :param request: The request
    :param values: Vales to return
    :return: The data
    """
    try:
        if not request.user.is_authenticated():
            raise ValueError('User is not authenticated',
                       utils.result_codes['CUSTOMER_MODIFY_FAILED_NOT_LOGGED_IN'])

        # Set data
        params = {'ACTION': authUtils.actions['USER_DATA'],
                  'CALLER': authUtils.callers['USER'],
                  'DATA': {"USERNAME": get_username(request)}
                  }

        response = send_request(params)

        values['CODE'] = response.json()["CODE"]
        values['DATA'] = response.json()["DATA"]
        values['DATA']['USERNAME'] = get_username(request)

    except ValueError as e:
        log.error(e)
        values['CODE'] = e.args[1]


def get_login_state(request, values):
    """
    Get users current login state
    :param request: The request
    :param values: Return values
    :return: The data
    """
    values['DATA'] = request.user.is_authenticated()
    values['CODE'] = utils.result_codes['CUSTOMER_AUTHENTICATED_SUCCESSFULLY']


def get_username(request):
    """
    Get users username
    :param request: The user request
    :return: The username
    """
    if request.user.is_authenticated():
        return request.user.username
    else:
        return ""


def send_request(params):
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
