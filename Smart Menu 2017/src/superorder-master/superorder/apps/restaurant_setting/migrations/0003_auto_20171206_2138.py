# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-12-06 13:38
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant_setting', '0002_auto_20171127_2219'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='food',
            options={'ordering': ['id']},
        ),
    ]
