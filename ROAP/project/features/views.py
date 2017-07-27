# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python includes
import json

# Django includes
from django.utils.encoding import smart_str
from django.core.exceptions import ObjectDoesNotExist
from django_cache_decorator import django_cache_decorator

# Project includes
from project.features.models import FeatureTranslation, Feature
from project.settings.base import STATIC_URL
from project.utils import get_current_language

# Logging
import logging

log = logging.getLogger(__name__)  #: System logger


@django_cache_decorator(time=60 * 15)
def get_overview(request, values):
    """
    Get features overview
    :param request: The request
    :param values: The values to return
    :return: None
    """
    user_language = get_current_language(request)
    features = Feature.objects.filter(feature_type='FEA').order_by('display_order')
    features_arr = []

    for feature in features:
        feature_json = {
            'ID': feature.id,
            'IMAGE': STATIC_URL + 'gui/img/' + str(feature.picture),
            'FEATURE_TYPE': feature.feature_type,
            'TITLE': smart_str(translation_title(feature.id, user_language)),
            'TEXT': smart_str(translation_text(feature.id, user_language)),
            'SIBLINGS': get_siblings_sub(feature.id, user_language)
        }
        features_arr.append(feature_json)

    values['DATA'] = features_arr


def get_feature(request, data, values):
    """
    Get feature
    :param request: The request
    :param data: The data with instructions
    :param values: Values to save
    :return: None
    """
    user_language = get_current_language(request)

    # Encoded json
    encoded = json.loads(data)

    if "PART" in encoded:
        part_id = encoded['PART']
    else:
        part_id = 1

    # Get data
    try:
        feature = Feature.objects.get(id=encoded['ID'])
        part = Feature.objects.filter(parent=feature.id, display_order=part_id)
        parts = Feature.objects.filter(parent=feature.id).order_by("display_order")

        if part.exists():
            part = part.get()
            parts_count = Feature.objects.filter(parent=feature.id).count()

            image_full_str = STATIC_URL + str(part.picture)
            image_pos = image_full_str.rfind('.')
            image_full_str = image_full_str[:image_pos] + '_full' + image_full_str[image_pos:]

            feature_json = {
                'PARENT_FEATURES': [],
                'SIBLINGS': get_siblings_sub(feature.parent.id, user_language),
                'IMAGE': STATIC_URL + str(part.picture),
                'IMAGE_FULL': image_full_str,
                'FEATURE_TYPE': part.feature_type,
                'TITLE': smart_str(translation_title_sub(part.id, user_language)),
                'TEXT': smart_str(translation_text(part.id, user_language)),
                'PARTS': parts_count,
                'PART': part_id,
                'PART_SLIDES': [],
                'FEATURE_ID': feature.id,
            }

            for imagePart in parts:
                image_full_part_str = STATIC_URL + str(imagePart.picture)
                image_part_pos = image_full_part_str.rfind('.')
                image_full_part_str = \
                    image_full_part_str[:image_part_pos] + '_full' + image_full_part_str[image_part_pos:]
                image_part_json = {
                    "ID": imagePart.id,
                    "IMAGE": STATIC_URL + str(imagePart.picture),
                    'IMAGE_FULL': image_full_part_str,
                    "TITLE": imagePart.title,
                    "TEXT": smart_str(translation_text(imagePart.id, user_language))
                }
                feature_json["PART_SLIDES"].append(image_part_json)

            # Get next main features
            parent_features = Feature.objects.filter(feature_type='FEA').order_by('display_order')

            for parent in parent_features:
                parent_json = {
                    'ID': parent.id,
                    'TITLE': translation_title(parent.id, user_language),
                    'SIBLINGS': get_siblings_sub(parent.id, user_language)
                }
                feature_json['PARENT_FEATURES'].append(parent_json)

            values['DATA'] = feature_json
        else:
            values['DATA'] = {}

    except ObjectDoesNotExist:
        log.error('Invalid feature id requested')


def translation_text(feature_id, language_id):
    """
    Get translation for feature text
    :param feature_id: Feature id
    :param language_id:  Language pk
    :return: Translated text
    """
    try:
        # Get translation object
        translation = FeatureTranslation.objects.get(language_id=language_id,
                                                     feature=feature_id)
        text = translation.text
    except ObjectDoesNotExist:
        text = FeatureTranslation.objects.get(language_id='en',
                                              feature=feature_id).text
    return text


def translation_title(feature_id, language_id):
    """
    Get translation for feature title
    :param feature_id: The feature id
    :param language_id: The language key
    :return: Translated title
    """
    try:
        # Get translation object
        translation = FeatureTranslation.objects.get(language_id=language_id,
                                                     feature=feature_id)
        title = translation.title
    except ObjectDoesNotExist:
        feature = Feature.objects.get(id=feature_id)
        title = feature.title

    return title


def translation_title_sub(feature_id, language_id):
    """
    Get sub feature translation
    :param feature_id:  Sub feature id
    :param language_id:  Language key
    :return: Translated sub feature text
    """
    try:
        # Get translation object
        translation = FeatureTranslation.objects.get(language_id=language_id,
                                                     feature=feature_id)
        title = translation.title
    except ObjectDoesNotExist:
        try:
            title = FeatureTranslation.objects.get(language_id='en',
                                                   feature=feature_id).title
        except ObjectDoesNotExist:
            feature = Feature.objects.get(id=feature_id)
            title = feature.title
    return title


def get_siblings_sub(feature_id, language_id):
    """
    Get sibling for a feature
    :param feature_id:  The feature id
    :param language_id: The language key
    :return: Siblings
    """
    sub_features_arr = []
    sub_features = Feature.objects.filter(parent=feature_id).order_by('display_order')

    for feature in sub_features:
        feature_json = {
            'PARENT_ID': feature.parent.id,
            'ID': feature.id,
            'IMAGE': STATIC_URL + 'gui/img/' + str(feature.picture),
            'FEATURE_TYPE': feature.feature_type,
            'TITLE': smart_str(translation_title(feature.id, language_id)),
        }
        sub_features_arr.append(feature_json)

    return sub_features_arr


def crawler_get_feature(_id, _part_id):
    faq_data = {
        'IMAGE': '',
        'PART_TITLE': '',
        'PART_TEXT': '',
    }
    try:
        feature = Feature.objects.get(pk=_id)
        part = Feature.objects.filter(parent=feature.id, display_order=_part_id)
        if part.exists():
            part = part.get()
            faq_data['IMAGE'] = STATIC_URL + str(part.picture)
            faq_data['PART_TITLE'] = translation_title_sub(part.id, 'en')
            faq_data['PART_TEXT'] = translation_text(part.id, 'en')
    except ObjectDoesNotExist:
        log.error("Crawler get feature exception")

    return faq_data
