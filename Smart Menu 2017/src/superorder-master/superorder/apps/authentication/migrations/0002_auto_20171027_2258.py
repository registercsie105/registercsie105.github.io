# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-10-27 14:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='restaurant',
            options={'permissions': (('can_manage_restaurant', 'Can manage restaurant'),)},
        ),
    ]
