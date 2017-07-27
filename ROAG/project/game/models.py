# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models
from django.contrib.auth.models import User

# Model imports
from project.world.models import Season, Location, Weather


class AmbientSound(models.Model):
    """
    AmbientSound for sound management.
    """
    name = models.CharField(max_length=50)  #: AmbientSound namei
    description = models.CharField(max_length=80)
    fading = models.FloatField(max_length=100.0, verbose_name="Fading in seconds")  #: Fading in seconds

    # Relations
    seasons = models.ManyToManyField(Season)  #: Active in these seasons
    locations = models.ManyToManyField(Location)  #: Active in these locations
    weathers = models.ManyToManyField(Weather)  #: Active in these weathers

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_amso", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_amso", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Ambient Sounds'


class AmbientSoundGroup(models.Model):
    """
    AmbientSound for sound management.
    """
    name = models.CharField(max_length=50)  #: AmbientSound namei
    description = models.CharField(max_length=80)

    # Relations
    sounds = models.ManyToManyField(AmbientSound)  #: Active in these weathers

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_amsogr", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_amsogr", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Ambient Sound Groups'


class Time(models.Model):
    """
    Time for AmbientSound class.
    """
    time_start = models.TimeField(verbose_name='Start time')  #: The starting time
    time_end = models.TimeField(verbose_name='End time')  #: The ending time
    sound = models.ForeignKey(AmbientSound, verbose_name='AmbientSound entry')  #: The AmbientSound entry

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_time", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_time", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s - %s' % (self.time_start, self.time_end)

    class Meta:
        # Plural name
        verbose_name_plural = 'Times'


class Language(models.Model):
    """
    Language for settings option.
    """
    name = models.CharField(verbose_name="Language name", max_length=32)  #: Language name

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_lang", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_lang", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Languages'
