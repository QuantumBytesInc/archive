# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>

# Python imports
import json
import logging
import sys
import os
# Django imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.realpath('__file__')), 'roa-constants/constants')))
#External include
import roap_utils as utils


from django.core.mail import EmailMessage

log = logging.getLogger(__name__)


def send_mail(request, data, values):
    """
    Try to register a new user
    :param data: Data from registration request
    :param values: The value dict
    :return: The data
    """
    try:
        # Encoded json
        encoded = json.loads(data)

        # Set user and password
        if "NAME" not in encoded or \
                        "EMAIL" not in encoded or \
                        "SUBJECT" not in encoded or \
                        "MESSAGE" not in encoded:
            ValueError('Missing key', utils.result_codes['CONTACT_SEND_MAIL_FAILED_MISSING_VALUES'])
        else:
            values['CODE'] = utils.result_codes['CONTACT_SEND_MAIL_SUCCESSFULLY']

    except ValueError as e:
        log.error(e)
        values['CODE'] = e.args[1]


def __send_mail(_name, _email, _subject, _message):
    email = EmailMessage('Contact requested',
                         'Hello QB-Team,\n\n'
                         'You have an contact request\n\n' +
                         'Subject:' + _subject + '\n' +
                         'Name:' + _name + '\n' +
                         'EMail:' + _email + '\n' +
                         'Message:' + _message + '\n' +
                         'Please get in touch with this user!',
                         'Relics of Annorath <noreply@annorath-game.com>',
                         ['lars.saalbach@quantum-bytes.com'],
                         [])
    email.send(fail_silently=True)

    email_external = EmailMessage('Contact requested',
                                  'Hello ' + _name + ',\n\n'
                                                     'Thanks for reaching out to us!\n\n' +
                                  'We\'ll get in touch with you soon!\n\n' +
                                  'Copy of your data!\n\n' +
                                  'Subject:' + _subject + '\n' +
                                  'Name:' + _name + '\n' +
                                  'EMail:' + _email + '\n' +
                                  'Message:' + _message + '\n' +
                                  'Relics of Annorath <noreply@annorath-game.com>',
                                  [_email],
                                  ['lars.saalbach@quantum-bytes.com'])
    email_external.send(fail_silently=True)
