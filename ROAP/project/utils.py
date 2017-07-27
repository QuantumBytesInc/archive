# -*- coding: utf-8 -*-
# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
from __future__ import unicode_literals
import json

# Django imports
from django.http import HttpResponse

# Project imports
from project.settings.base import BASE_URL
from project.news.models import Entry as News
from project.faq.models import FAQEntry
from project.features.models import Feature

# Set logging
import logging
log = logging.getLogger(__name__)


def get_current_language(request):
    """
    Get the current user language from the session
    :param request: The request
    :return: The language
    """
    if 'language_code' in request.session:
        return request.session['language_code']
    else:
        # Fallback
        return 'en'


def set_current_language(request, data):
    """
    Set current user language to the session
    :param request: The request
    :return: None
    """
    try:
        request.session['language_code'] = json.loads(data)["LANGUAGE"]
    except KeyError:
        log.error('Set language failed')


def get_supported_languages(values):

    languages_arr = [
        {
            "KEY": 'en',
            "VALUE": 'English',
        },
        {
            "KEY": 'de',
            "VALUE": 'Deutsch',
        },
        {
            "KEY": 'fr',
            "VALUE": 'Français',
        },
        {
            "KEY": 'pl',
            "VALUE": 'Polszczyzna',
        }
    ]

    values['DATA'] = languages_arr


def sitemap(request):
    """
    Create sitemap for search engines.
    :param request: Request object, not used
    :return:
    """
    xml_data = '<urlset xsi:schemalocation="http://www.sitemaps.org/schemas/sitemap/0.9 ' \
               'http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" ' \
               'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' \
               'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    # Add landing pages
    xml_data += '\t<url><loc>' + BASE_URL + 'game/</loc><changefreq>daily</changefreq></url>\n'
    xml_data += '\t<url><loc>' + BASE_URL + 'news/</loc><changefreq>daily</changefreq></url>\n'
    xml_data += '\t<url><loc>' + BASE_URL + 'features/</loc><changefreq>daily</changefreq></url>\n'
    xml_data += '\t<url><loc>' + BASE_URL + 'faq/</loc><changefreq>daily</changefreq></url>\n'
    xml_data += '\t<url><loc>' + BASE_URL + '</loc><changefreq>daily</changefreq></url>\n'

    # Add all news entries
    news = News.objects.filter(published=True)

    for entry in news:
        xml_data += '\t<url><loc>' + BASE_URL + 'news/' + str(entry.id) + '/</loc><changefreq>daily</changefreq><lastmod>' + entry.created.strftime("%Y-%m-%d") + '</lastmod></url>\n'

    # Add all faq entries
    faqs = FAQEntry.objects.all()

    for entry in faqs:
        xml_data += '\t<url><loc>' + BASE_URL + 'faq/' + entry.category + \
                    '/' + str(entry.id) + '/</loc><changefreq>daily</changefreq><lastmod>' + entry.created.strftime("%Y-%m-%d") + '</lastmod></url>\n'

    # Add all features entries
    features = Feature.objects.filter(feature_type='SFE')

    for entry in features:
        parts = Feature.objects.filter(feature_type='SFP', parent=entry)

        for part in parts:
            xml_data += '\t<url><loc>' + BASE_URL + 'features/' + str(entry.id) + \
                        '/' + str(part.display_order) + '/</loc><changefreq>daily</changefreq><lastmod>' + part.created.strftime("%Y-%m-%d") + '</lastmod></url>\n'

    xml_data += '</urlset>'

    response = HttpResponse(xml_data, content_type='application/xml')
    return response
