# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib import admin
from django import forms
from django.contrib.auth.models import User
from django.utils.timezone import utc

# Python imports
from datetime import datetime

# Model imports
from project.item.models import ItemTemplate, Item, Storage, StorageSlot, StorageTemplate


class ItemTemplateAdmin(admin.ModelAdmin):
    """
    Control administration class.
    """
    fields = ('id',
              'name',
              'height',
              'width',
              'weight',
              'stack_size',
              'is_stackable',
              'node_name',
              'icon',
              'icon_taskbar',
              'type',
              'comment',
              'creator',
              'created',
              'editor',
              'edited')

    readonly_fields = ('id',
                       'creator',
                       'created',
                       'editor',
                       'edited')

    list_display = ('name',
                    'id')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class ItemAdmin(admin.ModelAdmin):
    """
    Control administration class.
    """
    fields = ('id',
              'master',
              'name',
              'height',
              'width',
              'weight',
              'is_static',
              'is_stored',
              'character',
              'deleted',
              'creator',
              'created',
              'editor',
              'edited')

    readonly_fields = ('id',
                       'creator',
                       'created',
                       'editor',
                       'edited')

    list_display = ('id',
                    'master',
                    'name',
                    'character')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class StorageTemplateAdmin(admin.ModelAdmin):
    """
    Control administration class.
    """
    fields = ('id',
              'name',
              'height',
              'width',
              'weight',
              'page_size',
              'image',
              'start_x',
              'start_y',
              'comment',
              'creator',
              'created',
              'editor',
              'edited')

    readonly_fields = ('id',
                       'creator',
                       'created',
                       'editor',
                       'edited')

    list_display = ('name',
                    'id')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class StorageAdmin(admin.ModelAdmin):
    """
    Control administration class.
    """
    fields = ('id',
              'master',
              'item',
              'weight',
              'is_bank',
              'is_equipped',
              'character',
              'comment',
              'creator',
              'created',
              'editor',
              'edited')

    readonly_fields = ('id',
                       'creator',
                       'created',
                       'editor',
                       'edited')

    list_display = ('id',
                    'master',
                    'item')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class StorageSlotAdmin(admin.ModelAdmin):
    """
    Control administration class.
    """
    fields = ('id',
              'character',
              'item',
              'storage',
              'slot_is_stacked',
              'slot_id')

    readonly_fields = ('id', )

    list_display = ('id',
                    'character',
                    'item')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        if change:
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


# Register admin sites
admin.site.register(ItemTemplate, ItemTemplateAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(StorageTemplate, StorageTemplateAdmin)
admin.site.register(Storage, StorageAdmin)
admin.site.register(StorageSlot, StorageSlotAdmin)
