#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    if os.environ.get("APP_ENVIRONMENT", "") != '':
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.base")
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.local_base")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

