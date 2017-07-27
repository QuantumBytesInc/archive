# Copyright (C) 2016 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.db import models
from django.contrib.auth.models import AbstractUser

# Third party includes

from countries_plus.models import Country
from languages_plus.models import Language


class User(AbstractUser):
    """
    Custom user class
    """
    # Possible genders
    GENDERS = (
        ('MAL', 'Male'),
        ('FEM', 'Female'),
    )  #: Possible genders

    # Address stuff
    country = models.ForeignKey(Country, verbose_name="Country", null=True)  #: Countries
    city = models.CharField(max_length=50, verbose_name="City", null=True)  #: City
    state = models.CharField(max_length=50, verbose_name="State", null=True)  #: State
    street = models.CharField(max_length=50, verbose_name="Street", null=True)  #: Street
    zipcode = models.CharField(max_length=50, verbose_name="ZIP Code", null=True)  #: Zip code

    # Person
    birth_date = models.DateField(verbose_name="Birth date", null=True)  #: Birth date
    sex = models.CharField(max_length=3, choices=GENDERS, verbose_name="Sex", null=True)  #: Sex

    # Activation
    activation_code = models.CharField(max_length=64, verbose_name="Activation code", null=True)  #: Activation code
    activation_ip = models.GenericIPAddressField(null=True, verbose_name="Activation IP")  #: Activation IP
    activation_date = models.DateTimeField(null=True, verbose_name="Activation date")  #: Activation date

    # Contact options
    language = models.ForeignKey(Language, verbose_name="Display language", null=True)  #: Language
    prerequisites = models.BooleanField(verbose_name="NDA/PP accepted")  #: NDA/PP accepted

    # Password recovery security
    password_recovery_date = models.DateTimeField(null=True, verbose_name="Last password recovery requested date")
    password_recovery_token = models.CharField(null=True, max_length=64, verbose_name="Password recovery token")

    # Account state
    is_locked = models.BooleanField(verbose_name="Account is disabled trough security breach")
    is_deleted = models.BooleanField(verbose_name="Account was deleted by user")
    is_banned = models.BooleanField(verbose_name="Account is banned")
    is_activated = models.BooleanField(verbose_name="Account is activated")  #: Activation state
    needs_reactivation = models.BooleanField(verbose_name="Account needs to be reactivated")

    def __unicode__(self):
        """Model name for displaying
        :return: Object name with user string
        """
        return u'%s' % self.username


class Login(models.Model):
    """
    Login class for monitoring.
    """
    successfully = models.BooleanField(verbose_name="Login was successfully")  #: Login state
    user = models.ForeignKey(User, verbose_name="User object", editable=False, null=False)  #: The user object
    date = models.DateField(verbose_name="Login date", null=True)  #: Date
    ip = models.GenericIPAddressField(verbose_name="Login IP")  #: IP-Address
    outdated = models.BooleanField(verbose_name="Outdated login information")  #: Outdated through reactivation

    class Meta:
        # Plural name
        verbose_name_plural = 'User logins'


class LoginFailed(models.Model):
    """
    Token class for authentication handling.
    """
    count = models.IntegerField(default=0)  #: The counter
    user = models.ForeignKey(User, verbose_name="User", editable=False, null=False)  #:

    def __unicode__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.count

    class Meta:
        # Plural name
        verbose_name_plural = 'Failed logins'