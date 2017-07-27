# -*- coding: utf-8 -*-
#
from __future__ import unicode_literals

from datetime import datetime

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
from django.utils.timezone import utc


def forwards_func(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    User = apps.get_registered_model('auth', 'User')
    user = User.objects.get(username='masterchief')

    Channel = apps.get_model("communication", "Channel")

    db_alias = schema_editor.connection.alias

    # Create basic channels
    Channel.objects.using(db_alias).bulk_create([
        Channel(name='storage', creator=user, created=datetime.utcnow().replace(tzinfo=utc), editor=user,
                edited=datetime.utcnow().replace(tzinfo=utc)),
    ])


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('communication', '0002_auto_20170609_1432'),
    ]
    operations = [
        migrations.RunPython(forwards_func, ),
    ]
