# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib import admin
from django import forms
from django.contrib.auth.models import User
from django.utils.timezone import utc
from django.forms import ModelForm
from django.core.files import File

# Python imports
from datetime import datetime

# Model imports
from project.translation.models import TranslationLabel, TranslationLabelEntry
from project.game.models import Language


class FeatureTranslationForm(ModelForm):
    """Simple form for translation inline
    """
    def clean_translation(self):
        data = self.cleaned_data['translation']
        data = TranslationLabelEntry.objects.get(id=data)
        return data


class TranslationInline(admin.StackedInline):
    model = TranslationLabelEntry
    form = FeatureTranslationForm

    readonly_fields = ('creator', 'created', 'editor', 'editor',)  #: Read only fields
    fields = ('text', 'language', 'label')  #: Field to display

    extra = 0


class TranslationLabelAdmin(admin.ModelAdmin):
    """
    SettingProfile administration class.
    """
    fields = ('name', 'creator', 'created', 'editor', 'edited')
    readonly_fields = ('creator', 'created', 'editor', 'edited')

    inlines = (TranslationInline,)

    #actions = (generate_js, )


admin.site.register(TranslationLabel, TranslationLabelAdmin)
