# Generated by Django 4.2 on 2023-05-04 12:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('yourburger', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='permission',
            old_name='module',
            new_name='module_name',
        ),
        migrations.RemoveField(
            model_name='permission',
            name='name',
        ),
    ]