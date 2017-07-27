# Python includes
import os
from django.core.management import call_command
from django.http import HttpResponse
from git import Repo
from git import Git

def sync_cloud(request):
    git_ssh_identity_file = '/srv/deployment.key'
    os.system('ssh-keyscan -t rsa github.com >> /home/django/.ssh/known_hosts;')
    git_ssh_cmd = 'ssh -i %s' % git_ssh_identity_file
    repo = Repo('/srv/application')
    with repo.git.custom_environment(GIT_SSH_COMMAND=git_ssh_cmd):
        repo.remotes.origin.pull()
    call_command('collectstatic', interactive=False, verbosity=3)
    try:
        import uwsgi
        uwsgi.reload()
    except:
        None
    return HttpResponse('Done')

def fetch(request):
    git_ssh_identity_file = '/srv/deployment.key'
    os.system('ssh-keyscan -t rsa github.com >> /home/django/.ssh/known_hosts;')
    git_ssh_cmd = 'ssh -i %s' % git_ssh_identity_file
    repo = Repo('/srv/application')
    with repo.git.custom_environment(GIT_SSH_COMMAND=git_ssh_cmd):
        repo.remotes.origin.pull()
    try:
        import uwsgi
        uwsgi.reload()
    except:
        None
    return HttpResponse('Done')
