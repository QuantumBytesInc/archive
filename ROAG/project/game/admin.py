# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib import admin

# Python imports
from datetime import datetime
from copy import deepcopy

# Model imports
from project.game.models import AmbientSound, AmbientSoundGroup, Time, Language


def duplicate_sound(modeladmin, request, queryset):
    """
    Create a duplicate of a AmbientSound
    :param modeladmin: The modeladmin
    :param request: The request
    :param queryset: The queryset
    """
    for entry in queryset:
        # Deepcopy object
        e = deepcopy(entry)

        # Set id to None and save
        e.id = None
        e.save()

        # Copy all relations
        e.seasons.add(*entry.seasons.all())
        e.weathers.add(*entry.weathers.all())
        e.locations.add(*entry.locations.all())

        # Create time entries
        times = Time.objects.filter(sound=entry.id)
        for time in times:
            t = deepcopy(time)
            t.id = None
            t.sound = e
            t.save()
duplicate_sound.short_description = "Duplicate AmbientSound"


class TimeInline(admin.TabularInline):
    """
    Inline class for administration.
    """
    model = Time  #: Set model to customer
    can_delete = True  #: Does allow deletion

    fields = ('time_start', 'time_end',)
    list_display = ('time_start', 'time_end',)
    list_filter = ('feature_type',)

    extra = 0  #: I have no idea
    title = 'Times'  #: The title


class AmbientSoundGroupAdmin(admin.ModelAdmin):
    """
    AmbientSound administration form.
    """
    fields = ('name', 'description','sounds', 'creator', 'created', 'editor', 'edited',)
    readonly_fields = ('creator', 'created', 'editor', 'edited',)
    list_display = ('name', 'description',)

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
            obj.edited = datetime.now()
        else:
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        # Save object
        obj.save()


class AmbientSoundAdmin(admin.ModelAdmin):
    """
    AmbientSound administration form.
    """
    fields = ('name', 'description','fading', 'locations','seasons', 'weathers', 'creator', 'created', 'editor', 'edited',)
    readonly_fields = ('creator', 'created', 'editor', 'edited',)
    list_display = ('name', 'id',)

    # Set inlines
    inlines = (TimeInline,)

    # Add custom action
    actions = [duplicate_sound, ]

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            instance.creator = request.user
            instance.created = datetime.now()
            instance.editor = request.user
            instance.edited = datetime.now()
            instance.save()
            instance.save()
        formset.save_m2m()

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
            obj.edited = datetime.now()
        else:
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        # Save object
        obj.save()


class TimeAdmin(admin.ModelAdmin):
    """
    Time administration form.
    """
    fields = ('time_start', 'time_end', 'sound', 'creator', 'created', 'editor', 'edited',)
    readonly_fields = ('creator', 'created', 'editor', 'edited',)
    list_display = ('time_start', 'time_end', 'id',)

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
            obj.edited = datetime.now()
        else:
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        # Save object
        obj.save()


class LanguageAdmin(admin.ModelAdmin):
    """
    Language administration form.
    """
    fields = ('name', 'creator', 'created', 'editor', 'edited',)
    readonly_fields = ('creator', 'created', 'editor', 'edited',)
    list_display = ('name',)

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
            obj.edited = datetime.now()
        else:
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        # Save object
        obj.save()

# Register admin sites
admin.site.register(AmbientSound, AmbientSoundAdmin)
admin.site.register(AmbientSoundGroup, AmbientSoundGroupAdmin)
admin.site.register(Time, TimeAdmin)
admin.site.register(Language, LanguageAdmin)
