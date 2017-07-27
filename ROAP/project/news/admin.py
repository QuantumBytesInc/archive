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
from project.news.models import Entry


class NewsEntryAdmin(admin.ModelAdmin):
    """Admin form class for news entry management
    """
    # Configure fields
    fields = ('category', 'title', 'short_text', 'text', 'published')  #: Fields to display
    readonly_fields = ('creator', 'created', 'editor', 'updated',)  #: Read only fields
    list_display = ('title', 'short_text', 'category', 'published')    #: Fields to display

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

    # Overwrite media for tinymce usage
    class Media:
        js = [settings.STATIC_URL + 'grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
              settings.STATIC_URL + 'grappelli/tinymce_setup/tinymce_setup.js']


# Register class in backend
admin.site.register(Entry, NewsEntryAdmin)
