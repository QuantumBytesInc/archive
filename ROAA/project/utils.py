# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import logging
from django.conf import settings
from django.shortcuts import render, redirect

# Set log format
log = logging.getLogger(__name__)

def custom_attributes(user, service):
  log.info('User successfully authenticated')
  return {'email': user.email}

def error404(request):
    return render(request, "error_404.html", content_type='text/html', status=307)
