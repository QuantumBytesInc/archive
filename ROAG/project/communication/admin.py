# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib import admin
from django.contrib.auth.models import User
from django import forms

# Python imports
from datetime import datetime
import uuid

# Model imports
from project.communication.models import Right, Channel, ChannelRight, Event, Message, Notification


class ChannelAdmin(admin.ModelAdmin):
    """
    Channel administration class.
    """
    fields = ('name', 'uuid', 'creator', 'created', 'editor', 'edited', )
    readonly_fields = ('uuid', 'creator', 'created', 'editor', 'edited', )
    list_display = ('name', 'uuid')

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
            obj.uuid = uuid.uuid4().hex
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        obj.save()


class RightAdmin(admin.ModelAdmin):
    """
    Right administration class.
    """
    fields = ('name', 'creator', 'created', 'editor', 'edited', )
    readonly_fields = ('creator', 'created', 'editor', 'edited', )
    list_display = ('name', )

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

        obj.save()


class ChannelRightAdmin(admin.ModelAdmin):
    """
    Channel right administration class.
    """
    fields = ('channel', 'character', 'rights', 'creator', 'created', 'editor', 'edited', )
    readonly_fields = ('creator', 'created', 'editor', 'edited', )
    list_display = ('channel', 'character', )

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

        obj.save()


class MessageAdminForm(forms.ModelForm):
    """
    Message administration form.
    """
    class Meta:
        model = Message
        exclude = []

    u_sender = forms.ChoiceField(label='Sender')  #: Overwrite choices for user object
    u_receiver = forms.ChoiceField(label='Receiver')  #: Overwrite choices for user object

    def __init__(self, *args, **kwargs):
        """
        Overwrite of init for filling-in user choices.
        :param args: Args
        :param kwargs: Kwargs
        """
        super(MessageAdminForm, self).__init__(*args, **kwargs)

        # Set user
        sender = self.instance.sender
        receiver = self.instance.receiver

        # Get all users and create choices
        users_all = User.objects.all()
        users_all = users_all.order_by('id')
        available_choices = [(e.id, e.username) for e in users_all]

        # Set choices and user
        self.fields['u_sender'].choices = available_choices
        self.fields['u_sender'].initial = sender

        self.fields['u_receiver'].choices = available_choices
        self.fields['u_receiver'].initial = receiver


class MessageAdmin(admin.ModelAdmin):
    """
    Message right administration class.
    """
    form = MessageAdminForm  #: Add custom form

    fields = (
        'u_sender',
        'u_receiver',
        'date',
        'answered',
        'read',
        'subject',
        'text',
        'creator',
        'created',
        'editor',
        'edited',
    )

    readonly_fields = ('date', 'answered', 'read', 'creator', 'created', 'editor', 'edited', )
    list_display = ('subject', 'get_user_sender', 'get_user_receiver', )

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Set owner and save
        obj.sender = form.cleaned_data['u_sender']
        obj.receiver = form.cleaned_data['u_receiver']

        if change:
            obj.editor = request.user
            obj.edited = datetime.now()
        else:
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()
            obj.date = datetime.now()

        obj.save()

    def get_user_sender(self, obj):
        """
        Get the current user for displaying.
        :param obj: The object
        """
        return User.objects.get(id=obj.sender).username
    get_user_sender.short_description = 'Sender'

    def get_user_receiver(self, obj):
        """
        Get the current user for displaying.
        :param obj: The object
        """
        return User.objects.get(id=obj.receiver).username
    get_user_receiver.short_description = 'Receiver'


class EventAdminForm(forms.ModelForm):
    """
    Event administration form.
    """
    class Meta:
        model = Event
        exclude = []

    owner = forms.ChoiceField(label='User')  #: Overwrite choices for user object

    def __init__(self, *args, **kwargs):
        """
        Overwrite of init for filling-in user choices.
        :param args: Args
        :param kwargs: Kwargs
        """
        super(EventAdminForm, self).__init__(*args, **kwargs)

        # Set user
        user = self.instance.user

        # Get all users and create choices
        users_all = User.objects.all()
        users_all = users_all.order_by('id')
        available_choices = [(e.id, e.username) for e in users_all]

        # Set choices and user
        self.fields['owner'].choices = available_choices
        self.fields['owner'].initial = user


class EventAdmin(admin.ModelAdmin):
    """
    Event administration class.
    """
    form = EventAdminForm  #: Add custom form

    fields = ('type', 'date', 'subject', 'text', 'owner', 'creator', 'created', 'editor', 'edited', )
    readonly_fields = ('creator', 'created', 'editor', 'edited', )
    list_display = ('subject', 'type', 'get_user')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Set owner and save
        obj.user = form.cleaned_data['owner']

        if change:
            obj.editor = request.user
            obj.edited = datetime.now()
        else:
            obj.date = datetime.now()
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        obj.save()

    def get_user(self, obj):
        """
        Get the current user for displaying.
        :param obj: The object
        """
        return User.objects.get(id=obj.user).username
    get_user.short_description = 'User'


class NotificationAdminForm(forms.ModelForm):
    """
    Notification administration form.
    """
    class Meta:
        model = Notification
        exclude = []

    owner = forms.ChoiceField(label='User')  #: Overwrite choices for user object

    def __init__(self, *args, **kwargs):
        """
        Overwrite of init for filling-in user choices.
        :param args: Args
        :param kwargs: Kwargs
        """
        super(NotificationAdminForm, self).__init__(*args, **kwargs)

        # Set user
        user = self.instance.user

        # Get all users and create choices
        users_all = User.objects.all()
        users_all = users_all.order_by('id')
        available_choices = [(e.id, e.username) for e in users_all]

        # Set choices and user
        self.fields['owner'].choices = available_choices
        self.fields['owner'].initial = user


class NotificationAdmin(admin.ModelAdmin):
    """
    Notification administration class.
    """
    form = NotificationAdminForm  #: Add custom form

    fields = ('type', 'date', 'subject', 'text', 'owner', 'creator', 'created', 'editor', 'edited', )
    readonly_fields = ('creator', 'created', 'editor', 'edited', )
    list_display = ('subject', 'type', 'get_user')

    def save_model(self, request, obj, form, change):
        """
        Overwrite save_model.
        :param request: The request
        :param obj: The object
        :param form: The form
        :param change: Change flag
        """
        # Set owner and save
        obj.user = form.cleaned_data['owner']

        if change:
            obj.editor = request.user
            obj.edited = datetime.now()
        else:
            obj.date = datetime.now()
            obj.creator = request.user
            obj.created = datetime.now()
            obj.editor = request.user
            obj.edited = datetime.now()

        obj.save()

    def get_user(self, obj):
        """
        Get the current user for displaying.
        :param obj: The object
        """
        return User.objects.get(id=obj.user).username
    get_user.short_description = 'User'

# Register admin sites
admin.site.register(Channel, ChannelAdmin)
admin.site.register(Right, RightAdmin)
admin.site.register(ChannelRight, ChannelRightAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Notification, NotificationAdmin)
