from django.contrib.auth.models import User

def sync_user(tree):
    username = tree[0][0].text
    user, user_created = User.objects.get_or_create(username=username)
    user.email = tree[0][1][0].text
    user.save()
