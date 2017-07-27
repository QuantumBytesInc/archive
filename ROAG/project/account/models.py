# Copyright (C) 2014 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django imports
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

# Third party imports
from concurrency.fields import IntegerVersionField


class Character(models.Model):
    """
    Character class for in-game characters.
    """
    # General
    name_first = models.CharField(max_length=15, verbose_name="First name")  #: First name
    name_last = models.CharField(max_length=15, verbose_name="Last name")  #: Last name
    nickname = models.CharField(max_length=15, verbose_name="Nickname", default='None')  #: Nickname

    # Game related
    position = models.CharField(max_length=100, verbose_name="Character position")   #: Current character position
    location = models.ForeignKey('world.Location', verbose_name="Current location")  #: Current location
    slot = models.IntegerField(verbose_name="Slot ID", editable=True, null=True)    #: Slot for GUI 3D
    is_spawned = models.BooleanField(verbose_name="Is currently spawned in the world", editable=True,
                                     null=False, default=False)   #: Flag if char is currently spawned

    # Related user
    user = models.ForeignKey(User, verbose_name="User")  #: The related user who owns the character

    # State
    deleted = models.BooleanField(verbose_name="Deleted", default=False)

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_char", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_char", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s (%s, %s)' % (self.nickname, self.name_first, self.name_last)

    class Meta:
        # Plural name
        verbose_name_plural = 'Characters'


class Token(models.Model):
    """
    Token class for authentication handling.
    """
    token = models.CharField(max_length=32)  #: The token
    user = models.ForeignKey(User, verbose_name="User", editable=False, null=False)  #: The user

    # Auditing
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=True)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.token

    class Meta:
        # Plural name
        verbose_name_plural = 'Tokens'


class Control(models.Model):
    """
    Control class for character interaction.
    """
    FUNCTION_CHOICES = (
        (0, 'move_forward'),
        (1, 'move_backward'),
        (2, 'move_left'),
        (3, 'move_right'),
        (4, 'jump'),
        (5, 'crouch'),
        (6, 'torch'),
        (7, 'pickaxe'),
    )

    # Key
    function = models.IntegerField(choices=FUNCTION_CHOICES, verbose_name="Key function")
    key = models.IntegerField(verbose_name="Key as character ascii")

    # User
    user = models.ForeignKey(User, verbose_name="User")  #: The related user who owns the settings

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_con", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_con", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % str(self.FUNCTION_CHOICES[self.function])

    class Meta:
        # Plural name
        verbose_name_plural = 'Controls'


class Setting(models.Model):
    """
    Setting class for storing user settings.
    """
    RESOLUTION_CHOICES = (
        (3, '1280x720'),
        (4, '1366x768'),
        (5, '1600x900'),
        (6, '1920x1080'),
        (7, '2560x1440'),
        (11, '1280x800'),
        (12, '1440x900'),
        (13, '1680x1050'),
        (14, '1920x1200'),
        (15, '2560x1600'),
        (19, '1280x960'),
        (20, '1280x1024'),
        (21, '1600x1200'),
        (22, '2048x1536'),
        (23, '2560x2048'),
        (-1, 'Custom'),
    )

    OCCLUSION_CHOICES = (
        (0, 'Disabled'),
        (1, 'Ambient occlusion'),
        (2, 'Light occlusion'),
        (3, 'Both (GI)'),
    )

    SHADER_CHOICES = (
        (0, 'Low'),
        (1, 'Medium'),
        (2, 'High'),
    )

    TEXTURE_CHOICES = (
        (0, 'Low'),
        (1, 'Medium'),
        (2, 'High'),
    )

    ANISOTROPY_CHOICES = (
        (0, 'Level 1'),
        (1, 'Level 2'),
        (2, 'Level 4'),
        (3, 'Level 8'),
        (4, 'Level 16'),
    )

    MULTISAMPLE_CHOICES = (
        (0, 'No anti-aliasing'),
        (1, '2x anti-aliasing'),
        (2, '4x anti-aliasing'),
        (3, '8x anti-aliasing'),
        (4, '16x anti-aliasing'),
    )

    SFX_CHOICES = (
        (0, 'Disabled'),
        (1, 'Light'),
        (2, 'Fancy'),
        (3, 'Shiny'),
    )

    PROFILE_CHOICES = (
        (0, 'Low'),
        (1, 'Medium'),
        (2, 'High'),
        (3, 'Custom'),
    )

    # Normal values
    distance = models.FloatField(
        validators=[MinValueValidator(50),
                    MaxValueValidator(200)],
        default=100,
        verbose_name="View distance"
    )

    gamma = models.FloatField(
        validators=[MinValueValidator(0.5),
                    MaxValueValidator(3.5)],
        default=1.0,
        verbose_name="Gamma"
    )

    profileName = models.CharField(verbose_name="Profile name", null=True, max_length=100)

    width = models.IntegerField(verbose_name="Resolution width", default=0)
    height = models.IntegerField(verbose_name="Resolution height", default=0)

    # Render boolean
    fullscreen = models.BooleanField(verbose_name="Fullscreen", default=True)
    vsync = models.BooleanField(verbose_name="Vsync", default=False)
    reflection = models.BooleanField(verbose_name="Dynamic reflection", default=False)
    parallax = models.BooleanField(verbose_name="Parallax occlusion", default=False)
    motionBlur = models.BooleanField(verbose_name="Motion Blur", default=False)
    refraction = models.BooleanField(verbose_name="Refraction", default=False)
    volumetric = models.BooleanField(verbose_name="Volumetric shadows", default=False)
    filter = models.BooleanField(verbose_name="Texture filtering", default=False)

    # Render multi value
    resolution = models.IntegerField(
        choices=RESOLUTION_CHOICES,
        verbose_name="Resolution",
        default=RESOLUTION_CHOICES[3][0]
    )

    occlusion = models.IntegerField(
        choices=OCCLUSION_CHOICES,
        verbose_name="Ambient Occlusion and GI",
        default=PROFILE_CHOICES[0][0]
    )

    shader = models.IntegerField(
        choices=SHADER_CHOICES,
        verbose_name="Shader quality",
        default=SHADER_CHOICES[0][0]
    )

    texture = models.IntegerField(
        choices=TEXTURE_CHOICES,
        verbose_name="Texture resolution",
        default=TEXTURE_CHOICES[0][0]
    )

    anisotropy = models.IntegerField(
        choices=ANISOTROPY_CHOICES,
        verbose_name="Anisotropy",
        default=ANISOTROPY_CHOICES[0][0]
    )

    multisample = models.IntegerField(
        choices=MULTISAMPLE_CHOICES,
        verbose_name="Anti-aliasing mode",
        default=MULTISAMPLE_CHOICES[0][0]
    )

    sfx = models.IntegerField(
        choices=SFX_CHOICES,
        verbose_name="SFX mode",
        default=SFX_CHOICES[0][0]
    )

    profile = models.ForeignKey('SettingProfile',
                                blank=True,
                                null=True,
                                verbose_name="Profile",
                                related_name='linked_profile')  #: The related setting for the profile

    # Audio
    master = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(100.0)],
        default=80.0,
        verbose_name="Master volume"
    )

    ambient = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(100.0)],
        default=80.0,
        verbose_name="Ambient volume"
    )

    music = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(100.0)],
        default=80.0,
        verbose_name="Music volume"
    )

    voice = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(100.0)],
        default=80.0,
        verbose_name="Voice volume"
    )

    character = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(100.0)],
        default=80.0,
        verbose_name="Character volume"
    )

    effects = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(100.0)],
        default=80.0,
        verbose_name="Effects volume"
    )

    # Controls
    controls = models.ManyToManyField(Control, blank=True, null=True)
    mouse_sensitivity = models.FloatField(
        validators=[MinValueValidator(0.0),
                    MaxValueValidator(6.0)],
        default=2.0,
        verbose_name="Mouse sensitivity"
    )

    # Language
    language = models.ForeignKey('game.Language')

    # User
    user = models.ForeignKey(User, verbose_name="User")  #: The related user who owns the settings

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_sett", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_sett", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    version = IntegerVersionField()

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.id

    class Meta:
        # Plural name
        verbose_name_plural = 'Settings'


class SettingProfile(models.Model):
    """
    Settings profile class
    """
    # General
    name = models.CharField(max_length=20, verbose_name="Profile name")  #: First name

    # Related setting
    setting = models.ForeignKey(Setting, blank=True, null=True, related_name='linked_setting')  #: The related setting for the profile

    # Auditing
    creator = models.ForeignKey(User, related_name="user_creator_settpro", verbose_name="Creator", editable=False, null=False)
    created = models.DateTimeField(verbose_name="Created on", editable=False, null=False)

    editor = models.ForeignKey(User, related_name="user_editor_settpro", verbose_name="Editor", editable=False, null=False)
    edited = models.DateTimeField(verbose_name="Edited on", editable=False, null=False)

    def __str__(self):
        """
        Instance naming for rendering.
        :return: Instance name as unicode string
        """
        return u'%s' % self.name

    class Meta:
        # Plural name
        verbose_name_plural = 'Setting profiles'
