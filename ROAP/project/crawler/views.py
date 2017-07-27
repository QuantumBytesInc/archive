# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Python imports

# Django imports
from project.faq import views as faq_views
from project.news import views as news_views
from project.features import views as features_views
from django.utils.html import strip_tags


# Logging
import logging

log = logging.getLogger(__name__)


def home(crawler_context):
    crawler_context['META_TITLE'] = "Relics of Annorath - Home"
    crawler_context['META_DESCRIPTION'] = "Relics of Annorath - Welcome!"
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']


def news_list(crawler_context):
    crawler_context['META_TITLE'] = "Relics of Annorath - News - List"
    crawler_context['META_OG_DESCRIPTION'] = "Relics of Annorath - News overview"


def news_detail(crawler_context, _id):
    news_data = news_views.crawler_get_entry(_id)
    crawler_context['META_TITLE'] = "Relics of Annorath - News - " + news_data['TITLE']
    crawler_context['CONTENT_TITLE'] = news_data['TITLE']
    crawler_context['CONTENT_BODY'] = news_data['SHORT_TEXT']
    crawler_context['META_OG_TITLE'] = strip_tags(news_data['TITLE'])
    crawler_context['META_DESCRIPTION'] = strip_tags(news_data['SHORT_TEXT'])
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']


def feature_list(crawler_context):
    crawler_context['META_TITLE'] = "Relics of Annorath - Feature - List"
    crawler_context['META_DESCRIPTION'] = "Relics of Annorath - Feature lists"
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']


def feature_detail(crawler_context, _feature_id, _part_id):
    feature_data = features_views.crawler_get_feature(_feature_id, _part_id)
    crawler_context['META_TITLE'] = "Relics of Annorath - Feature - Detail - " + str(feature_data['PART_TITLE'])
    crawler_context['META_IMAGE'] = feature_data['IMAGE']
    crawler_context['CONTENT_TITLE'] = feature_data['PART_TITLE']
    crawler_context['CONTENT_BODY'] = feature_data['PART_TEXT']
    crawler_context['META_OG_TITLE'] = strip_tags(feature_data['PART_TITLE'])
    crawler_context['META_OG_DESCRIPTION'] = strip_tags(feature_data['PART_TEXT'])


def faq_list(crawler_context):
    crawler_context['META_TITLE'] = "Relics of Annorath - FAQ - List"
    crawler_context['META_DESCRIPTION'] = "Relics of Annorath - Faq lists"
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']


def faq_detail(crawler_context, _faq_id):
    faq_data = faq_views.crawler_get_faq(_faq_id)
    crawler_context['META_TITLE'] = "Relics of Annorath - Faq - Detail - " + str(faq_data['TITLE'])
    crawler_context['CONTENT_TITLE'] = str(faq_data['TITLE'])
    crawler_context['CONTENT_BODY'] = str(faq_data['TEXT'])
    crawler_context['META_OG_TITLE'] = strip_tags(faq_data['TITLE'])
    crawler_context['META_DESCRIPTION'] = strip_tags(str(faq_data['TEXT']))
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']


def support(crawler_context):
    crawler_context['META_TITLE'] = "Relics of Annorath - Support"
    crawler_context['META_DESCRIPTION'] = "Relics of Annorath - Support - How can we help you?"
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']


def register(crawler_context):
    crawler_context['META_TITLE'] = "Relics of Annorath - Register"
    crawler_context['META_DESCRIPTION'] = "Relics of Annorath - Register - Signup on our game"
    crawler_context['META_OG_DESCRIPTION'] = crawler_context['META_DESCRIPTION']
