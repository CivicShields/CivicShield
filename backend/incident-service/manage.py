#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Couldn't import Django...") from exc

    # --- ADD THIS CONFIGURATION BLOCK HERE ---
    # If the user runs 'runserver' and didn't manually pass a port number...
    if 'runserver' in sys.argv and len(sys.argv) == 2:
        from django.conf import settings
        # Read the port from settings.py, fallback to 8000 if not defined
        custom_port = getattr(settings, 'DEVELOPMENT_PORT', '8002')
        sys.argv.append(custom_port)
    # ----------------------------------------

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
