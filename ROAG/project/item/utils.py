# Copyright (C) 2015 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import sqlite3
import os
import logging

# Model imports
from project.item.models import ItemTemplate, StorageTemplate
from project.world.models import Location

# Set logging
log = logging.getLogger(__name__)


def check_if_slot_free(storage, item, slot_id, slots):
    """
    Check if space is free in storage for item.
    :param storage: The storage
    :param item: The item
    :param slot_id: The target slot id
    :param slots: The slots already used
    :return:
    """
    free_storage = True
    # 10 + 1 /
    pos_y = slot_id / storage.master.width
    pos_x = slot_id % storage.master.height

    if (pos_x + item.master.width - 1 <= storage.master.width * storage.master.page_size) and (pos_y + item.master.height - 1 <= storage.master.height * storage.master.page_size) and (slot_id < (storage.master.height*storage.master.width*storage.master.page_size)):
        for slot in slots:
            x_start = slot.slot_id % storage.master.height
            x_end = (slot.item.master.width + slot.slot_id - 1) % storage.master.height
            y_start = slot.slot_id / storage.master.width
            y_end = (slot.item.master.height + slot.slot_id - 1) / storage.master.width

            # Check basic width and height
            if (x_start <= pos_x <= x_end and y_start <= pos_y <= y_end) or \
                    (x_start <= (pos_x + slot.item.master.width - 1) <= x_end and y_start <= (pos_y + slot.item.master.height - 1) <= y_end):
                log.error('x_start: %s / x_end: %s / y_start: %s / y_end: %s / pos_x: %s / pos_y: %s' % (x_start, x_end, y_start, y_end, pos_x, pos_y))
                free_storage = False
                break
    else:
        if not ((pos_x + item.master.width - 1 <= storage.master.width * storage.master.page_size) and (pos_y + item.master.height - 1 <= storage.master.height * storage.master.page_size)):
            if not (pos_x + item.master.width - 1 <= storage.master.width * storage.master.page_size):
                log.error('Width does not match: %s is not <= %s' % (pos_x + item.master.width - 1, storage.master.width * storage.master.page_size))
            else:
                log.error('Height does not match: %s is not <= %s' % (pos_y + item.master.height - 1, storage.master.height * storage.master.page_size))
        else:
            if not slot_id < storage.master.height*storage.master.width*storage.master.page_size:
                log.error('Slot does not exists: %s is not < %s' % (slot_id, storage.master.height*storage.master.width*storage.master.page_size))
            else:
                log.error('Unknown validation error')

        free_storage = False

    return free_storage


def export_templates_to_sqlite():
    try:
        if not os.path.exists('project/gui/static/gui/sqlite/'):
            os.makedirs('project/gui/static/gui/sqlite/')

        # Connect
        connection = sqlite3.connect('project/gui/static/gui/sqlite/exports.sqlite')
        cursor = connection.cursor()

        # Create tables
        cursor.execute('CREATE TABLE ItemTemplate('
                       '  id INT, '
                       '  name TEXT, '
                       '  height INT, '
                       '  width INT, '
                       '  weight INT, '
                       '  stack_size INT, '
                       '  is_stackable INT, '
                       '  icon TEXT, '
                       '  icon_taskbar TEXT)')

        cursor.execute('CREATE TABLE StorageTemplate('
                       '  id INT, '
                       '  height INT, '
                       '  width INT, '
                       '  weight INT, '
                       '  image TEXT, '
                       '  page_size INT, '
                       '  start_x INT, '
                       '  start_y INT)')

        cursor.execute('CREATE TABLE Location('
                       '  id INT, '
                       '  name TEXT, '
                       '  area TEXT,'
                       '  logo TEXT)')

        connection.commit()

        # Fill table
        for item in ItemTemplate.objects.all():
            cursor.execute("INSERT INTO ItemTemplate VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
                           (item.id, item.name, item.height, item.width, item.weight, item.stack_size,
                            item.is_stackable, item.icon.name, item.icon_taskbar.name))

        for storage in StorageTemplate.objects.all():
            cursor.execute("INSERT INTO StorageTemplate VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
                           (storage.id, storage.height, storage.width, storage.weight,
                            storage.image.name, storage.page_size, storage.start_x, storage.start_y))

        for location in Location.objects.all():
            cursor.execute("INSERT INTO Location VALUES(?, ?, ?, ?)",
                           (location.id, location.name, location.area, location.logo.name))

        # Finished
        connection.commit()

        # print("SQLite version: %s" % data)

    except Exception as e:
        print(e.message)
