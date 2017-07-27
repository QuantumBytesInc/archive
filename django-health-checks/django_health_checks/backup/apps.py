# -*- coding: utf-8 -*-
from django.apps import AppConfig

from health_check.plugins import plugin_dir


class HealthCheckConfig(AppConfig):
    name = 'django_health_checks.backup'

    def ready(self):
        from .backends import BackupBackend
        plugin_dir.register(BackupBackend)
