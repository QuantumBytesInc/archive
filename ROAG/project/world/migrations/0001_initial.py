# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-06 17:23
from __future__ import unicode_literals

from datetime import datetime

import django.core.files.storage
import django.db.models.deletion
from django.conf import settings
from django.core.files import File
from django.db import migrations, models
from django.utils.timezone import utc
import project


def forwards_func(apps, schema_editor):
    User = apps.get_registered_model('auth', 'User')
    user = User.objects.get(username='masterchief')

    db_alias = schema_editor.connection.alias

    DateTimeROA = apps.get_registered_model('world', 'DateTimeROA')
    DateTimeROA.objects.create(year=10,
                               month=2,
                               day=12,
                               seconds=0,
                               weather_sync=datetime.utcnow().replace(tzinfo=utc),
                               last_sync=datetime.utcnow().replace(tzinfo=utc)).save()

    Terrain = apps.get_registered_model('world', 'Terrain')
    Terrain.objects.create(name='Westzones',
                           offset_x=-4762.95,
                           offset_y=-908.804,
                           creator=user,
                           created=datetime.utcnow().replace(tzinfo=utc),
                           editor=user,
                           edited=datetime.utcnow().replace(tzinfo=utc))

    Location = apps.get_registered_model('world', 'Location')

    Location.objects.using(db_alias).bulk_create([
        Location(name='Outlands',
                 area='Westzones',
                 logo=(File(open('project/gui/source/image/location/default.png', 'rb'))),
                 terrain=Terrain.objects.get(name='Westzones'),
                 creator=user,
                 created=datetime.utcnow().replace(tzinfo=utc),
                 editor=user,
                 edited=datetime.utcnow().replace(tzinfo=utc)),
        Location(name='Dunottar',
                 area='Westzones',
                 logo=(File(open('project/gui/source/image/location/default.png', 'rb'))),
                 terrain=Terrain.objects.get(name='Westzones'),
                 creator=user,
                 created=datetime.utcnow().replace(tzinfo=utc),
                 editor=user,
                 edited=datetime.utcnow().replace(tzinfo=utc))
    ])

    Weather = apps.get_registered_model('world', 'Weather')

    Weather.objects.using(db_alias).bulk_create([
        Weather(name='Sunny',
                clouds=0,
                fog=0,
                rain=0,
                snow=0,
                wind=0,
                active=True,
                creator=user,
                created=datetime.utcnow().replace(tzinfo=utc),
                editor=user,
                edited=datetime.utcnow().replace(tzinfo=utc)),
        Weather(name='Rainy',
                clouds=2,
                fog=2,
                rain=2,
                snow=0,
                wind=2,
                active=False,
                creator=user,
                created=datetime.utcnow().replace(tzinfo=utc),
                editor=user,
                edited=datetime.utcnow().replace(tzinfo=utc)),
    ])


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('item', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='DateTimeROA',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField(verbose_name='Year')),
                ('month', models.IntegerField(verbose_name='Month')),
                ('day', models.IntegerField(verbose_name='Day')),
                ('seconds', models.IntegerField(verbose_name='Seconds')),
                ('weather_sync', models.DateTimeField(blank=True, null=True, verbose_name='Last sync')),
                ('last_sync', models.DateTimeField(editable=False, verbose_name='Last synced')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Location name')),
                ('area', models.CharField(max_length=50, verbose_name='Area name')),
                ('logo',
                 models.ImageField(default='None', upload_to=project.item.models.UploadToPathAndRename('images/location'), verbose_name='Location logo')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_loc', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_loc', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
            options={
                'verbose_name_plural': 'Locations',
            },
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(verbose_name='Max spawn of this resource')),
                ('image', models.ImageField(default='None', storage=django.core.files.storage.FileSystemStorage(
                    location='/srv/gui_data/media/images/resource_maps/'), upload_to=project.item.models.UploadToPathAndRename('images/resouce'),
                                            verbose_name='Spawn map')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_res', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_res', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
        ),
        migrations.CreateModel(
            name='ResourceLayer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='Resource layer name')),
                ('layer', models.IntegerField(default=0, verbose_name='Layer level')),
                ('amount', models.IntegerField(default=0, verbose_name='Max amount')),
                ('consumed', models.IntegerField(default=0, verbose_name='Consumed amount (leave empty))')),
                ('template', models.BooleanField(default=False, verbose_name='Is template')),
                ('surface', models.CharField(max_length=100, verbose_name='Surface name')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_reslay', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_reslay', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
                ('item_result', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.ItemTemplate',
                                                  verbose_name='Result item')),
            ],
        ),
        migrations.CreateModel(
            name='ResourceSpawned',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField(default=0, verbose_name='X coordinate')),
                ('y', models.IntegerField(default=0, verbose_name='Y coordinate')),
                ('deleted', models.BooleanField(default=False, verbose_name='Is resource deleted?')),
                ('layers', models.ManyToManyField(to='world.ResourceLayer')),
            ],
        ),
        migrations.CreateModel(
            name='ResourceTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='Resource template name')),
                ('node', models.CharField(max_length=200, verbose_name='Resource node path and name')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_restemp', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_restemp', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
        ),
        migrations.CreateModel(
            name='Season',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_seas', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_seas', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
            options={
                'verbose_name_plural': 'Seasons',
            },
        ),
        migrations.CreateModel(
            name='Terrain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='Terrain name')),
                ('offset_x', models.IntegerField(default=0, verbose_name='Offset x to world')),
                ('offset_y', models.IntegerField(default=0, verbose_name='Offset y to world')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_ter', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_ter', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
        ),
        migrations.CreateModel(
            name='Weather',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('clouds',
                 models.IntegerField(choices=[(0, 'Disabled'), (1, 'Low'), (2, 'Mid'), (3, 'Height')], default=0,
                                     verbose_name='Clouds')),
                ('fog', models.IntegerField(choices=[(0, 'Disabled'), (1, 'Low'), (2, 'Mid'), (3, 'Strong')], default=0,
                                            verbose_name='Fog')),
                ('rain',
                 models.IntegerField(choices=[(0, 'Disabled'), (1, 'Low'), (2, 'Mid'), (3, 'Strong')], default=0,
                                     verbose_name='Rain')),
                ('snow',
                 models.IntegerField(choices=[(0, 'Disabled'), (1, 'Low'), (2, 'Mid'), (3, 'Strong')], default=0,
                                     verbose_name='Snow')),
                ('wind',
                 models.IntegerField(choices=[(0, 'Disabled'), (1, 'Low'), (2, 'Mid'), (3, 'Strong')], default=0,
                                     verbose_name='Wind')),
                ('active', models.BooleanField(default=False, verbose_name='Active')),
                ('created', models.DateTimeField(editable=False, verbose_name='Created on')),
                ('edited', models.DateTimeField(editable=False, verbose_name='Edited on')),
                ('creator', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                              related_name='user_creator_weath', to=settings.AUTH_USER_MODEL,
                                              verbose_name='Creator')),
                ('editor', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='user_editor_weath', to=settings.AUTH_USER_MODEL,
                                             verbose_name='Editor')),
            ],
            options={
                'verbose_name_plural': 'Weathers',
            },
        ),
        migrations.AddField(
            model_name='resourcespawned',
            name='master',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='world.ResourceTemplate',
                                    verbose_name='Resource template'),
        ),
        migrations.AddField(
            model_name='resourcespawned',
            name='terrain',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='world.Terrain',
                                    verbose_name='Terrain'),
        ),
        migrations.AddField(
            model_name='resourcelayer',
            name='resource',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='world.ResourceTemplate',
                                    verbose_name='ResourceTemplate'),
        ),
        migrations.AddField(
            model_name='resource',
            name='template',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='world.ResourceTemplate',
                                    verbose_name='Resource template'),
        ),
        migrations.AddField(
            model_name='resource',
            name='terrain',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                    to='world.Terrain'),
        ),
        migrations.AddField(
            model_name='location',
            name='terrain',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='world.Terrain',
                                    verbose_name='Terrain'),
        ),
        migrations.RunPython(forwards_func, ),
    ]
