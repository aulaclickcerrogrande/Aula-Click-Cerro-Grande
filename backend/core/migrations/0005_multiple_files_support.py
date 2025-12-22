# Migration to convert single file fields to multiple files arrays

from django.db import migrations, models
import json


def convert_single_to_array(apps, schema_editor):
    """Convert existing single file URLs to arrays"""
    Lesson = apps.get_model('core', 'Lesson')
    for lesson in Lesson.objects.all():
        # Convert each old field to array format
        if hasattr(lesson, 'pdf_file') and lesson.pdf_file:
            lesson.pdf_files = [lesson.pdf_file]
        else:
            lesson.pdf_files = []
            
        if hasattr(lesson, 'docx_file') and lesson.docx_file:
            lesson.docx_files = [lesson.docx_file]
        else:
            lesson.docx_files = []
            
        if hasattr(lesson, 'xlsx_file') and lesson.xlsx_file:
            lesson.xlsx_files = [lesson.xlsx_file]
        else:
            lesson.xlsx_files = []
            
        if hasattr(lesson, 'pptx_file') and lesson.pptx_file:
            lesson.pptx_files = [lesson.pptx_file]
        else:
            lesson.pptx_files = []
            
        lesson.save()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_passwordreset'),
    ]

    operations = [
        # Add new JSONField columns
        migrations.AddField(
            model_name='lesson',
            name='pdf_files',
            field=models.JSONField(blank=True, default=list, help_text='Lista de URLs de archivos PDF'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='docx_files',
            field=models.JSONField(blank=True, default=list, help_text='Lista de URLs de archivos DOCX'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='xlsx_files',
            field=models.JSONField(blank=True, default=list, help_text='Lista de URLs de archivos XLSX'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='pptx_files',
            field=models.JSONField(blank=True, default=list, help_text='Lista de URLs de archivos PPTX'),
        ),
        # Migrate data from old fields to new
        migrations.RunPython(convert_single_to_array, migrations.RunPython.noop),
        # Remove old fields
        migrations.RemoveField(
            model_name='lesson',
            name='pdf_file',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='docx_file',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='xlsx_file',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='pptx_file',
        ),
    ]
