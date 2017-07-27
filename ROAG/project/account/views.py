# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib.auth.decorators import login_required
from django.utils.timezone import utc
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user
from django.contrib.auth.models import User
from django.utils.timezone import utc

# Python imports
import logging
from datetime import datetime
import collections

# Third party imports
from concurrency.exceptions import RecordModifiedError

# Model imports
from project.account.models import Character, Setting, SettingProfile, Control, Token
from project.communication.models import Event, Message, Notification, ChannelRight, Channel, Right
from project.game.models import Language, Location
from project.stats.models import CharacterCreate


# Other imports
from project.gui import utils
from project.account import utils as account_utils
from project.login.views import get_user_by_token, get_token_validity

# Set logging
log = logging.getLogger(__name__)


@login_required
def character_list(request, values):
    """
    Get a list of all characters for an user.
    :param request: The request
    :param values: Value map for json answer
    :return: Value map
    """
    log.debug('ACCOUNT - Character list - Called')

    # Set user
    user = get_user(request)
    # Get character list
    characters = Character.objects.filter(user=user, deleted=False).order_by('id')
    # Set code
    values['CODE'] = utils.result_codes['CHARACTER_LIST_SUCCESSFULLY']

    # Get data
    data = values['DATA']
    data['CHARACTERS'] = []

    if characters is not None:
        for character in characters:
            data['CHARACTERS'].append({
                'character': character.id,
                'first_name': character.name_first,
                'last_name': character.name_last,
                'nickname': character.nickname,
                'location': character.location.name,
                'guild': 'Alpha Tests',
                'slot': character.slot,
                'events_normal': Event.objects.filter(character=character).count(),
                'events_important': Event.objects.filter(character=character).count(),
                'notification': Notification.objects.filter(character=character).count(),
                'messages': Message.objects.filter(receiver=character).count(),
            })

            # Cleanup spawn flag
            character.is_spawned = False
            character.save()

    return values


@login_required
def character_create(request, data, values):
    """
    Create a new character.
    :param request: The request
    :param values: Value map for json answer
    :return: Value map
    """
    log.debug('ACCOUNT - Character create - Called')

    # Encoded json
    encoded = data
    log.error(data)
    # Check if user does not have max character amount
    characters = Character.objects.filter(user=get_user(request), deleted=False)

    try:
        if characters.count() < 3:

            # Get a free slot
            slots = {1: 1, 2: 2, 3: 3}

            for character in characters:
                try:
                    slots.pop(character.slot)
                except Exception as e:
                    log.error('ACCOUNT - Character create - Pop-error with wrong id')

            # Order it
            od = collections.OrderedDict(sorted(slots.items()))
            log.error("Create new character now")
            character = Character.objects.create(
                location=Location.objects.get(id=encoded['LOCATIONID']),
                name_first=encoded['FORENAME'],
                name_last=encoded['SURNAME'],
                nickname=encoded['NICKNAME'],
                user=get_user(request),
                position='0;0;0',
                slot=next(iter(od)),
                creator=get_user(request),
                created=datetime.utcnow().replace(tzinfo=utc),
                editor=get_user(request),
                edited=datetime.utcnow().replace(tzinfo=utc))

            # Save
            character.save()

            # Set channel rights
            channel = Channel.objects.get(name='sync')
            master_chief_user = User.objects.filter(username='masterchief').get()
            temp = ChannelRight.objects.create(character=character, creator=master_chief_user,
                                        created=datetime.utcnow().replace(tzinfo=utc),
                                        editor=master_chief_user,
                                        edited=datetime.utcnow().replace(tzinfo=utc), channel_id=channel.id)
            temp.rights.add(Right.objects.get(name='join'))
            temp.channel = channel
            temp.created = master_chief_user
            temp.editor = master_chief_user
            temp.created = datetime.utcnow().replace(tzinfo=utc)
            temp.edited = datetime.utcnow().replace(tzinfo=utc)
            temp.save()

            channel = Channel.objects.get(name='general')
            temp = ChannelRight.objects.create(character=character, creator=master_chief_user,
                                        created=datetime.utcnow().replace(tzinfo=utc),
                                        editor=master_chief_user,
                                        edited=datetime.utcnow().replace(tzinfo=utc), channel_id=channel.id)
            temp.rights.add(Right.objects.get(name='join'))
            temp.rights.add(Right.objects.get(name='write'))
            temp.channel = channel
            temp.created = master_chief_user
            temp.editor = master_chief_user
            temp.created = datetime.utcnow().replace(tzinfo=utc)
            temp.edited = datetime.utcnow().replace(tzinfo=utc)
            temp.save()

            log.debug('ACCOUNT - Character create - New character successfully created')
            values['CODE'] = utils.result_codes['CHARACTER_CREATE_SUCCESSFULLY']

            # Add stats entry
            CharacterCreate.objects.create(date=datetime.utcnow().replace(tzinfo=utc),
                                           character=character)

        else:
            log.error('ACCOUNT - Character create - Character limit reached')
            values['CODE'] = utils.result_codes['CHARACTER_CREATE_LIMIT_REACHED']

        return values

    except Exception as e:
        log.error('ACCOUNT - Character create - Exception: ' + str(e))

        values['CODE'] = utils.result_codes['CHARACTER_CREATE_FAILED_MISC']

        return values


@login_required
def character_delete(request, data, values):
    """
    Create a new character.
    :param request: The request
    :param values: Value map for json answer
    :return: Value map
    """
    log.debug('ACCOUNT - Character delete - Called')

    # Encoded json
    encoded = data

    try:
        character_id = encoded['ID']
        character = Character.objects.get(id=character_id, user=get_user(request))
        character.deleted = True

        character.save()
        log.debug('ACCOUNT - Character delete - Successfully')
        values['CODE'] = utils.result_codes['CHARACTER_DELETE_SUCCESSFULLY']

        return values

    except ObjectDoesNotExist as e:
        log.error('ACCOUNT - Character delete - Exception: ' + str(e))

        values['CODE'] = utils.result_codes['CHARACTER_DELETE_INVALID_CHARACTER']

        return values


@login_required
def settings_get(request, data, values):
    """
    Get settings for the user.
    :param request: The request
    :param values: Value map for json answer
    :return: Value map
    """
    log.debug('ACCOUNT - Settings get - Called')

    # Set user
    user = get_user(request)

    # Encoded json
    encoded = data
  
    # Tiny settings
    tiny = False

    try:
        tiny = encoded['TINY']
    except Exception as e:
        tiny = False

    # Get settings
    settings = Setting.objects.filter(user=user)
    values['CODE'] = utils.result_codes['ACCOUNT_SETTINGS_GET_SUCCESSFULLY']

    # Check if settings already are created
    if settings.count() < 1:
        log.debug('ACCOUNT - Settings get - Settings not found, creating new ones')
        settings = account_utils.create_settings(request)

    else:
        log.debug('ACCOUNT - Settings get - Settings found')
        settings = settings[0]

    log.debug('ACCOUNT - Settings get - Use setting: ' + str(settings.id))

    # Get data
    data = values['DATA']
    data['PROFILES'] = []

    # Prepare default values
    choices_resolutions = []
    for choi in Setting.RESOLUTION_CHOICES:
        choices_resolutions.append({'key': choi[0], 'value': choi[1], 'label': 'T_SW_Text24'})

    choices_occlusion = []
    for choi in Setting.OCCLUSION_CHOICES:
        choices_occlusion.append({'key': choi[0], 'value': choi[1], 'label': 'T_SW_Text12'})

    choices_shader = []
    for choi in Setting.SHADER_CHOICES:
        choices_shader.append({'key': choi[0], 'value': choi[1], 'label': 'T_SW_Text15'})

    choices_texture = []
    for choi in Setting.TEXTURE_CHOICES:
        choices_texture.append({'key': choi[0], 'value': choi[1], 'label': 'T_SW_Text16'})

    choices_anisotropy = []
    for choi in Setting.ANISOTROPY_CHOICES:
        choices_anisotropy.append({'key': choi[0], 'value': choi[1], 'label': 'T_SW_Text18'})

    choices_multisample = []
    for choi in Setting.MULTISAMPLE_CHOICES:
        choices_multisample.append({'key': choi[0], 'value': choi[1], 'label': 'T_SW_Text19'})

    choices_sfx = []
    for choi in Setting.SFX_CHOICES:
        choices_sfx.append({'key': choi[0], 'value': choi[1], 'label': 'EMPTY'})

    choices_language = []
    for choi in Language.objects.all():
        choices_language.append({'key': choi.id, 'value': choi.name, 'label': 'EMPTY'})

    choices_profile = []

    for choi in SettingProfile.objects.all():
        choices_profile.append({'key': choi.id, 'value': choi.name, 'label': 'EMPTY'})

        if choi.name == 'Custom':
            # Set it, but never save it
            choi.setting = settings

        # Create own instance for angularjs logic
        if tiny == False or choi.id == settings.profile:

            data['PROFILES'].append({
                'profile_id': choi.id,
                'profile_name': choi.name,
                'reflection': choi.setting.reflection,
                'parallax': choi.setting.parallax,
                'motion_blur': choi.setting.motionBlur,
                'refraction': choi.setting.refraction,
                'volumetric_shadows': choi.setting.volumetric,
                'texture_filtering': choi.setting.filter,
                'occlusion': choi.setting.occlusion,
                'shader': choi.setting.shader,
                'texture': choi.setting.texture,
                'anisotropy': choi.setting.anisotropy,
                'multisample': choi.setting.multisample,
            })

    # Prepare controls
    data_controls = []

    for ctrl in settings.controls.all():
        data_controls.append({'key': ctrl.function,
                              'value': ctrl.key,
                              'label': 'EMPTY',
                              'name': ctrl.FUNCTION_CHOICES[ctrl.function][1]})

    # Append settings
    if tiny == False:
        data['SETTINGS'] = {
            'resolution':  choices_resolutions,
            'view_distance': {'label': 'EMPTY'},
            'gamma': {'label': 'T_SW_Text1'},
            'fullscreen': {'label': 'T_SW_Text23'},
            'vsync': {'label': 'T_SW_Text6'},
            'reflection': {'label': 'T_SW_Text9'},
            'parallax': {'label': 'T_SW_Text10'},
            'motion_blur': {'label': 'T_SW_Text11'},
            'refraction': {'label': 'T_SW_Text13'},
            'volumetric_shadows': {'label': 'T_SW_Text14'},
            'texture_filtering': {'label': 'T_SW_Text17'},
            'occlusion': choices_occlusion,
            'shader': choices_shader,
            'texture': choices_texture,
            'anisotropy': choices_anisotropy,
            'multisample': choices_multisample,
            'sfx': choices_sfx,
            'profile': choices_profile,
            'volume_master': {'label': 'T_SW_Text20'},
            'volume_ambient': {'label': 'EMPTY'},
            'volume_music': {'label': 'EMPTY'},
            'volume_character': {'label': 'EMPTY'},
            'volume_effects': {'label': 'EMPTY'},
            'languages': choices_language,
        }

    data['CONTROLS'] = data_controls

    # Set global settings, which are independent of the profile
    data['GLOBALS'] = {
        'view_distance': settings.distance,
        'gamma': settings.gamma,
        'fullscreen': settings.fullscreen,
        'vsync': settings.vsync,
        'volume_master': settings.master,
        'volume_ambient': settings.ambient,
        'volume_music': settings.music,
        'volume_character': settings.character,
        'volume_effects': settings.effects,
        'resolution': settings.resolution,
        'sfx': settings.sfx,
        'profile': settings.profile.id,
        'width': settings.width,
        'height': settings.height,
        'language': settings.language.id,
        'mouse_sensitivity': settings.mouse_sensitivity
    }

    return values


@login_required
def settings_set(request, data, values):
    """
    Save user settings.
    :param request: The request
    :param values: Value map for json answer
    :return: Value map
    """
    log.debug('ACCOUNT - Settings set - Called')

    # Encoded json
    encoded = data

    # Get settings and save values
    try:
        # Set settings
        settings = Setting.objects.get(user=get_user(request))

        settings.profile = SettingProfile.objects.get(id=encoded['GLOBALS']['profile'])
        settings.music = encoded['GLOBALS']['volume_music']
        settings.ambient = encoded['GLOBALS']['volume_ambient']
        settings.sfx = encoded['GLOBALS']['sfx']
        settings.distance = encoded['GLOBALS']['view_distance']
        settings.fullscreen = encoded['GLOBALS']['fullscreen']
        settings.master = encoded['GLOBALS']['volume_master']
        settings.vsync = encoded['GLOBALS']['vsync']
        settings.character = encoded['GLOBALS']['volume_character']
        settings.resolution = encoded['GLOBALS']['resolution']
        settings.gamma = encoded['GLOBALS']['gamma']
        settings.effects = encoded['GLOBALS']['volume_effects']
        settings.width = encoded['GLOBALS']['width']
        settings.height = encoded['GLOBALS']['height']
        settings.language = Language.objects.get(id=encoded['GLOBALS']['language'])
        settings.mouse_sensitivity = encoded['GLOBALS']['mouse_sensitivity']
        
        if 'CUSTOM' in encoded:
            settings.motionBlur = encoded['CUSTOM']['motion_blur']
            settings.parallax = encoded['CUSTOM']['parallax']
            settings.refraction = encoded['CUSTOM']['refraction']
            settings.filter = encoded['CUSTOM']['texture_filtering']
            settings.volumetric = encoded['CUSTOM']['volumetric_shadows']
            settings.anisotropy = encoded['CUSTOM']['anisotropy']
            settings.multisample = encoded['CUSTOM']['multisample']
            settings.occlusion = encoded['CUSTOM']['occlusion']
            settings.shader = encoded['CUSTOM']['shader']
            settings.reflection = encoded['CUSTOM']['reflection']
            settings.texture = encoded['CUSTOM']['texture']

        # Set new one
        data = encoded['CONTROLS']
        for i in data:
            ctrl = settings.controls.get(function=i['key'])
            ctrl.key=i['value']
            ctrl.editor=get_user(request)
            ctrl.edited=datetime.utcnow().replace(tzinfo=utc)
            ctrl.save()
      
        settings.save()
        log.debug('ACCOUNT - Settings set - Saved settings successfully')
        values['CODE'] = utils.result_codes['ACCOUNT_SETTINGS_SET_SUCCESSFULLY']

    except (ObjectDoesNotExist, RecordModifiedError) as e:
        log.error('ACCOUNT - Settings set - Exception: ' + str(e))

        values['CODE'] = utils.result_codes['ACCOUNT_SETTINGS_SET_FAILED_MISC']

        if isinstance(e, RecordModifiedError):
            values['ERROR'] = utils.global_errors['ERROR_OBJECT_LOCKED']

    return values


@login_required
def character_spawn(request, data, values):
    """
    Spawn character in the world
    :param data: The data
    :param values: The values
    :return: Value map
    """
    log.debug('ACCOUNT - Character spawn - Called')

    # Encoded json
    encoded = data

    try:
        character = encoded['ID']

        # Get user object
        character = Character.objects.get(user=get_user(request), id=character)

        # Set spawn flag
        character.is_spawned = True

        # Save
        character.save()

        # Set values
        values['CODE'] = utils.result_codes['CHARACTER_SPAWN_SUCCESSFULLY']

        return values

    except ObjectDoesNotExist as e:
        log.error('ACCOUNT - Character spawn - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['CHARACTER_SPAWN_FAILED_MISC']

        return values


def internal_character_spawn(data, values):
    """
    INTERNAL: Spawn character in the world
    :param data: The data
    :param values:  The values
    :return: Value map
    """
    log.debug('ACCOUNT - Internal character spawn - Called')

    # @TODO Change token here
    # Encoded json
    encoded = data

    try:
        # Get token and character id
        token = encoded['token']
        character = encoded['character']

        # Get token
        if get_token_validity(token) == True:
            log.debug('ACCOUNT - Internal character spawn - Token valid')
            found_user = get_user_by_token(token)

            if found_user is not None:

                # Get user object
                character = Character.objects.get(user=found_user, id=character)

                if character.is_spawned:
                    # Set data
                    values['CODE'] = utils.result_codes['CHARACTER_SPAWN_SUCCESSFULLY']

                    data = values['DATA']
                    data['CHARACTER'] = {'character': character.id, 'position': character.position}

                else:
                    log.error('ACCOUNT - Internal character spawn - Wrong character id')

                    # Set data
                    values['CODE'] = utils.result_codes['CHARACTER_SPAWN_INVALID_CHARACTER']

                    data = values['DATA']
                    data['CHARACTER'] = {'character': character.id, 'position': '0,0,0'}
            else:
                log.error('ACCOUNT - Internal character spawn - User not found for token')
                values['CODE'] = utils.result_codes['CHARACTER_SPAWN_INVALID_TOKEN']
        else:
            log.error('ACCOUNT - Internal character spawn - Token is outdated')

            # Set data
            values['CODE'] = utils.result_codes['CHARACTER_SPAWN_INVALID_TOKEN']

        return values

    except ObjectDoesNotExist as e:
        log.error('ACCOUNT - Internal character spawn - Exception: ' + str(e))

        values['CODE'] = utils.result_codes['CHARACTER_SPAWN_FAILED_MISC']

        return values
