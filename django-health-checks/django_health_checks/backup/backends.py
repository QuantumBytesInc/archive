import datetime
from io import StringIO
from django.core.management import call_command
from health_check.backends import BaseHealthCheckBackend
from health_check.exceptions import (
    ServiceReturnedUnexpectedResult, ServiceUnavailable
)


class BackupBackend(BaseHealthCheckBackend):

    def check_status(self):
        # Buffer
        out = StringIO()
        
        # Get current backups
        call_command('listbackups', stdout=out)
        backups = out.getvalue().split('\n')
        
        # Find current backup, not older then 30 minutes
        now = datetime.datetime.now() - datetime.timedelta(minutes=60)
        curr = now.strftime("%m/%d/%y")
        matching = [s for s in backups if curr in s]
        sets = [i.split(' ') for i in matching]
        sets.sort(key=lambda x: x[2])
        
        if now < datetime.datetime.strptime(sets[-1][1] + ' ' + sets[-1][2], '%m/%d/%y %H:%M:%S'):
            pass
        else:
            raise ServiceUnavailable('Backup out of date')

    def identifier(self):
        return self.__class__.__name__
