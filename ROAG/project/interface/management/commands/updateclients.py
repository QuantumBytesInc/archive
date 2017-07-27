# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.core.management.base import BaseCommand, CommandError

# View imports
from project.interface.views import update


class Command(BaseCommand):
    """
    Command for sending updates over the websocket.
    """
    args = 'None'
    help = 'Update for client values'
    
    def handle(self, *args, **options):
        """
        Command handle
        :param args: The arguments
        :param options: The options
        """
        update();
