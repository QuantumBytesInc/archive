# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.conf import settings
from django.contrib import admin

# Python includes
from datetime import datetime

# Project includes
from project.faq.models import FAQEntry


class FAQEntryAdmin(admin.ModelAdmin):
    """Admin form for FAQ entry management
    """

    fields = ('category', 'title', 'text')      #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields

    list_display = ('title', 'category')    #: Fields to display

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
admin.site.register(FAQEntry, FAQEntryAdmin)
