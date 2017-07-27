# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django
from django.conf import settings

# Third party
from storages.backends.s3boto import S3BotoStorage


class StaticStorage(S3BotoStorage):
    """
    Set static file location
    """
    location = settings.STATICFILES_LOCATION


class MediaStorage(S3BotoStorage):
    """
    Set media file location
    """
    location = settings.MEDIAFILES_LOCATION
