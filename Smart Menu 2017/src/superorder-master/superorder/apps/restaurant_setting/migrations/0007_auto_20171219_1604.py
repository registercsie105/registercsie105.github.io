# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-12-19 08:04
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant_setting', '0006_order_belltime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='creation_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
