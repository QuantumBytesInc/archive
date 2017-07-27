# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

import sys
import os

# Project includes
from project.news.models import Entry

# Django imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.realpath('__file__')), 'roa-constants/constants')))
#External include
import roap_utils as utils

from django.core.exceptions import ObjectDoesNotExist
from django_cache_decorator import django_cache_decorator
import json

# Logging
import logging
log = logging.getLogger('portal')    #: System logger


@django_cache_decorator(time=60 * 15)
def get_news_overview(request, data, values):
    news = Entry.objects.filter(published=True)
    news = news.order_by('-created')
    news_json = {
        "NEWS": [],
        "CATEGORIES": [],
    }
    for entry in news:
        news_json["NEWS"].append(__generate_news_overview_entry(entry))

    for news_cat in Entry.NEWS_CATEGORIES:
        news_json["CATEGORIES"].append({
                "KEY": news_cat[0],
                "VALUE": news_cat[1],
        })
    values['DATA'] = news_json


def get_news_entry(request, data, values):
    encoded = json.loads(data)
    if "ID" in encoded:
        news_id = encoded["ID"]
        news = Entry.objects.filter(pk=news_id, published=True)
        if news.count() > 0:
            values['DATA'] = __generate_news_entry(news[0])
            values['CODE'] = utils.result_codes['PORTAL_NEWS_ENTRY_SUCCESSFULLY']
        else:
            values['CODE'] = utils.result_codes['PORTAL_NEWS_ENTRY_NOT_FOUND']
    else:
        values['CODE'] = utils.result_codes['PORTAL_NEWS_ENTRY_MISSING_DATA']


def __generate_news_overview_entry(_entry):
    entry_json = {
        'ID': _entry.id,
        'TITLE': _entry.title,
        'SHORT_TEXT': _entry.short_text,
        'CREATOR': _entry.creator.username,
        'CREATED_TIME': str(_entry.created),
        'EDITOR': '',
        'EDITED_TIME': '',
        'EDITED': False,
        'COMMENTS': [],
    }
    if str(_entry.updated) == "None":
        entry_json['EDITOR'] = str(_entry.editor.username),
        entry_json['EDITED_TIME'] = str(_entry.updated),
        entry_json['EDITED'] = True
    return entry_json


def __generate_news_entry(_entry):
    entry_json = {
        'ID': _entry.id,
        'TITLE': _entry.title,
        'TEXT':  _entry.text,
        'SHORT_TEXT': _entry.short_text,
        'CREATOR': _entry.creator.username,
        'CREATED_TIME': str(_entry.created),
        'EDITOR': '',
        'EDITED_TIME': '',
        'EDITED': False,
        'COMMENTS': [],
    }

    if str(_entry.updated) == "None":
        entry_json['EDITOR'] = str(_entry.editor.username),
        entry_json['EDITED_TIME'] = str(_entry.updated),
        entry_json['EDITED'] = True

    return entry_json


def crawler_get_entry(_id):
    news_data = {'TITLE': "",
                 'SHORT_TEXT': ""}
    try:
        news = Entry.objects.get(pk=_id)
        news_data['TITLE'] = news.title
        news_data['SHORT_TEXT'] = news.short_text
    except ObjectDoesNotExist:
        log.error("No _id for crawler")

    return news_data

