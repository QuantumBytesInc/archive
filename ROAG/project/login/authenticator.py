# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import logging

# Model imports
from project.account.models import Token
from project.communication.models import Channel, ChannelRight, Right

logger = logging.getLogger('omnibus-authentication')

LOG_LEVELS = {
    'debug': logger.debug,
    'info': logger.info,
    'error': logger.error,
}


class UserAuthenticator(object):
    @classmethod
    def authenticate(cls, args):
        """
        Authenticate user against django.
        :param args: Arguments with identifier and auth token
        :return: User object if successfully authenticated, else None
        """
        if ':' in args:
            # auth token available, try to validate.
            try:
                identifier, token = args.split(':')
                logger.debug(identifier + ': Token found')
            except ValueError:
                logger.error('Token not found')
                return None

            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
            except ImportError:
                # Fall back to directly importing User
                # for backwards compatibility
                from django.contrib.auth.models import User

            # Get the user and check if active
            try:
                user = User.objects.get(pk=Token.objects.get(token=token).user, is_active=True)
                logger.debug(identifier + ': User found with id ' + str(user.id))
            except (ValueError, User.DoesNotExist):
                logger.error(identifier + ': User not found')
                return None
        else:
            # No auth_token, assume anonymous connection.
            logger.error('Invalid arguments')
            return None

        return cls(identifier, user)

    def __init__(self, identifier, user):
        """
        Init.
        :param identifier: Identifier
        :param user: User
        """
        self.identifier = identifier
        self.user = user

    def get_identifier(self):
        return self.identifier

    def can_subscribe(self, channel):
        """
        Check if a user has permissions to subscribe.
        :param channel: The channel
        :return: None if no access, else the user object
        """
        try:
            # Get the channel
            channel = Channel.objects.get(uuid=channel)

            # Global channels do not need verification
            if channel.name != 'sync':

                # Get access entries
                access = ChannelRight.objects.filter(channel=channel, user=self.user).first()

                if access.rights.filter(name='Join').first() is not None:
                    logger.debug(self.identifier + ': Access granted for user with id ' + str(self.user.id))
                    return self.user

                else:
                    logger.error(self.identifier + ': Access prohibited for user with id ' + str(self.user.id))
                    return None
            else:
                return self.user

        except Exception as e:
            logger.error(self.identifier + ': Invalid channel requested by user with id ' + str(self.user.id) + ' with uuid: ' + channel)
            logger.error(self.identifier + ': ' + e.message)
            return None

    def can_unsubscribe(self, channel):
        # If a user is authenticated, un-subscription is allowed.
        return self.user is not None

    def can_publish(self, channel):
        """
        Check if a user has write access to a channel.
        :param channel: The uuid of the channel
        :return: None if no access, else the user object
        """
        try:
            # Get the channel
            channel = Channel.objects.get(uuid=channel)

            # Global channels do not need verification
            if channel.name != 'sync':
                # Get access entries
                access = ChannelRight.objects.filter(channel=channel, user=self.user).first()

                if access.rights.filter(name='Write').first() is not None:
                    logger.debug(self.identifier + ': Write access granted for user with id ' + str(self.user.id))
                    return self.user

                else:
                    logger.error(self.identifier + ': Write access prohibited for user with id ' + str(self.user.id))
                    return None
            else:
                return self.user

        except Exception as e:
            logger.error(self.identifier + ': Invalid channel requested by user with id ' + str(self.user.id))
            logger.error(self.identifier + ': ' + e.message)
            return None
