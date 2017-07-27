# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import os

# Django imports
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.models import User
from django.utils.deconstruct import deconstructible


@deconstructible
class UploadToPathAndRename(object):

    def __init__(self, path):
        self.sub_path = path

    def __call__(self, instance, filename):
        filename = filename.split('/')[-1]
        return os.path.join(self.sub_path, filename)


class Location(models.Model):
    """
    Location class for in-game location handling.
    """
    name = models.CharField(max_length=50, verbose_name="Location name")  #: Location name
    area = models.CharField(max_length=50, verbose_name="Area name")  #: Area name
    logo = models.ImageField(default="None", upload_to=UploadToPathAndRename("images/location"), verbose_name="Location logo")
    terrain = models.ForeignKey('world.Terrain', verbose_name="Terrain")

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_loc", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_loc", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Locations'


class Season(models.Model):
    """
    Season class for different other classes.
    """
    name = models.CharField(max_length=20)  #: Season name

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_seas", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_seas", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Seasons'


class Weather(models.Model):
    """
    Weather class for different other classes.
    """
    CLOUD_CHOICES = (
        (0, 'Disabled'),
        (1, 'Low'),
        (2, 'Mid'),
        (3, 'Height'),
    )

    FOG_CHOICES = (
        (0, 'Disabled'),
        (1, 'Low'),
        (2, 'Mid'),
        (3, 'Strong'),
    )

    RAIN_CHOICES = (
        (0, 'Disabled'),
        (1, 'Low'),
        (2, 'Mid'),
        (3, 'Strong'),
    )

    SNOW_CHOICES = (
        (0, 'Disabled'),
        (1, 'Low'),
        (2, 'Mid'),
        (3, 'Strong'),
    )

    WIND_CHOICES = (
        (0, 'Disabled'),
        (1, 'Low'),
        (2, 'Mid'),
        (3, 'Strong'),
    )

    name = models.CharField(max_length=20)  #: Weather name

    clouds = models.IntegerField(verbose_name="Clouds", default=0, choices=CLOUD_CHOICES)
    fog = models.IntegerField(verbose_name="Fog", default=0, choices=FOG_CHOICES)
    rain = models.IntegerField(verbose_name="Rain", default=0, choices=RAIN_CHOICES)
    snow = models.IntegerField(verbose_name="Snow", default=0, choices=SNOW_CHOICES)
    wind = models.IntegerField(verbose_name="Wind", default=0, choices=WIND_CHOICES)
    active = models.BooleanField(verbose_name="Active", default=False)

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_weath", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_weath", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Weathers'


class DateTimeROA(models.Model):
    """
    Class for time management
    """
    year = models.IntegerField(verbose_name="Year")
    month = models.IntegerField(verbose_name="Month")
    day = models.IntegerField(verbose_name="Day")
    seconds = models.IntegerField(verbose_name="Seconds")
    weather_sync = models.DateTimeField(verbose_name="Last sync", blank=True, null=True)
    last_sync = models.DateTimeField(verbose_name="Last synced", editable=False, null=False)


class ResourceLayer(models.Model):
    """
    Resource layer
    """
    name = models.CharField(verbose_name="Resource layer name", max_length=20)  #: Resource layer name
    layer = models.IntegerField(verbose_name="Layer level", default=0)
    item_result = models.ForeignKey('item.ItemTemplate', verbose_name="Result item")
    amount = models.IntegerField(verbose_name="Max amount", default=0)
    consumed = models.IntegerField(verbose_name="Consumed amount (leave empty))", default=0)
    template = models.BooleanField(verbose_name="Is template", default=False)
    resource = models.ForeignKey('world.ResourceTemplate', verbose_name='ResourceTemplate', null=True)
    surface = models.CharField(verbose_name="Surface name", max_length=100)  #: Resource layer name

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_reslay", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_reslay", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s - %s - %s' % (self.name, self.layer, self.amount)


class ResourceTemplate(models.Model):
    """
    Resource class
    """
    name = models.CharField(verbose_name="Resource template name", max_length=20)  #: Resource name
    node = models.CharField(verbose_name="Resource node path and name", max_length=200)  #: Resource name

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_restemp", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_restemp", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name


class Terrain(models.Model):
    """
    Class for terrain
    """
    name = models.CharField(verbose_name="Terrain name", max_length=20)  #: Terrain name

    offset_x = models.IntegerField(verbose_name="Offset x to world", default=0)
    offset_y = models.IntegerField(verbose_name="Offset y to world", default=0)

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_ter", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_ter", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name


class Resource(models.Model):
    """
    Resource class for terrain integration
    """
    template = models.ForeignKey(ResourceTemplate, verbose_name="Resource template")
    amount = models.IntegerField(verbose_name="Max spawn of this resource")
    image = models.ImageField(default="None",
                              upload_to=UploadToPathAndRename("images/resouce"),
                              verbose_name="Spawn map")

    terrain = models.ForeignKey(Terrain, null=True, blank=True)

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_res", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_res", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.template.name


class ResourceSpawned(models.Model):
    """
    Spawned resources in the world.
    """
    x = models.IntegerField(verbose_name="X coordinate", default=0)
    y = models.IntegerField(verbose_name="Y coordinate", default=0)

    deleted = models.BooleanField(verbose_name="Is resource deleted?", default=False)

    master = models.ForeignKey(ResourceTemplate, verbose_name="Resource template")
    terrain = models.ForeignKey(Terrain, verbose_name="Terrain")

    layers = models.ManyToManyField(ResourceLayer)
