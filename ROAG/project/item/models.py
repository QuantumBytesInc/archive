# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
import os
from django.db import models
from django.contrib.auth.models import User
from django.utils.deconstruct import deconstructible

# Model imports
from project.account.models import Character


@deconstructible
class UploadToPathAndRename(object):

    def __init__(self, path):
        self.sub_path = path

    def __call__(self, instance, filename):
        filename = filename.split('/')[-1]
        return os.path.join(self.sub_path, filename)


class ItemTemplate(models.Model):
    """
    Item for everything in-game that is an item.
    """
    TYPE_CHOICES = (
        (0, 'Resource'),
        (1, 'Storage'),
        (2, 'Weapon'),
        (3, 'Tool'),
        (3, 'Static (World)'),
    )

    # General
    name = models.CharField(max_length=15, verbose_name="Item name")  #: First name
    height = models.IntegerField(verbose_name="Height", default=0)
    width = models.IntegerField(verbose_name="Width", default=0)
    weight = models.FloatField(verbose_name="Weight", default=0)
    comment = models.TextField(verbose_name="Comment", null=True)
    node_name = models.TextField(verbose_name="Node name", null=True)
    stack_size = models.IntegerField(null=True, verbose_name='Max. stack size')
    is_stackable = models.BooleanField(verbose_name='Can be stacked', default=False)

    # Pictures
    icon = models.ImageField(default="None", upload_to=UploadToPathAndRename("images/item/template"))
    icon_taskbar = models.ImageField(default="None", upload_to=UploadToPathAndRename("images/item/template"))

    # Additional attributes

    # Game related
    type = models.IntegerField(
        choices=TYPE_CHOICES,
        verbose_name="The item type",
        null=False,
        editable=True
    )

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_itemp", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_itemp", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s (%s)' % (self.name, self.id)

    class Meta:
        # Plural name
        verbose_name_plural = 'Item Templates'


class Item(models.Model):
    # General
    master = models.ForeignKey(ItemTemplate, verbose_name="Master template")
    name = models.CharField(max_length=15, verbose_name="Item name")  #: First name
    height = models.IntegerField(verbose_name="Height", default=0)
    width = models.IntegerField(verbose_name="Width", default=0)
    weight = models.FloatField(verbose_name="Weight", default=0)

    # Additional attributes

    # Game related
    is_static = models.BooleanField(verbose_name="Game is owner of this item",
                                    editable=True, null=False, default=False)

    is_stored = models.BooleanField(verbose_name="Item is in storage",
                                    editable=True, null=False, default=False)

    # Related character
    character = models.ForeignKey(Character, verbose_name="Character", null=True, related_name='item_character', blank=True)  #: The related user who owns the item

    # State
    deleted = models.BooleanField(verbose_name="Deleted", default=False)

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_item", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_item", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s/%s' % (self.name, self.id)

    class Meta:
        # Plural name
        verbose_name_plural = 'Items'


class StorageTemplate(models.Model):
    """
    Item for everything in-game that is an item.
    """
    # General
    name = models.CharField(max_length=15, verbose_name="Name")  #: First name
    height = models.IntegerField(verbose_name="Max. Height", default=0)
    width = models.IntegerField(verbose_name="Max. Width", default=0)
    weight = models.IntegerField(verbose_name="Max. weight", default=0)
    comment = models.TextField(verbose_name="Comment", null=True)
    page_size = models.IntegerField(verbose_name="Page size allowed", null=True)

    # Additional attributes
    image = models.ImageField(default="None", upload_to=UploadToPathAndRename("images/storage/template"))
    start_x = models.FloatField(default=0.0, verbose_name='x offset')
    start_y = models.FloatField(default=0.0, verbose_name='y offset')

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_stotem", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_stotem", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Storage Templates'


class Storage(models.Model):
    """
    Item for everything in-game that is an item.
    """
    # General
    master = models.ForeignKey(StorageTemplate, verbose_name="Master template", null=True)
    item = models.ForeignKey(Item, verbose_name="Item (Storage)")     #: The related item (the storage one)

    weight = models.IntegerField(verbose_name="Max. weight", default=0)
    is_bank = models.BooleanField(verbose_name="Is bank? (unlimited)", default=False)
    is_equipped = models.BooleanField(verbose_name="Is equipped?", default=False)

    character = models.ForeignKey(Character, verbose_name='Owning character', null=True)
    comment = models.TextField(verbose_name="Comment", null=True, blank=True)
    page_size = models.IntegerField(verbose_name="Page size allowed", null=False, default=1)

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_stor", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_stor", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.item.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Storage'


class StorageSlot(models.Model):
    """
    Slot for the storage
    """
    # General
    character = models.ForeignKey(Character, verbose_name="Character", related_name='storage_slot_character', null=True)  #: The owner
    item = models.ForeignKey(Item, verbose_name="Item")     #: The related item
    storage = models.ForeignKey(Storage, verbose_name="Storage", default=0)     #: The related storage
    slot_is_stacked = models.BooleanField(verbose_name="Stacked slot", default=False)
    slot_id = models.IntegerField(verbose_name="Slot id", default=0)
    page = models.IntegerField(verbose_name="Page", null=True)
