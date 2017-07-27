# Copyright (C) 2016 Quantum Bytes Inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

import datetime
from django import forms
from django.utils.timezone import utc
from snowpenguin.django.recaptcha2.fields import ReCaptchaField
from snowpenguin.django.recaptcha2.widgets import ReCaptchaWidget
from django.core.exceptions import ObjectDoesNotExist
from project.user.models import User


class Activate(forms.Form):
    token = forms.CharField(widget=forms.HiddenInput())
    password1 = forms.CharField(label="Password",
                                widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm password",
                                widget=forms.PasswordInput,
                                help_text="Enter the same password as above, for verification.")
    captcha = ReCaptchaField(widget=ReCaptchaWidget(size="invisible",), label='')

    def clean_token(self):
        token = self.cleaned_data.get('token')

        try:
            user = User.objects.get(activation_code=token)

            if user.date_joined > datetime.datetime.utcnow().replace(tzinfo=utc) + datetime.timedelta(
                    days=7):
                raise forms.ValidationError(
                    'Token is to old, please start account recovery',
                    code='token_to_old'
                )

            if user.is_activated:
                raise forms.ValidationError(
                    'User already activated',
                    code='already_activated'
                )

        except ObjectDoesNotExist:
            raise forms.ValidationError(
                'Invalid token, please request a new recovery token',
                code='token_invalid'
            )

        return token

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                'Password mismatch',
                code='password_mismatch',
            )
        return password2


class Reset(forms.Form):
    account_mail = forms.EmailField(label='E-Mail', max_length=100)
    captcha = ReCaptchaField(widget=ReCaptchaWidget(size="invisible",), label='')


class Password(forms.Form):
    error_messages = {
        'password_mismatch': "The two password fields didn't match.",
    }
    password1 = forms.CharField(label="Password",
                                widget=forms.PasswordInput)
    password2 = forms.CharField(label="Password confirmation",
                                widget=forms.PasswordInput,
                                help_text="Enter the same password as above, for verification.")
    captcha = ReCaptchaField(widget=ReCaptchaWidget(size="invisible",), label='')
    token = forms.CharField(widget=forms.HiddenInput())

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        return password2

    def clean_token(self):
        token = self.cleaned_data.get('token')

        try:

            user = User.objects.get(password_recovery_token=token)

            if not user.needs_reactivation:
                raise forms.ValidationError(
                    'No recovery process started',
                    code='no_recovery',
                )

            if user.password_recovery_date > datetime.datetime.utcnow().replace(tzinfo=utc) + datetime.timedelta(
                    minutes=5):
                raise forms.ValidationError(
                    'Token is to old, please request a new recovery token',
                    code='token_to_old',
                )

        except ObjectDoesNotExist:
            raise forms.ValidationError(
                'Invalid token, please request a new recovery token',
                code='token_invalid',
            )
        return token
