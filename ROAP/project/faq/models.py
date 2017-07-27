# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.db import models
from django.contrib.auth.models import User


class FAQEntry(models.Model):
    """
    FAQ topics for faq topics arrangement.
    """

    # Possible categories
    FAQ_CATEGORIES = (
        ("ROA", "Relics of Annorath"),
        ("ACC", "Account"),
        ("TRO", "Troubleshooting"),
        ("HAR", "Hardware"),
        ("OSS", "OpenSource"),
        ("NET", "Network"),
        ("ERR", "Error Codes"),
        ("CON", "Contact us"),
        ("VAR", "Various us "),
    )   #: FAQ categories

    # Title and text of the entry
    title = models.CharField(verbose_name="Title",
                             unique=True,
                             help_text="Please enter the title for the FAQ entry",
                             max_length=50)   #: FAQ entry title
    text = models.TextField(verbose_name="Text",
                            unique=True,
                            help_text="Please enter the text for the FAQ entry")  #: Faq entry text

    # Category
    category = models.CharField(max_length=3,
                                choices=FAQ_CATEGORIES)   #: FAQ category

    # Auditing
    creator = models.ForeignKey(User,
                                related_name='+',
                                verbose_name="Creator",
                                editable=False)     #: Creator
    created = models.DateTimeField(blank=True,
                                   editable=False,
                                   null=True)    #: Created date

    editor = models.ForeignKey(User,
                               related_name='+',
                               verbose_name="Editor",
                               editable=False)   #: Last editor
    updated = models.DateTimeField(editable=False,
                                   null=True)  #: Last edit date

    class Meta:
        # Plural name
        verbose_name_plural = 'FAQ Entries'
