# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models
from django.contrib.auth.models import User
from project.game.models import Language


class TranslationLabel(models.Model):
    """
    Translation labels.
    """
    # General
    name = models.CharField(max_length=100, verbose_name="Label name")  #: Label name

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_tranla", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_transla", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Translation Labels'


class TranslationLabelEntry(models.Model):
    """
    Translation labels entries.
    """
    text = models.CharField(max_length=1000, verbose_name="Translated label name")  #: Translation name
    language = models.ForeignKey(Language, verbose_name="Language")

    # Game related
    label = models.ForeignKey(TranslationLabel, verbose_name="Translation label")  #: Translations

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_translaent", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_translaent", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return self.text

    class Meta:
        # Plural name
        verbose_name_plural = 'Translations'
