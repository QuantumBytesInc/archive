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
from project.account.models import Character, Setting, Control, SettingProfile


class CharacterAdminForm(forms.ModelForm):
    """
    Character administration form.
    """
    class Meta:
        model = Character
        exclude = []

    owner = forms.ChoiceField()  #: Overwrite choices for user object

    def __init__(self, *args, **kwargs):
        """
        Overwrite of init for filling-in user choices.
        :param args: Args
        :param kwargs: Kwargs
        """
        super(CharacterAdminForm, self).__init__(*args, **kwargs)

        # Get all users and create choices
        users_all = User.objects.all()
        users_all = users_all.order_by('id')
        available_choices = [(e.id, e.username) for e in users_all]

        # Set choices and user
        self.fields['owner'].choices = available_choices

        try:
            self.fields['owner'].initial = self.instance.user.id
        except:
            pass


class CharacterAdmin(admin.ModelAdmin):
    """
    Character administration class.
    """
    fields = ('name_first', 'name_last', 'location', 'position', 'owner', 'deleted', 'is_spawned','creator', 'created', 'editor', 'edited')
    readonly_fields = ('creator', 'created', 'editor', 'edited', 'is_spawned')
    list_display = ('name_first', 'name_last', 'user')

    form = CharacterAdminForm  #: Add custom form

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        # Set owner and save
        """
        obj.user = User.objects.get(id=form.cleaned_data['owner'])

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class SettingAdminForm(forms.ModelForm):
    """
    Character administration form.
    """
    class Meta:
        model = Setting
        exclude = []

    owner = forms.ChoiceField()  #: Overwrite choices for user object
    profile_temp = forms.ChoiceField()

    def __init__(self, *args, **kwargs):
        """
        Overwrite of init for filling-in user choices.
        :param args: Args
        :param kwargs: Kwargs
        """
        super(SettingAdminForm, self).__init__(*args, **kwargs)

        # Get all users and create choices
        users_all = User.objects.all()
        users_all = users_all.order_by('id')
        available_choices = [(e.id, e.username) for e in users_all]

        profiles_all = SettingProfile.objects.all()
        profiles_all = profiles_all.order_by('id')
        available_choices_profile = [(e.id, e.name) for e in profiles_all]

        # Set choices and user
        self.fields['owner'].choices = available_choices

        try:
            self.fields['owner'].initial = self.instance.user.id
        except:
            pass

        self.fields['profile_temp'].choices = available_choices_profile

        try:
            self.fields['profile_temp'].initial = profile
        except:
            pass


class ControlAdminForm(forms.ModelForm):
    """
    Character administration form.
    """
    class Meta:
        model = Setting
        exclude = []

    owner = forms.ChoiceField()  #: Overwrite choices for user object

    def __init__(self, *args, **kwargs):
        """
        Overwrite of init for filling-in user choices.
        :param args: Args
        :param kwargs: Kwargs
        """
        super(ControlAdminForm, self).__init__(*args, **kwargs)

        # Get all users and create choices
        users_all = User.objects.all()
        users_all = users_all.order_by('id')
        available_choices = [(e.id, e.username) for e in users_all]

        # Set choices and user
        self.fields['owner'].choices = available_choices

        try:
            self.fields['owner'].initial = self.instance.user.id
        except:
            pass


class ControlAdmin(admin.ModelAdmin):
    """
    Control administration class.
    """
    fields = ('owner', 'function', 'key', 'creator', 'created', 'editor', 'edited')
    readonly_fields = ('creator', 'created', 'editor', 'edited')
    list_display = ('function',)

    form = ControlAdminForm  #: Add custom form

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """

        obj.user = User.objects.get(id=form.cleaned_data['owner'])

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class SettingAdmin(admin.ModelAdmin):
    """
    Setting administration class.
    """
    fields = (
        'owner',
        'profileName',
        'resolution',
        'distance',
        'gamma',
        'fullscreen',
        'vsync',
        'reflection',
        'parallax',
        'motionBlur',
        'refraction',
        'volumetric',
        'filter',
        'occlusion',
        'shader',
        'texture',
        'anisotropy',
        'multisample',
        'sfx',
        'profile_temp',
        'master',
        'ambient',
        'music',
        'voice',
        'character',
        'effects',
        'controls',
        'language',
        'creator',
        'created',
        'editor',
        'edited',
    )

    readonly_fields = ('creator', 'created', 'editor', 'edited')
    list_display = ('profileName',)

    form = SettingAdminForm  #: Add custom form

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Set owner and save
        obj.user = User.objects.get(id=form.cleaned_data['owner'])
        obj.profile = form.cleaned_data['profile_temp']

        if change:
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)
        else:
            obj.creator = request.user
            obj.created = datetime.utcnow().replace(tzinfo=utc)
            obj.editor = request.user
            obj.edited = datetime.utcnow().replace(tzinfo=utc)

        obj.save()


class SettingProfileAdmin(admin.ModelAdmin):
    """
    SettingProfile administration class.
    """
    fields = ('name', 'setting', 'creator', 'created', 'editor', 'edited')
    readonly_fields = ('creator', 'created', 'editor', 'edited')

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

# Register admin sites
admin.site.register(Character, CharacterAdmin)
admin.site.register(Control, ControlAdmin)
admin.site.register(Setting, SettingAdmin)
admin.site.register(SettingProfile, SettingProfileAdmin)
