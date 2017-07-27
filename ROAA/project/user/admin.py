from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm
from project.user.models import User


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm

    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('country',
                               'city',
                               'state',
                               'street',
                               'zipcode',
                               'birth_date',
                               'sex',
                               'activation_code',
                               'activation_ip',
                               'activation_date',
                               'language',
                               'prerequisites',
                               'password_recovery_date',
                               'password_recovery_token',
                               'is_locked',
                               'is_deleted',
                               'is_banned',
                               'is_activated',
                               'needs_reactivation',)}),
    )

admin.site.register(User, CustomUserAdmin)
