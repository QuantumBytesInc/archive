# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.db import models
from django.contrib.auth.models import User


class Entry(models.Model):
    """News entry class
    """
    NEWS_CATEGORIES = (
        ("REL", "Release"),
        ("INF", "Information"),
        ("GEN", "General"),
        ("SUP", "Support"),
        ("SOM", "Social Media"),
        ("OTH", "Others"),
    )   #: Possible news categories

    # General
    title = models.CharField(max_length=200, verbose_name="Title")  #: News title
    short_text = models.TextField(max_length=200, verbose_name="Short text")    #: News short text
    text = models.TextField(verbose_name="Text")  #: News text
    published = models.BooleanField()   #: Published state

    # Category
    category = models.CharField(max_length=3, choices=NEWS_CATEGORIES)  #: News category

    # Auditing
    creator = models.ForeignKey(User, related_name='+', verbose_name="Creator", editable=False)
    created = models.DateTimeField(blank=True, editable=False, null=True)

    editor = models.ForeignKey(User, related_name='+', verbose_name="Editor", editable=False)
    updated = models.DateTimeField(editable=False, null=True)

    class Meta:
        # Plural name
        verbose_name_plural = 'Entries'
