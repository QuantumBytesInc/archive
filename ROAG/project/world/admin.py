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
from project.world.models import Season, Weather, Location, ResourceTemplate, Resource, ResourceLayer, Terrain, ResourceSpawned
from project.game.models import AmbientSound


class SeasonAdmin(admin.ModelAdmin):
    """
    Season administration class.
    """
    fields = ('name', 'creator')
    readonly_fields = ('creator', 'created', 'editor', 'edited')
    list_display = ('name',)

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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


class WeatherAdmin(admin.ModelAdmin):
    """
    Weather administration class.
    """
    fields = ('name', 'clouds', 'fog', 'rain', 'wind', 'snow', 'active')
    readonly_fields = ('creator', 'created', 'editor', 'edited')
    list_display = ('name','active')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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


def duplicate_location(modeladmin, request, queryset):
    """
    Duplicate AmbientSound.
    :param modeladmin: The model admin
    :param request: The request
    :param queryset: The query
    """
    for entry in queryset:
        e = deepcopy(entry)
        e.id = None
        e.save()
        sounds = AmbientSound.objects.filter(locations=entry)
        for sound in sounds:
            sound.locations.add(e)
            sound.save()
duplicate_location.short_description = "Duplicate Location"


#class MembershipInline(admin.TabularInline):
#    """
#    Inline class for Members in LocationAdmin.
#    """
#    #model = AmbientSound.locations.through


class LocationAdmin(admin.ModelAdmin):
    """
    Location administration class.
    """
    fields = ('id', 'name', 'area', 'terrain', 'logo')
    readonly_fields = ('id', 'creator', 'created', 'editor', 'edited')
    list_display = ('name', 'area', 'id')
    #inlines = (MembershipInline,)
    # Add custom action
    #actions = [duplicate_location,]

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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

class ResourceLayerAdmin(admin.ModelAdmin):
    """
    Location administration class.
    """
    fields = ('id', 'name', 'layer', 'item_result', 'amount')
    readonly_fields = ('id', 'creator', 'created', 'editor', 'edited')
    list_display = ('name', 'item_result', 'amount')
    #inlines = (MembershipInline,)
    # Add custom action
    #actions = [duplicate_location,]

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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


class ResourceLayerInline(admin.TabularInline):
    """
    Inline class for administration.
    """
    model = ResourceLayer  #: Set model to customer
    can_delete = True  #: Does allow deletion

    fields = ('name', 'layer', 'item_result', 'amount', 'surface')
    list_display = ('name', 'layer', 'surface')
    #list_filter = ('feature_type',)

    extra = 0  #: I have no idea
    title = 'Layers'  #: The title


class ResourceTemplateAdmin(admin.ModelAdmin):
    """
    Location administration class.
    """
    fields = ('id', 'name', 'node')
    readonly_fields = ('id', 'creator', 'created', 'editor', 'edited')
    list_display = ('name', 'node')
    #inlines = (MembershipInline,)
    # Add custom action
    #actions = [duplicate_location,]
    inlines = (ResourceLayerInline,)

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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


class ResourceAdmin(admin.ModelAdmin):
    """
    Location administration class.
    """
    fields = ('id', 'template', 'amount', 'image')
    readonly_fields = ('id', 'creator', 'created', 'editor', 'edited')
    list_display = ('template', 'amount')
    #inlines = (MembershipInline,)
    # Add custom action
    #actions = [duplicate_location,]

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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


class ResourceInline(admin.TabularInline):
    """
    Inline class for administration.
    """
    model = Resource  #: Set model to customer
    can_delete = True  #: Does allow deletion

    fields = ('template', 'amount', 'image')
    list_display = ('template', 'image',)
    #list_filter = ('feature_type',)

    extra = 0  #: I have no idea
    title = 'Resources'  #: The title


class TerrainAdmin(admin.ModelAdmin):
    """
    Location administration class.
    """
    fields = ('id', 'name', 'offset_x', 'offset_y')
    readonly_fields = ('id', 'creator', 'created', 'editor', 'edited')
    list_display = ('name',)
    #inlines = (MembershipInline,)
    # Add custom action
    #actions = [duplicate_location,]

    inlines = (ResourceInline,)

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Check if changed or created
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


class ResourceSpawnedAdmin(admin.ModelAdmin):
    """
    Location administration class.
    """
    fields = ('master', 'terrain', 'x', 'y', 'deleted', 'layers')
    readonly_fields = ('id',)
    list_display = ('master', 'terrain')
    filter_horizontal = ('layers', )

# Register admin sites
admin.site.register(Season, SeasonAdmin)
admin.site.register(Weather, WeatherAdmin)
admin.site.register(Location, LocationAdmin)
admin.site.register(ResourceLayer, ResourceLayerAdmin)
admin.site.register(ResourceTemplate, ResourceTemplateAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(Terrain, TerrainAdmin)
admin.site.register(ResourceSpawned, ResourceSpawnedAdmin)
