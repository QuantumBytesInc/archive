# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.conf import settings
from django.contrib import admin
from django.forms import ModelForm
from django.contrib.admin import SimpleListFilter
from django.utils.translation import ugettext_lazy as _

# Python includes
from datetime import datetime

# Project includes
from project.features.models import Feature, SubFeature, SubFeaturePart, FeatureTranslation
from languages_plus.models import Language


# Logging
import logging
log = logging.getLogger('portal')    #: System logger


class FeatureTranslationForm(ModelForm):
    """Simple form for translation inline
    """
    def clean_language(self):
        data = self.cleaned_data['language']
        data = Language.objects.get(id=data)
        return data


class TranslationInline(admin.StackedInline):
    model = FeatureTranslation
    form = FeatureTranslationForm

    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    fields = ('title', 'text', 'language')  #: Field to display

    extra = 0


class FeatureInline(admin.TabularInline):
    """Inline class for administration
    """
    model = Feature    #: Set model to customer
    can_delete = False  #: Does not allow deletion

    fields = ('title', 'picture', 'display_order', 'display_adjustment',
              'feature_type', 'parent', 'updated')  #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    list_display = ('title', 'picture', 'display_order', 'display_adjustment',
                    'feature_type', 'parent', 'updated')    #: Fields to display
    list_filter = ('feature_type',)    #: Filter

    extra = 0

    title = 'Sub features'

    def queryset(self, request):
        return super(FeatureInline, self).queryset(request).filter(feature_type='SFE')


class FeatureAdmin(admin.ModelAdmin):
    """Admin form class for feature management
    """
    # Configure fields
    fields = ('title', 'picture', 'display_order', 'display_adjustment',
              'feature_type', 'parent', 'updated')  #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    list_display = ('title', 'picture', 'display_order', 'display_adjustment',
                    'feature_type', 'parent', 'updated')    #: Fields to display
    search_fields = ('title',)

    # Set inlines
    inlines = (FeatureInline, TranslationInline)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        for instance in instances:
            instance.creator = request.user
            instance.editor = request.user
            instance.created = datetime.now()
            instance.save()

        formset.save_m2m()

    def save_model(self, request, obj, form, change):
        # Check if changed or created
        if change:
            obj.editor = request.user
            obj.updated = datetime.now()
        else:
            obj.creator = request.user
            obj.editor = request.user
            obj.created = datetime.now()

        # Save object
        obj.save()

    def queryset(self, request):
        return super(FeatureAdmin, self).queryset(request).filter(feature_type='FEA')


class SubFeatureInline(admin.TabularInline):
    """Inline class for administration
    """
    model = Feature    #: Set model to customer
    can_delete = False  #: Does not allow deletion

    fields = ('title', 'picture', 'display_order', 'display_adjustment',
              'feature_type', 'parent', 'updated')  #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    list_display = ('title', 'picture', 'display_order', 'display_adjustment',
                    'feature_type', 'parent', 'updated')    #: Fields to display

    extra = 0

    title = 'Sub features'

    def queryset(self, request):
        return super(SubFeatureInline, self).queryset(request).filter(feature_type='SFP')


class SubFeatureParentFilter(SimpleListFilter):
    """Custom filter for administration (Activated)
    """
    title = _('Parent')      #: The title
    parameter_name = 'Parent'    #: The parameter name

    def lookups(self, request, model_admin):
        """Get all possible filter values
        :param request: The request
        :param model_admin: The model
        :return: List with possible filter values
        """
        return Feature.objects.filter(feature_type='FEA').values_list('title', 'title').distinct().order_by('title')

    def queryset(self, request, queryset):
        """Get filtered object
        :param request: The request
        :param queryset: The queryset
        :return: List with objects that meets the filter criteria
        """
        # Check for value
        if not self.value():
            return queryset

        # Get objects
        objects = Feature.objects.filter(parent=Feature.objects.filter(title=self.value()))
        features = [p.id for p in objects]

        # Return values
        return queryset.filter(id__in=features)


class SubFeatureAdmin(admin.ModelAdmin):
    """Admin form class for feature management
    """
    # Configure fields
    fields = ('title', 'picture', 'display_order', 'display_adjustment',
              'feature_type', 'parent', 'updated')  #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    list_display = ('title', 'picture', 'display_order', 'display_adjustment',
                    'feature_type', 'parent', 'updated')    #: Fields to display
    list_filter = (SubFeatureParentFilter,)    #: Filter
    search_fields = ('title',)

    # Set inlines
    inlines = (SubFeatureInline, TranslationInline)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        for instance in instances:
            instance.creator = request.user
            instance.editor = request.user
            instance.created = datetime.now()
            instance.save()

        formset.save_m2m()

    def save_model(self, request, obj, form, change):

        # Check if changed or created
        if change:
            obj.editor = request.user
            obj.updated = datetime.now()
        else:
            obj.creator = request.user
            obj.editor = request.user
            obj.created = datetime.now()

        # Save object
        obj.save()

    def queryset(self, request):
        return super(SubFeatureAdmin, self).queryset(request).filter(feature_type='SFE')


class SubFeaturePartParentFilter(SimpleListFilter):
    """Custom filter for administration (Activated)
    """
    title = _('Parent')      #: The title
    parameter_name = 'Parent'    #: The parameter name

    def lookups(self, request, model_admin):
        """Get all possible filter values
        :param request: The request
        :param model_admin: The model
        :return: List with possible filter values
        """
        return Feature.objects.filter(feature_type='SFE').values_list('title', 'title').distinct().order_by('title')

    def queryset(self, request, queryset):
        """Get filtered object
        :param request: The request
        :param queryset: The queryset
        :return: List with objects that meets the filter criteria
        """
        # Check for value
        if not self.value():
            return queryset

        # Get objects
        objects = Feature.objects.filter(parent=Feature.objects.filter(title=self.value()))
        features = [p.id for p in objects]

        # Return values
        return queryset.filter(id__in=features)


class SubFeaturePartAdmin(admin.ModelAdmin):
    """Admin form class for feature management
    """
    # Configure fields
    fields = ('title', 'picture', 'display_order', 'display_adjustment',
              'feature_type', 'parent', 'updated')  #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    list_display = ('title', 'picture', 'display_order', 'display_adjustment',
                    'feature_type', 'parent', 'updated')    #: Fields to display
    list_filter = (SubFeaturePartParentFilter,)    #: Filter
    search_fields = ('title',)

    # Set inlines
    inlines = (TranslationInline,)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        for instance in instances:
            instance.creator = request.user
            instance.editor = request.user
            instance.created = datetime.now()
            instance.save()

        formset.save_m2m()

    def save_model(self, request, obj, form, change):

        # Check if changed or created
        if change:
            obj.editor = request.user
            obj.updated = datetime.now()
        else:
            obj.creator = request.user
            obj.editor = request.user
            obj.created = datetime.now()

        # Save object
        obj.save()

    def queryset(self, request):
        return super(SubFeaturePartAdmin, self).queryset(request).filter(feature_type='SFP')


class TranslationAdminForm(ModelForm):
    class Meta:
        model = FeatureTranslation
        fields = '__all__'

    def clean_feature(self):
        data = self.cleaned_data['feature']
        data = Feature.objects.get(id=data)
        return data

    def clean_language(self):
        data = self.cleaned_data['language']
        data = Language.objects.get(id=data)
        return data


class TranslationParentFilter(SimpleListFilter):
    """Custom filter for administration (Activated)
    """
    title = _('Parent')      #: The title
    parameter_name = 'Parent'    #: The parameter name

    def lookups(self, request, model_admin):
        """Get all possible filter values
        :param request: The request
        :param model_admin: The model
        :return: List with possible filter values
        """
        return Feature.objects.filter(feature_type='SFE').values_list('id', 'title').distinct().order_by('title')

    def queryset(self, request, queryset):
        """Get filtered object
        :param request: The request
        :param queryset: The queryset
        :return: List with objects that meets the filter criteria
        """
        # Check for value
        if not self.value():
            return queryset

        # First we need to get sub feature
        sub_feature = Feature.objects.get(id=self.value())
        parts = Feature.objects.filter(parent=sub_feature)
        objects = FeatureTranslation.objects.filter(feature__in=parts)
        features = [p.id for p in objects]

        # Return values
        return queryset.filter(id__in=features)


class TranslationAdmin(admin.ModelAdmin):
    """Admin form for FAQ entry management
    """

    form = TranslationAdminForm

    fields = ('title', 'feature', 'language', 'text')      #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields

    list_display = ('title', 'feature', 'language')    #: Fields to display
    search_fields = ('title',)
    list_filter = (TranslationParentFilter, 'language')

    def save_model(self, request, obj, form, change):
        """Overwrite save_model and handle user and date of action

        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Token if entry was created or modified
        """

        # Check if changed or created
        if change:
            obj.editor = request.user
            obj.updated = datetime.now()
        else:
            obj.creator = request.user
            obj.editor = request.user
            obj.created = datetime.now()

        # Save object
        obj.save()

    class Media:
        """Overwriting media class for tiny mce fields
        """
        js = [settings.STATIC_URL+'grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
              settings.STATIC_URL + 'grappelli/tinymce_setup/tinymce_setup.js']


# Register class in backend
admin.site.register(Feature, FeatureAdmin)
admin.site.register(SubFeature, SubFeatureAdmin)
admin.site.register(SubFeaturePart, SubFeaturePartAdmin)
admin.site.register(FeatureTranslation, TranslationAdmin)
