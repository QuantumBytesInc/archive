# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib.auth.decorators import login_required
from django.utils.timezone import utc
from django.contrib.auth import get_user

# Python imports
import logging
from datetime import datetime

# Model imports
from project.account.models import Setting, SettingProfile, Control
from project.game.models import Language

# Set logging
log = logging.getLogger(__name__)


@login_required
def create_settings(request):
    """
    Create default setting for new user.
    :param request: The request
    :return: The new settings object
    """

    settings = Setting.objects.create(
        profile=SettingProfile.objects.get(name='Medium'),
        language=Language.objects.get(name='English'),
        user=get_user(request),
        profileName='Auto generated',
        creator=get_user(request),
        created=datetime.utcnow().replace(tzinfo=utc),
        editor=get_user(request),
        edited=datetime.utcnow().replace(tzinfo=utc)
    )

    settings.controls.add(
        Control.objects.create(
            key=119, function=0,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.controls.add(
        Control.objects.create(
            key=115, function=1,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.controls.add(
        Control.objects.create(
            key=97, function=2,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.controls.add(
        Control.objects.create(
            key=100, function=3,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.controls.add(
        Control.objects.create(
            key=32, function=4,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.controls.add(
        Control.objects.create(
            key=99, function=5,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.controls.add(
        Control.objects.create(
            key=120, function=6,
            user=get_user(request),
            creator=get_user(request),
            created=datetime.utcnow().replace(tzinfo=utc),
            editor=get_user(request),
            edited=datetime.utcnow().replace(tzinfo=utc)
        )
    )

    settings.save()

    return settings
