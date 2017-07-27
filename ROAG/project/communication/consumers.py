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

# Set logging
log = logging.getLogger(__name__)


def ws_active_users(uuid):
    log.debug('COMMUNICATION - Consumers - Active users - Called')
    current_time = datetime.utcnow()
    current_time = current_time.replace(tzinfo=utc)

    try:
        users = []

        for user in UserList.objects.filter(channel=Channel.objects.get(uuid=uuid)):
            users.append(user.character.nickname)

        values_sending = {'ERROR': -1,
                          'CODE': utils.result_codes['CHANNEL_GET_USER_LIST_SUCCESSFULLY'],
                          'DATA': {'USERS': users,
                                   'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour,
                                                                    current_time.minute,
                                                                    current_time.second)},
                          'ACTION': utils.actions['CHANNEL_GET_USER_LIST'],
                          'CALLER': utils.callers['CHANNEL']}
        log.debug('COMMUNICATION - Consumers - Active users - Successfully send')
    except:
        log.error('COMMUNICATION - Consumers - Active users - User list failed, wrong query')

        values_sending = {'ERROR': -1,
                          'CODE': utils.result_codes['CHANNEL_GET_USER_LIST_FAILED'],
                          'DATA': {'USERS': '',
                                   'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour,
                                                                    current_time.minute,
                                                                    current_time.second)},
                          'ACTION': utils.actions['CHANNEL_GET_USER_LIST'],
                          'CALLER': utils.callers['CHANNEL']}

    return json.dumps(values_sending)


def ws_send_user_connected(uuid, channel_layer, user):

    try:
        log.debug('COMMUNICATION - Consumers - Send user connected - Called')
        current_time = datetime.utcnow()
        current_time = current_time.replace(tzinfo=utc)

        values_sending = {'ERROR': -1,
                          'CODE': utils.result_codes['CHANNEL_JOIN_SUCCESSFULLY'],
                          'DATA': {'USER': Character.objects.get(user=User.objects.get(id=user.id),
                                                                 is_spawned=True).nickname,
                                   'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour,
                                                                    current_time.minute,
                                                                    current_time.second)},
                          'ACTION': utils.actions['CHANNEL_JOIN'], 'CALLER': utils.callers['CHANNEL']}

        Group('chat-' + uuid, channel_layer=channel_layer).send({'text': json.dumps(values_sending)})
        log.debug('COMMUNICATION - Consumers - Send user connected - Successfully send')
    except:
        log.error('COMMUNICATION - Consumers - Send user connected - Cant send user connected event')


def ws_send_user_disconnected(uuid, channel_layer, user):

    try:
        log.debug('COMMUNICATION - Consumers - Send user disconnected - Called')
        current_time = datetime.utcnow()
        current_time = current_time.replace(tzinfo=utc)

        values_sending = {'ERROR': -1,
                          'CODE': utils.result_codes['CHANNEL_LEAVE_SUCCESSFULLY'],
                          'DATA': {'USER': Character.objects.get(user=User.objects.get(id=user.id),
                                                                 is_spawned=True).nickname,
                                   'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour,
                                                                    current_time.minute,
                                                                    current_time.second)},
                          'ACTION': utils.actions['CHANNEL_LEAVE'], 'CALLER': utils.callers['CHANNEL']}

        Group('chat-' + uuid, channel_layer=channel_layer).send({'text': json.dumps(values_sending)})
        log.debug('COMMUNICATION - Consumers - Send user disconnected - Successfully send')
    except:
        log.error('COMMUNICATION - Consumers - Send user disconnected - Cant send user disconnected event')


@channel_session
@channel_session_user_from_http
def ws_connect(message):
    # Extract the room from the message. This expects message.path to be of the
    # form /chat/{label}/, and finds a Room if the message path is applicable,
    # and if the Room exists. Otherwise, bails (meaning this is a some othersort
    # of websocket). So, this is effectively a version of _get_object_or_404.
    try:
        log.debug('COMMUNICATION - Consumers - Websocket Connect - Called')
        prefix, uuid = message['path'].strip('/').split('/')
        if prefix != 'ws':
            log.debug('invalid ws path=%s', message['path'])
            message.reply_channel.send({"accept": False})
            return
        channel = Channel.objects.get(uuid=uuid)
    except ValueError:
        log.error('COMMUNICATION - Consumers - Websocket Connect - Invalid ws path=%s', message['path'])
        message.reply_channel.send({"accept": False})
        return
    except Channel.DoesNotExist:
        log.error('COMMUNICATION - Consumers - Websocket Connect - ws channel does not exist uuid=%s', uuid)
        message.reply_channel.send({"accept": False})
        return

    # Permission
    try:
        character = Character.objects.get(user=User.objects.get(id=message.user.id), is_spawned=True)
        ChannelRight.objects.get(character=character, channel=channel, rights=Right.objects.get(name='join'))
    except:
        log.error('COMMUNICATION - Consumers - Websocket Connect - no join right for uuid=%s', uuid)
        message.reply_channel.send({"accept": False})
        return

    log.debug('COMMUNICATION - Consumers - Websocket Connect - chat connect channel=%s client=%s:%s',
              channel.uuid, message['client'][0], message['client'][1])

    Group('chat-' + uuid, channel_layer=message.channel_layer).add(message.reply_channel)

    message.channel_session['uuid'] = channel.uuid
    message.reply_channel.send({"accept": True})
    log.debug('COMMUNICATION - Consumers - Websocket Connect - Connected successfully')

    # Send user list
    if channel.name != 'sync':

        try:
            user = UserList.objects.get(channel=channel, character=character)
            user.delete()
        except:
            None

        message.reply_channel.send({"text": ws_active_users(uuid)})

        p, created = UserList.objects.get_or_create(channel=channel, character=character)
        p.save()

        # Send join event to other users
        ws_send_user_connected(uuid, message.channel_layer, message.user)


@channel_session
@channel_session_user
def ws_receive(message):
    if '---heartbeat---' in message['text'] and 'CALLER' not in message['text']:
        return

    log.debug('COMMUNICATION - Consumers - Websocket Receive - Called')
    # Look up the room from the channel session, bailing if it doesn't exist
    try:
        uuid = message.channel_session['uuid']
        channel = Channel.objects.get(uuid=uuid)
    except KeyError:
        log.error('COMMUNICATION - Consumers - Websocket Receive - No room in channel_session')
        return
    except Channel.DoesNotExist:
        log.error('COMMUNICATION - Consumers - Websocket Receive - recieved message, but room does not exist uuid=%s', uuid)
        return

    # Permission
    try:
        character = Character.objects.get(user=User.objects.get(id=message.user.id), is_spawned=True)
        ChannelRight.objects.get(character=character, channel=channel, rights=Right.objects.get(name='write'))
    except:
        log.error('COMMUNICATION - Consumers - Websocket Receive - no write right for uuid=%s', uuid)
        message.reply_channel.send({"accept": False})
        return

    try:
        data = json.loads(message['text'])
    except ValueError:
        log.error('COMMUNICATION - Consumers - Websocket Receive - ws message is not json text=%s', str(message['text']))
        return

    if data:

        character = Character.objects.get(user=User.objects.get(id=message.user.id), is_spawned=True)

        # Calculate the diff
        current_time = datetime.utcnow()
        current_time = current_time.replace(tzinfo=utc)

        # Prepare data
        values_sending = {'ERROR': -1,
                          'CODE': utils.result_codes['CHANNEL_SEND_SUCCESSFULLY'],
                          'DATA': {'MESSAGE': data['DATA']['MESSAGE'],
                                   'USER': character.nickname,
                                   'TIMESTAMP': "%02d:%02d:%02d" % (current_time.hour,
                                                                    current_time.minute,
                                                                    current_time.second)},
                          'ACTION': utils.actions['CHANNEL_SEND'], 'CALLER': utils.callers['CHANNEL']}

        Group('chat-' + uuid, channel_layer=message.channel_layer).send({'text': json.dumps(values_sending)})
        log.debug('COMMUNICATION - Consumers - Websocket Receive - Successfully received')
    else:
        log.error('COMMUNICATION - Consumers - Websocket Receive - Data empty')


@channel_session
@channel_session_user
def ws_disconnect(message):
    try:
        log.debug('COMMUNICATION - Consumers - Websocket Disconnect - Called')
        uuid = message.channel_session['uuid']
        channel = Channel.objects.get(uuid=uuid)
        character = Character.objects.get(user=User.objects.get(id=message.user.id), is_spawned=True)
        UserList.objects.get(channel=channel, character=character).delete()

        Group('chat-' + uuid, channel_layer=message.channel_layer).discard(message.reply_channel)
        ws_send_user_disconnected(uuid, message.channel_layer, message.user)
        log.debug('COMMUNICATION - Consumers - Websocket Disconnect - Successfully disconnected')
    except:
        log.error('COMMUNICATION - Consumers - Websocket Disconnect - Could not disconnect')
        pass
