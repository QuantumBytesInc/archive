# Python includes
from django.core.management import call_command
from django.http import HttpResponse
import os

def update_all(request):
    if True:
        import uwsgi
        from git import Repo
        from git import Git
        
        git_ssh_identity_file = '/srv/deployment.key'
        os.system('ssh-keyscan -t rsa github.com >> /home/django/.ssh/known_hosts;')
        git_ssh_cmd = 'ssh -i %s' % git_ssh_identity_file
        repo = Repo('/srv/application')
        with repo.git.custom_environment(GIT_SSH_COMMAND=git_ssh_cmd):
            repo.remotes.origin.pull()
        uwsgi.reload()
        call_command('collectstatic', interactive=False, verbosity=3)
        return HttpResponse('Done')
    else:
        return HttpResponse('Not supported')
