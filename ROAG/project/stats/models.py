# Copyright (C) 2015 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models

# Model imports
from project.account.models import Character
from django.contrib.auth.models import User


class UserLogin(models.Model):
    """
    Stats class for login.
    """
    date = models.DateTimeField(verbose_name='Login date', null=False, editable=False)  #: The login date
    user = models.ForeignKey(User, verbose_name="User", editable=False, null=False)  #: The user id

    class Meta:
        # Plural name
        verbose_name_plural = 'User logins'


class CharacterJoin(models.Model):
    """
    Stats class for join.
    """
    date = models.DateTimeField(verbose_name='Login date', null=False, editable=False)  #: The join date
    character = models.ForeignKey(Character, verbose_name="Character", editable=False, null=False)  #: The character

    class Meta:
        # Plural name
        verbose_name_plural = 'Character joins'


class CharacterCreate(models.Model):
    """
    Stats class for character creates.
    """
    date = models.DateTimeField(verbose_name='Create date', null=False, editable=False)  #: The create date
    character = models.ForeignKey(Character, verbose_name='Character', editable=False, null=False)  #: The user id

    class Meta:
        # Plural name
        verbose_name_plural = 'Character creates'


class ChatMessage(models.Model):
    """
    Stats class for chat messages.
    """
    date = models.DateTimeField(verbose_name='Send date', null=False, editable=False)  #: The date
    message = models.TextField(verbose_name='Message', editable=False, null=False)  #: The message
    character = models.ForeignKey(Character, verbose_name="Character", editable=False, null=False)  #: The character

    class Meta:
        # Plural name
        verbose_name_plural = 'Messages sent'


class PlayDuration(models.Model):
    """
    Stats class for play duration per session.
    """
    character = models.ForeignKey(Character,verbose_name='Character', editable=False, null=False)  #: The character id
    duration = models.IntegerField(verbose_name='Duration', editable=False, null=True)  #: The duration
    join = models.ForeignKey(CharacterJoin, verbose_name='Join object', editable=False, null=False)

    class Meta:
        # Plural name
        verbose_name_plural = 'Play durations'


class LauncherDownload(models.Model):
    """
    Stats class for launcher downloads.
    """
    user = models.ForeignKey(User, verbose_name="User", editable=False, null=False)  #: The user id
    date = models.DateTimeField(verbose_name='Send date', null=False, editable=False)  #: The date
    release = models.TextField(verbose_name='Release', null=False, editable=False)

    class Meta:
        # Plural name
        verbose_name_plural = 'Launcher downloads'