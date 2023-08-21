# Generated by Django 4.2.1 on 2023-08-15 13:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('yourburger', '0013_alter_detallepermiso_roleid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='yourburger.products'),
        ),
        migrations.AlterField(
            model_name='content',
            name='supplies',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='yourburger.supplies'),
        ),
        migrations.AlterField(
            model_name='contentorder',
            name='supplies',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='yourburger.supplies'),
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='yourburger.user'),
        ),
        migrations.AlterField(
            model_name='user',
            name='document',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='lastname',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]