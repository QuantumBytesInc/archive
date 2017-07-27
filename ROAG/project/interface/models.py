# Copyright (C) 2015 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models


class ServerState(models.Model):
    """
    Token class for authentication handling.
    """
    state = models.IntegerField(default=0)  #: The state
    last_check = models.DateTimeField(verbose_name="Last check", null=False)  #: The last check date

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.state

    class Meta:
        # Plural name
        verbose_name_plural = 'Server state'

