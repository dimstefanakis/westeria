# Generated by Django 2.0 on 2018-07-29 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0002_auto_20180729_0132'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='name',
            field=models.CharField(default='unnamed', max_length=30),
        ),
        migrations.AddField(
            model_name='group',
            name='tag',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
