# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

# Python imports
import logging
import json

# Third party imports

# Model imports
from project.item.models import Item, Storage, StorageSlot

# Other imports
from project.gui import utils
from project.communication.views import get_user_character_active
from project.item.utils import check_if_slot_free


# Set logging
log = logging.getLogger(__name__)


@login_required
def get_equipped_bags(character, values):
    """
    Get all bags equipped to the character
    :param request: The request
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Get equipped bags - Called')

        # Get bags
        bags = Storage.objects.filter(character=character, is_equipped=True)

        # Build JSON
        bag_json = []

        for bag in bags:
            # Set back data
            bag_data = {'ID': bag.id,
                        'TEMPLATE': bag.master.id,
                        'NAME': bag.item.name,
                        'PAGE_SIZE': bag.page_size,
                        'SLOTS': []}

            # Get all slots
            slots = StorageSlot.objects.filter(storage=bag, character=character)

            # Get all slots and items
            for slot in slots:
                item_data = bag_data['SLOTS']
                item_data.append({'IS_STACKED': slot.slot_is_stacked,
                                  'TEMPLATE': slot.item.master.id,
                                  'NAME': slot.item.name,
                                  'HEIGHT': slot.item.height,
                                  'WIDTH': slot.item.width,
                                  'WEIGHT': slot.item.weight,
                                  'SLOT': slot.slot_id,
                                  'ID': slot.item.id,
                                  'IS_BANK': slot.storage.is_bank})

            # Append data
            bag_json.append(bag_data)

        log.debug('ITEM - Get equipped bags - Got equipped bags successfully')

        # Set json data
        values['DATA'] = bag_json
        values['CODE'] = utils.result_codes['STORAGE_GET_EQUIPPED_BAGS_SUCCESSFULLY']

        return values

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Get equipped bags - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_GET_EQUIPPED_BAGS_FAILED_MISC']

        return values


@login_required
def get_details(character, data, values):
    """
    Get detailed information about a storage
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Get details - Called')

        # Encoded json
        encoded = data

        # Get storage and slots
        storage = Storage.objects.get(id=encoded['ID'])
        slots = StorageSlot.objects.filter(storage=storage, character=character)

        storage_content = {'ID': storage.id,
                           'TEMPLATE': storage.master.id,
                           'NAME': storage.item.name,
                           'PAGE_SIZE': storage.page_size,
                           'SLOTS': []}

        # Get all slots and items
        for slot in slots:
            item_data = storage_content['SLOTS']

            item_data.append({'IS_STACKED': slot.slot_is_stacked,
                              'TEMPLATE': slot.item.master.id,
                              'NAME': slot.item.name,
                              'HEIGHT': slot.item.height,
                              'WIDTH': slot.item.width,
                              'WEIGHT': slot.item.weight,
                              'SLOT': slot.slot_id,
                              'ID': slot.item.id})

        log.debug('ITEM - Get details - Got bag details successfully')

        # Set json data
        values['DATA'] = storage_content
        values['CODE'] = utils.result_codes['STORAGE_GET_DETAILS_SUCCESSFULLY']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Get details - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_GET_DETAILS_FAILED_MISC']

    return values


@login_required
def add(character, data, values):
    """
    Add a new item to the storage.
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Add - Called')

        # Encoded json
        encoded = data

        # Get needed values
        item_id = encoded['ITEM']
        storage_id = encoded['STORAGE']
        slot_id = encoded['SLOT']

        # Get storage
        storage = Storage.objects.get(id=storage_id)

        # Get item
        item = Item.objects.get(id=item_id, is_static=True)

        if storage.character == character or storage.is_bank:

            # Get slots
            slots = StorageSlot.objects.filter(storage=storage, character=character)

            # Token if transaction is possible
            free_storage = check_if_slot_free(storage, item, slot_id, slots)

            if free_storage:
                slot = StorageSlot.objects.create(character=character,
                                                  item=item,
                                                  storage=storage,
                                                  slot_is_stacked=False,
                                                  slot_id=slot_id)
                item.is_static = False
                item.character = character
                item.save()
                slot.save()
                log.debug('ITEM - Add - Added successfully')
                values['CODE'] = utils.result_codes['STORAGE_ADD_SUCCESSFULLY']
            else:
                log.error('ITEM - Add - Failed, slot not free')
                values['CODE'] = utils.result_codes['STORAGE_ADD_FAILED_SLOT_NOT_FREE']
        else:
            log.error('ITEM - Add - Failed, invalid storage')
            values['CODE'] = utils.result_codes['STORAGE_ADD_FAILED_INVALID_STORAGE']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Add - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_ADD_FAILED_MISC']

    return values


@login_required
def destroy(character, data, values):
    """
    Destroy item from storage.
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Destroy - Called')

        # Encoded json
        encoded = data

        # Get needed values
        item_id = encoded['ITEM']
        storage_id = encoded['STORAGE']
        slot_id = encoded['SLOT']

        item = Item.objects.get(id=item_id, character=character)
        slot = StorageSlot.objects.get(character=character,
                                       storage=Storage.objects.get(id=storage_id),
                                       item=item,
                                       slot_id=slot_id)

        # If stacked, delete all items in stack
        if slot.slot_is_stacked:
            slots = StorageSlot.objects.filter(character=character,
                                               storage=Storage.objects.get(id=storage_id),
                                               slot_is_stacke=True,
                                               id=slot.id)

            # Delete slots and item in it
            for slot in slots:
                slot.item.delete()
                slot.delete()

        else:
            slot.item.delete()
            slot.delete()

        log.debug('ITEM - Destroy - Item successfully destroyed')
        values['CODE'] = utils.result_codes['STORAGE_DESTROY_ITEM_SUCCESSFULLY']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Destroy - Exception' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_DESTROY_ITEM_FAILED_MISC']

    return values


@login_required
def move(character, data, values):
    """
    Move item between storages.
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Move - Called')

        # Encoded json
        encoded = data

        # Get needed values
        item_id = encoded['ITEM']
        storage_id_source = encoded['STORAGE_SOURCE']
        storage_id_target = encoded['STORAGE_TARGET']
        slot_id_source = encoded['SLOT_SOURCE']
        slot_id_target = encoded['SLOT_TARGET']

        storage_source = Storage.objects.get(id=storage_id_source)
        storage_target = Storage.objects.get(id=storage_id_target)
        item = Item.objects.get(id=item_id, character=character)

        # Check if both storage are accessible
        if (storage_source.is_bank and storage_target.is_bank) or \
                (storage_source.character == character and storage_target.character == character) or \
                (storage_source.character == character and storage_target.is_bank) or \
                (storage_source.is_bank and storage_target.character == character):
            # Check if target is available
            is_free = check_if_slot_free(storage_target,
                                         item,
                                         slot_id_target,
                                         StorageSlot.objects.filter(storage=storage_target,
                                                                    character=character))
            if is_free:
                # Check if slot is stacked
                slot_source = StorageSlot.objects.get(character=character,
                                                      storage=storage_source,
                                                      slot_id=slot_id_source,
                                                      item=item)

                if slot_source.slot_is_stacked:
                    # Get all slots
                    stacked_slots = StorageSlot.objects.filter(character=character,
                                                               storage=storage_source,
                                                               slot_id=slot_id_source,
                                                               slot_is_stacked=True)

                    # Set new storage
                    for slot in stacked_slots:
                        slot.storage = storage_target
                        slot.slot_id = slot_id_target
                        slot.save()

                else:
                    # Set new storage
                    slot_source.storage = storage_target
                    slot_source.slot_id = slot_id_target
                    slot_source.save()

                log.debug('ITEM - Move - Item moved successfully')
                values['CODE'] = utils.result_codes['STORAGE_MOVE_SUCCESSFULLY']

            else:
                log.error('ITEM - Move - Failed, could not move item')
                values['CODE'] = utils.result_codes['STORAGE_MOVE_FAILED_MISC']
        else:
            log.error('ITEM - Move - Failed, could not move item')
            values['CODE'] = utils.result_codes['STORAGE_MOVE_FAILED_MISC']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Move - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_MOVE_FAILED_MISC']

    return values


@login_required
def swap(character, data, values):
    """
    Swap item inside the bag.
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Swap - Called')

        # Encoded json
        encoded = data

        # Get needed values
        item_id = encoded['ITEM']
        storage_id = encoded['STORAGE']
        slot_id_source = encoded['SLOT_SOURCE']
        slot_id_target = encoded['SLOT_TARGET']

        # Get object
        item = Item.objects.get(id=item_id)
        storage = Storage.objects.get(id=storage_id)
        slots = StorageSlot.objects.filter(character=character,
                                           storage=storage)

        # Check if swap is possible
        is_free = check_if_slot_free(storage, item, slot_id_target, slots)

        if is_free:
            log.debug('ITEM - Swap - Slot is free')
            # Check if stacked
            slot = StorageSlot.objects.get(character=character,
                                           storage=storage,
                                           slot_id=slot_id_source,
                                           item=item)

            if slot.slot_is_stacked:
                # Get all slots
                stacked_slots = StorageSlot.objects.filter(character=character,
                                                           storage=storage,
                                                           slot_id=slot_id_source,
                                                           slot_is_stacked=True)

                # Set new storage
                for slot in stacked_slots:
                    slot.slot_id = slot_id_target
                    slot.save()

            else:
                # Set new storage
                slot.slot_id = slot_id_target
                slot.save()

            values['CODE'] = utils.result_codes['STORAGE_SWAP_ITEM_SUCCESSFULLY']

        else:
            log.error('ITEM - Swap - Failed, slot is not free')
            values['CODE'] = utils.result_codes['STORAGE_SWAP_ITEM_FAILED_MISC']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Swap - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_SWAP_ITEM_FAILED_MISC']


@login_required
def stack(character, data, values):
    """
    Stack an item in the storage.
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Stack - Called')

        # Encoded json
        encoded = data

        # Get needed values
        storage_id_source = encoded['STORAGE_SOURCE']
        storage_id_target = encoded['STORAGE_TARGET']
        slot_id_source = encoded['SLOT_SOURCE']
        slot_id_target = encoded['SLOT_TARGET']
        item_ids = encoded['ITEM_IDS']

        # Get storage
        storage_source = Storage.objects.get(id=storage_id_source)
        storage_target = Storage.objects.get(id=storage_id_target)

        # Check for permissions
        if (storage_source.is_bank or storage_source.character == character) and \
                (storage_target.is_bank or storage_target.character == character):

            # item_type
            item_type = Item.objects.get(id=item_ids[0]).master

            # For each item move to target
            for item in item_ids:
                # Get item
                item = Item.objects.get(id=item)

                # Get all slots and check for size
                size = StorageSlot.objects.filter(storage=storage_source,
                                                  slot_id=slot_id_source,
                                                  character=character,
                                                  slot_is_stacked=True).count()

                if (size + len(item_ids)) <= item.master.stack_size and item.master.is_stackable and \
                                item_type == item.master:

                    # Get slot
                    slot = StorageSlot.objects.get(item=item, slot_id=slot_id_source, storage=storage_source)

                    # Save changes
                    slot.slot_id = slot_id_target
                    slot.storage = storage_target

                    slot.slot_is_stacked = True
                    slot.save()
                    log.debug('ITEM - Stack - Item stacked successfully')
                    values['CODE'] = utils.result_codes['STORAGE_STACK_SUCCESSFULLY']

                else:
                    log.error('ITEM - Stack - Failed, to high stack size')
                    values['CODE'] = utils.result_codes['STORAGE_STACK_FAILED_MISC']
        else:
            log.error('ITEM - Stack - Failed, No bank or character bag found')
            values['CODE'] = utils.result_codes['STORAGE_STACK_FAILED_MISC']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Stack - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_STACK_FAILED_MISC']


@login_required
def unstack(character, data, values):
    """
    Unstack items in the storage.
    :param request: The request
    :param data: The data
    :param values: The values
    :return: JSON
    """
    try:
        log.debug('ITEM - Unstack - Called')

        # Encoded json
        encoded = data

        # Get needed values
        storage_id_source = encoded['STORAGE_SOURCE']
        storage_id_target = encoded['STORAGE_TARGET']
        slot_id_source = encoded['SLOT_SOURCE']
        slot_id_target = encoded['SLOT_TARGET']
        item_ids = encoded['ITEM_IDS']

        # Get storage
        storage_source = Storage.objects.get(id=storage_id_source)
        storage_target = Storage.objects.get(id=storage_id_target)

        # Check for permissions
        if (storage_source.is_bank or storage_source.character) and \
                (storage_target.is_bank or storage_target.character == character):

            # item_type
            item_type = Item.objects.get(id=item_ids[0]).master

            # For each item move to target
            for item in item_ids:
                # Get item
                item = Item.objects.get(id=item)

                # Get all slots and check for size
                size = StorageSlot.objects.filter(storage=storage_target,
                                                  slot_id=slot_id_target,
                                                  character=character,
                                                  slot_is_stacked=True).count()

                if (size + len(item_ids)) <= item.master.stack_size and item.master.is_stackable and \
                                item_type == item.master:
                    # Get slot
                    slot = StorageSlot.objects.get(item=item, slot_id=slot_id_source, storage=storage_source)

                    # Save changes
                    slot.slot_id = slot_id_target
                    slot.storage = storage_target

                    if len(item_ids) > 1:
                        slot.slot_is_stacked = True
                    slot.save()
                    log.debug('ITEM - Unstack - Unstacked successfully')
                    values['CODE'] = utils.result_codes['STORAGE_UNSTACK_SUCCESSFULLY']
                else:
                    log.error(
                        'ITEM - Unstack - Unstacked successfully - Size error: site=%i items=%i stack_size=%i is_stackable=%s item_type=%i item_master=%i' % (
                        size, len(item_ids), item.master.stack_size, str(item.master.is_stackable), item_type.id,
                        item.master.id))

                    values['CODE'] = utils.result_codes['STORAGE_UNSTACK_FAILED_MISC']
        else:
            log.error('ITEM - Unstack - Failed, Character does not own the storage or its not a bank')
            values['CODE'] = utils.result_codes['STORAGE_UNSTACK_FAILED_MISC']

    except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
        log.error('ITEM - Unstack - Exception: ' + str(e))
        values['CODE'] = utils.result_codes['STORAGE_UNSTACK_FAILED_MISC']
