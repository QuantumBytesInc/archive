# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Django imports

# Python imports

# Project imports
from project.settings.base import STATIC_URL, BASE_URL
from project.crawler import views as crawler_views
# Set logging
import logging
import re

log = logging.getLogger(__name__)


def crawler_actions(request):
    """
    Handles all portal related stuff.
    :param request: The request
    :return: Provided values with new data
    """

    web_url = request.get_full_path()

    meta_title = ""
    meta_description = ""
    meta_type = "article"
    meta_image = str(STATIC_URL) + 'img/bg_burg.jpg'
    content_title = ""
    content_body = ""
    meta_og_description = ""
    meta_og_title = ""

    crawler_context = {"META_TITLE": meta_title, "META_DESCRIPTION": meta_description,
                       "META_URL": str(BASE_URL) + str(web_url), "META_TYPE": meta_type, "META_IMAGE": meta_image,
                       "CONTENT_TITLE": content_title, "CONTENT_BODY": content_body,
                       "META_OG_DESCRIPTION": meta_og_description, "META_OG_TITLE": meta_og_title}

    if web_url == "/" or web_url == "/game/":
        crawler_views.home(crawler_context)
    elif web_url.find("/news/") == 0:
        p = re.compile("([0-9]+)")
        m = p.search(web_url)
        if m:
            crawler_views.news_detail(crawler_context, m.group(0))
        else:
            crawler_views.news_list(crawler_context)

    elif web_url.find("/features/") == 0:
        m = re.findall("([0-9]+)", web_url)
        if len(m) > 1:
            crawler_views.feature_detail(crawler_context, m[0], m[1])
        else:
            crawler_views.feature_list(crawler_context)
    elif web_url.find("/faq/") == 0:
        m = re.findall("([0-9]+)", web_url)
        if len(m) > 0:
            crawler_views.faq_detail(crawler_context, m[0])
        else:
            crawler_views.faq_list(crawler_context)
    elif web_url == "/support/":
        crawler_views.support(crawler_context)
    elif web_url == "/register/":
        crawler_views.register(crawler_context)

    return crawler_context
