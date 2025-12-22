import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

# Contar estudiantes
students = User.objects.filter(role='student')
count = students.count()

print(f"\n{'='*60}")
print(f"Total de estudiantes registrados: {count}")
print('='*60)

if count > 0:
    print("\nEstudiantes:")
    for student in students:
        print(f"- {student.username} ({student.email}) - ID: {student.id}")
else:
    print("\nNo hay estudiantes registrados en la base de datos.")
    
print('='*60 + "\n")
