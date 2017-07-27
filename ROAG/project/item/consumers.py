# Copyright (C) 2017 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Imports
import logging
import json
from datetime import datetime
from django.utils.timezone import utc
from django.contrib.auth.models import User
from channels import Group
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
from project.communication.models import Channel, ChannelRight, Right,  UserList
from project.gui import utils
from project.account.models import Character
from project.interface import utils as api

# Set logging
log = logging.getLogger(__name__)


@channel_session
@channel_session_user_from_http
def ws_connect(message):
    # Extract the room from the message. This expects message.path to be of the
    # form /chat/{label}/, and finds a Room if the message path is applicable,
    # and if the Room exists. Otherwise, bails (meaning this is a some othersort
    # of websocket). So, this is effectively a version of _get_object_or_404.
    try:
        log.debug('ITEM - Consumers - Websocket Connect - Called')
        uuid = message['path'].strip('/').split('/')[-1]
        channel = Channel.objects.get(uuid=uuid, name='storage')
    except Channel.DoesNotExist:
        log.error('ITEM - Consumers - Websocket Connect - ws channel does not exist uuid=%s', uuid)
        message.reply_channel.send({"accept": False})
        return

    # Permission
    try:
        character = Character.objects.get(user=User.objects.get(id=message.user.id), is_spawned=True)
    except:
        log.error('ITEM - Consumers - Websocket Connect - no join right for uuid=%s', uuid)
        message.reply_channel.send({"accept": False})
        return

    log.debug('ITEM - Consumers - Websocket Connect - chat connect channel=%s client=%s:%s',
              channel.uuid, message['client'][0], message['client'][1])

    Group('chat-' + uuid, channel_layer=message.channel_layer).add(message.reply_channel)

    message.channel_session['uuid'] = channel.uuid
    message.reply_channel.send({"accept": True})

    log.debug('ITEM - Consumers - Websocket Connect - Connected successfully')


@channel_session
@channel_session_user
def ws_receive(message):
    if '---heartbeat---' in message['text'] and 'CALLER' not in message['text']:
        return

    log.debug('ITEM - Consumers - Websocket Receive - Called')
    # Look up the room from the channel session, bailing if it doesn't exist
    try:
        uuid = message.channel_session['uuid']
        channel = Channel.objects.get(uuid=uuid, name='storage')
    except KeyError:
        log.error('ITEM - Consumers - Websocket Receive - No room in channel_session')
        return
    except Channel.DoesNotExist:
        log.error('ITEM - Consumers - Websocket Receive - recieved message, but room does not exist uuid=%s', uuid)
        return

    values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': '', 'CALLER': ''}

    # Do work
    try:
        data = json.loads(message['text'])

        values = {'ERROR': -1, 'CODE': '', 'DATA': {}, 'ACTION': data['ACTION'], 'CALLER': data['CALLER'], 'REQUEST_ID': data['REQUEST_ID']}

        if data['CALLER'] == utils.callers['STORAGE']:
            api.storage_actions(message.user.id, data['ACTION'], data['DATA'], values)

    except Exception as e:
        log.debug(str(e))
        values['ERROR'] = utils.global_errors['ERROR_MISC_ERROR']

    message.reply_channel.send({"text": json.dumps(values)})


@channel_session
@channel_session_user
def ws_disconnect(message):
    try:
        uuid = message.channel_session['uuid']
        channel = Channel.objects.get(uuid=uuid, name='storage')
    except KeyError:
        log.error('ITEM - Consumers - Websocket Receive - No room in channel_session')
        return
    except Channel.DoesNotExist:
        log.error('ITEM - Consumers - Websocket Receive - recieved message, but room does not exist uuid=%s', uuid)
        return

    Group('chat-' + message.channel_session['uuid'], channel_layer=message.channel_layer).discard(message.reply_channel)
