# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Project includes
from project.faq.models import FAQEntry
from django.core.exceptions import ObjectDoesNotExist
from django_cache_decorator import django_cache_decorator
import logging

log = logging.getLogger(__name__)  #: System logger


@django_cache_decorator(time=60 * 15)
def get_faqs(request, values):
    """
    Get faq entries
    :param request: The request
    :param values: Return faq data as json
    :return:
    """
    faq_json = {'FAQS': [], 'CATEGORIES': []}
    faq_entries = FAQEntry.objects.order_by('created')

    for faq in faq_entries:
        faq_data_json = {
            'TITLE': faq.title,
            'CATEGORY': faq.category,
            'TEXT': faq.text,
            'ID': faq.id,
        }
        faq_json['FAQS'].append(faq_data_json)

    for faq_cat in FAQEntry.FAQ_CATEGORIES:
        faq_json['CATEGORIES'].append({
            "KEY": faq_cat[0],
            "VALUE": faq_cat[1],
        })

    values['DATA'] = faq_json


def crawler_get_faq(_id):
    faq_data = {'CATEGORY': "",
                'TITLE': "",
                'TEXT': ""}
    try:
        faq_entry = FAQEntry.objects.get(pk=_id)
        faq_data['TITLE'] = faq_entry.title
        faq_data['CATEGORY'] = faq_entry.category
        faq_data['TEXT'] = faq_entry.text
    except ObjectDoesNotExist:
        log.error("No _id for crawler")

    return faq_data


