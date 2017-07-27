# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User


class LoginFailed(models.Model):
    """
    Token class for authentication handling.
    """
    count = models.IntegerField(default=0)  #: The counter
    user = models.ForeignKey(User, verbose_name="User", editable=False, null=False)  #:

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.count

    class Meta:
        # Plural name
        verbose_name_plural = 'Failed logins'

