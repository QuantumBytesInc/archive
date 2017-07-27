# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models
from django.contrib.auth.models import User
from project.account.models import Character
import uuid


def get_uuid():
    return uuid.uuid4().hex


class Channel(models.Model):
    """
    Channel class for websocket chatting.
    """
    uuid = models.CharField(
        max_length=32,
        verbose_name='Internal channel id',
        editable=False,
        null=False,
        default=get_uuid
    )  #: The channel id

    name = models.CharField(
        max_length=32,
        verbose_name='Channel name',
        editable=True,
        null=False
    )  #: The channel name

    motd = models.CharField(max_length=512, verbose_name="Message of the day")

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_chan", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_chan", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Channels'


class Right(models.Model):
    """
    Right class for access management.
    """
    name = models.CharField(max_length=32, verbose_name='Name', editable=True, null=False)  #: Right name

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_right", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_right", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Access Rights'


class ChannelRight(models.Model):
    """
    Channel right class for setting access.
    """
    character = models.ForeignKey(Character, verbose_name="Character with permission")  #: The character
    rights = models.ManyToManyField(
        Right,
        verbose_name='Access Rights',
        editable=True,
        null=False
    )  #: Channel access rights

    channel = models.ForeignKey(Channel, verbose_name='Channel', editable=True, null=False)  #: The channel

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_chanri", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_chanri", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.channel

    class Meta:
        # Plural name
        verbose_name_plural = 'Channel Rights'


class Message(models.Model):
    """
    Message class for saving in-game messages.
    """
    # Relations to users
    sender = models.ForeignKey(Character, verbose_name='Sent by', null=False, related_name='sender')  #: The sender
    receiver = models.ForeignKey(Character,
                                 verbose_name='Received by', null=False, related_name='receiver')  #: The receiver

    # Information
    date = models.DateTimeField(
        verbose_name='Date received/sent',
        null=False,
        editable=False
    )  #: Date when message was received/sent

    answered = models.BooleanField(verbose_name='Answered', null=False, default=False)  #: Token if message was answered
    read = models.BooleanField(verbose_name='Read', null=False, default=False)  #: Token if message was read

    # Data
    subject = models.CharField(max_length=32, verbose_name='Subject', null=False)  #: The message subject
    text = models.TextField(max_length=2048, verbose_name='Text', null=False)  #: The message text

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_mess", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_mess", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)


class Event(models.Model):
    """
    Event class for saving in-game events (appointments).
    """
    TYPE_CHOICES = (
        (1, 'Private'),
        (2, 'Guild'),
        (3, 'Global'),
    )

    # Relations
    character = models.ForeignKey(Character, verbose_name="Character")  #: Character
    type = models.IntegerField(choices=TYPE_CHOICES, null=False)  #: Type of event

    # Data
    date = models.DateTimeField(verbose_name='Date', null=False)  #: Date when the event will happen
    subject = models.CharField(max_length=32, verbose_name='Subject', null=False)  #: The subject
    text = models.CharField(max_length=512, verbose_name='Text', null=False)  #: The text

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_evt", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_evt", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)


class Notification(models.Model):
    """
    Notification class for saving in-game notifications.
    """
    TYPE_CHOICES = (
        (1, 'Information'),
        (2, 'Important'),
    )

    # Relations
    character = models.ForeignKey(Character, verbose_name="Character")  #: Character
    type = models.IntegerField(choices=TYPE_CHOICES, null=False)  #: Type of notification

    # Data
    date = models.DateTimeField(verbose_name='Date', null=False)  #: Date when the information was sent
    subject = models.CharField(max_length=32, verbose_name='Subject', null=False)  #: The subject
    text = models.CharField(max_length=512, verbose_name='Text', null=False)  #: The text

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_not", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_not", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)


class UserList(models.Model):
    """
    List with all users currently connected to a channel
    """
    channel = models.ForeignKey(Channel, verbose_name='Channel', editable=True, null=False)  #: The channel
    character = models.ForeignKey(Character, verbose_name="Character")  #: Connected character


class HeartBeat(models.Model):
    """
    Heartbeat control for checking of a client lost connection.
    """
    last_seen = models.DateTimeField(verbose_name="Last seen", editable=False, null=True)
    character = models.ForeignKey(Character, verbose_name="Character")  #: Character
