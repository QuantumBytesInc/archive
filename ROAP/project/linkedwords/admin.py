# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.contrib import admin
from django import forms

# Project includes
from project.features.models import Feature
from project.linkedwords.models import LinkedWord


class LinkedWordAdminForm(forms.ModelForm):
    class Meta:
        model = LinkedWord
        fields = '__all__'

    def clean_feature(self):
        data = self.cleaned_data['feature']
        data = Feature.objects.get(id=data)
        return data


class LinkedWordAdmin(admin.ModelAdmin):

    form = LinkedWordAdminForm

    search_fields = ['name']
    list_display = ('name', 'id')


admin.site.register(LinkedWord, LinkedWordAdmin)
