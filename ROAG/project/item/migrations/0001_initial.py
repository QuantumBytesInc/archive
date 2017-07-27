# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-06 17:30
from __future__ import unicode_literals

from datetime import datetime

import django.db.models.deletion
from django.conf import settings
from django.core.files import File
from django.db import migrations, models
from django.utils.timezone import utc
import project


def forwards_func(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    User = apps.get_registered_model('auth', 'User')
    user = User.objects.get(username='masterchief')

    ItemTemplate = apps.get_model("item", "ItemTemplate")
    StorageTemplate = apps.get_model("item", "StorageTemplate")

    db_alias = schema_editor.connection.alias

    # Create basic channels
    ItemTemplate.objects.using(db_alias).bulk_create([
        ItemTemplate(name='flower',
                     height=1,
                     width=1,
                     weight=1.0,
                     comment='auto generated, do not edit!',
                     node_name='FIXME',
                     stack_size=10,
                     is_stackable=True,
                     icon=(File(open('project/gui/source/image/items/flower_icon.png', 'rb'))),
                     icon_taskbar=(File(open('project/gui/source/image/items/flower_taskbar.png', 'rb'))),
                     type=0,
                     creator=user,
                     created=datetime.utcnow().replace(tzinfo=utc),
                     editor=user,
                     edited=datetime.utcnow().replace(tzinfo=utc)),
        ItemTemplate(name='bag',
                     height=1,
                     width=1,
                     weight=5.0,
                     comment='auto generated, do not edit!',
                     node_name='FIXME',
                     stack_size=0,
                     is_stackable=False,
                     icon=(File(open('project/gui/source/image/items/bag_icon.png', 'rb'))),
                     icon_taskbar=(File(open('project/gui/source/image/items/bag_taskbar.png', 'rb'))),
                     type=1,
                     creator=user,
                     created=datetime.utcnow().replace(tzinfo=utc),
                     editor=user,
                     edited=datetime.utcnow().replace(tzinfo=utc)),

    ])

    # Create basic channels
    StorageTemplate.objects.using(db_alias).bulk_create([
        StorageTemplate(name='bag',
                        height=5,
                        width=4,
                        weight=5.0,
                        comment='auto generated, do not edit!',
                        page_size=1,
                        image=(File(open('project/gui/source/image/storage/bag.png', 'rb'))),
                        start_x=19.0,
                        start_y=20.0,
                        creator=user,
                        created=datetime.utcnow().replace(tzinfo=utc),
                        editor=user,
                        edited=datetime.utcnow().replace(tzinfo=utc)),
    ])


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15, verbose_name='Item name')),
                ('height', models.IntegerField(default=0, verbose_name='Height')),
                ('width', models.IntegerField(default=0, verbose_name='Width')),
                ('weight', models.FloatField(default=0, verbose_name='Weight')),
                ('is_static', models.BooleanField(default=False, verbose_name='Game is owner of this item')),
                ('is_stored', models.BooleanField(default=False, verbose_name='Item is in storage')),
                ('deleted', models.BooleanField(default=False, verbose_name='Deleted')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('character', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                                related_name='item_character', to='account.Character',
                                                verbose_name='Character')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_item', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_item', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
            options={
                'verbose_name_plural': 'Items',
            },
        ),
        migrations.CreateModel(
            name='ItemTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15, verbose_name='Item name')),
                ('height', models.IntegerField(default=0, verbose_name='Height')),
                ('width', models.IntegerField(default=0, verbose_name='Width')),
                ('weight', models.FloatField(default=0, verbose_name='Weight')),
                ('comment', models.TextField(null=True, verbose_name='Comment')),
                ('node_name', models.TextField(null=True, verbose_name='Node name')),
                ('stack_size', models.IntegerField(null=True, verbose_name='Max. stack size')),
                ('is_stackable', models.BooleanField(default=False, verbose_name='Can be stacked')),
                ('icon', models.ImageField(default='None', upload_to=project.item.models.UploadToPathAndRename('images/item/template'))),
                ('icon_taskbar', models.ImageField(default='None', upload_to=project.item.models.UploadToPathAndRename('images/item/template'))),
                ('type', models.IntegerField(
                    choices=[(0, 'Resource'), (1, 'Storage'), (2, 'Weapon'), (3, 'Tool'), (3, 'Static (World)')],
                    verbose_name='The item type')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_itemp', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_itemp', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
            options={
                'verbose_name_plural': 'Item Templates',
            },
        ),
        migrations.CreateModel(
            name='Storage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.IntegerField(default=0, verbose_name='Max. weight')),
                ('is_bank', models.BooleanField(default=False, verbose_name='Is bank? (unlimited)')),
                ('is_equipped', models.BooleanField(default=False, verbose_name='Is equipped?')),
                ('comment', models.TextField(blank=True, null=True, verbose_name='Comment')),
                ('page_size', models.IntegerField(default=1, verbose_name='Page size allowed')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('character',
                 models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='account.Character',
                                   verbose_name='Owning character')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_stor', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_stor', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.Item',
                                           verbose_name='Item (Storage)')),
            ],
            options={
                'verbose_name_plural': 'Storage',
            },
        ),
        migrations.CreateModel(
            name='StorageSlot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slot_is_stacked', models.BooleanField(default=False, verbose_name='Stacked slot')),
                ('slot_id', models.IntegerField(default=0, verbose_name='Slot id')),
                ('page', models.IntegerField(null=True, verbose_name='Page')),
                ('character', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                                related_name='storage_slot_character', to='account.Character',
                                                verbose_name='Character')),
                ('item',
                 models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.Item', verbose_name='Item')),
                ('storage', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='item.Storage',
                                              verbose_name='Storage')),
            ],
        ),
        migrations.CreateModel(
            name='StorageTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15, verbose_name='Name')),
                ('height', models.IntegerField(default=0, verbose_name='Max. Height')),
                ('width', models.IntegerField(default=0, verbose_name='Max. Width')),
                ('weight', models.IntegerField(default=0, verbose_name='Max. weight')),
                ('comment', models.TextField(null=True, verbose_name='Comment')),
                ('page_size', models.IntegerField(null=True, verbose_name='Page size allowed')),
                ('image', models.ImageField(default='None', upload_to=project.item.models.UploadToPathAndRename('images/storage/template'))),
                ('start_x', models.FloatField(default=0.0, verbose_name='x offset')),
                ('start_y', models.FloatField(default=0.0, verbose_name='y offset')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_stotem', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_stotem', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
            options={
                'verbose_name_plural': 'Storage Templates',
            },
        ),
        migrations.AddField(
            model_name='storage',
            name='master',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='item.StorageTemplate',
                                    verbose_name='Master template'),
        ),
        migrations.AddField(
            model_name='item',
            name='master',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.ItemTemplate',
                                    verbose_name='Master template'),
        ),
        migrations.RunPython(forwards_func, ),
    ]
