"""
WSGI config for cinerate project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import shutil
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# VERCEL Ephemeral SQLite Hack
if os.environ.get('VERCEL') == '1':
    BASE_DIR = Path(__file__).resolve().parent.parent
    tmp_db_path = '/tmp/db.sqlite3'
    local_db_path = BASE_DIR / 'db.sqlite3'
    
    # Jika database di /tmp belum ada, salin dari versi lokal
    if not os.path.exists(tmp_db_path):
        try:
            if local_db_path.exists():
                shutil.copy2(local_db_path, tmp_db_path)
            else:
                # Buat file kosong jika tidak ada database sama sekali
                Path(tmp_db_path).touch()
        except Exception:
            pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinerate.settings')

application = get_wsgi_application()
