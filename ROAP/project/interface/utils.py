# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Django imports

# Python imports

import sys
import os
# Django imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.realpath('__file__')), 'roa-constants/constants')))
#External include
import roap_utils as utils

from project.news import views as news_views
from project.faq import views as faq_views
from project.features import views as feature_views
from project.customers import views as customer_views
from project.contacts import views as contact_views
from project import utils as portal_utils

# Set logging
import logging
log = logging.getLogger(__name__)


def portal_actions(request, action, data, values):
    """
    Handles all portal related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == utils.actions['PORTAL_NEWS']:
        news_views.get_news_overview(request, data, values)
    elif action == utils.actions['PORTAL_NEWS_ENTRY']:
        news_views.get_news_entry(request, data, values)
    elif action == utils.actions['PORTAL_FAQS']:
        faq_views.get_faqs(request, values)
    elif action == utils.actions['PORTAL_LANGUAGES']:
        portal_utils.get_supported_languages(values)
    elif action == utils.actions['PORTAL_SET_LANGUAGE']:
        portal_utils.set_current_language(request, data)
    elif action == utils.actions['PORTAL_GET_LANGUAGE']:
        values['DATA']['LANGUAGE'] = portal_utils.get_current_language(request)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    return values


def features_actions(request, action, data, values):
    """
    Handles all feature related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == utils.actions['FEATURES_OVERVIEW']:
        feature_views.get_overview(request, values)
    elif action == utils.actions['FEATURES_FEATURE']:
        feature_views.get_feature(request, data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    return values


def contact_actions(request, action, data, values):
    """
    Handles all contact related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == utils.actions['CONTACT_SEND_MAIL']:
        contact_views.send_mail(request, data, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    return values


def customer_actions(request, action, data, values):
    """
    Handles all customer related stuff.
    :param request: The request
    :param action: The action
    :param data: The additional data, may be empty
    :param values: The values for the end result
    :return: Provided values with new data
    """
    if action == utils.actions['CUSTOMER_REGISTER']:
        customer_views.register(data, values)
    elif action == utils.actions['CUSTOMER_MODIFY']:
        customer_views.set_data(request, data, values)
    elif action == utils.actions['CUSTOMER_LANGUAGES']:
        customer_views.get_languages(request, values)
    elif action == utils.actions['CUSTOMER_COUNTRIES']:
        customer_views.get_countries(request, values)
    elif action == utils.actions['CUSTOMER_DATA']:
        customer_views.get_data(request, values)
    elif action == utils.actions["CUSTOMER_AUTHENTICATED"]:
        customer_views.get_login_state(request, values)
    else:
        log.error('Unknown action called: ' + str(action))
        values['ERROR'] = utils.global_errors['ERROR_ACTION_UNKNOWN']
    return values
