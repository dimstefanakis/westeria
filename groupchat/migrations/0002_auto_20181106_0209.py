# Generated by Django 2.0 on 2018-11-06 00:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groupchat', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='groupmessage',
            old_name='user',
            new_name='author',
        ),
    ]