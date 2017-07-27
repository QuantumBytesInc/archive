# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

from django.db import models
from django.contrib.auth.models import User

from languages_plus.models import Language


class Feature(models.Model):
    DISPLAY_DIRECTIONS = (
        ("LFT", "Left"),
        ("RIG", "Right"),
    )   #: Possible display directions

    FEATURE_TYPE = (
        ("FEA", "Feature"),
        ("SFE", "Sub Feature"),
        ("SFP", "Sub Feature Part"),
    )   #: Possible feature types

    # General
    title = models.CharField(verbose_name="Title",
                             max_length=80)
    picture = models.ImageField(verbose_name="Picture",
                                blank=True,
                                upload_to="features")

    # Specific
    display_order = models.IntegerField(verbose_name="Order")
    display_adjustment = models.CharField(verbose_name="Display adjustment",
                                          max_length=3,
                                          blank=True,
                                          null=True,
                                          choices=DISPLAY_DIRECTIONS)
    feature_type = models.CharField(verbose_name="Feature type",
                                    max_length=3,
                                    choices=FEATURE_TYPE)

    # Special cases for types
    parent = models.ForeignKey('self',
                               related_name='+',
                               verbose_name="Parent",
                               blank=True,
                               null=True)

    # Auditing
    creator = models.ForeignKey(User, related_name='+',
                                verbose_name="Creator",
                                editable=False)
    created = models.DateTimeField(blank=True,
                                   editable=False,
                                   null=True)

    editor = models.ForeignKey(User,
                               related_name='+',
                               verbose_name="Editor",
                               editable=False)
    updated = models.DateTimeField(editable=False,
                                   null=True)

    def _choices(self):
        features = Feature.objects.all()
        features = features.order_by('title')
        return [(e.id, e.title) for e in features]

    def _choices_linked_words(self):
        features = Feature.objects.filter(feature_type='SFE')
        features = features.order_by('title')
        return [(e.id, e.title) for e in features]

    def __unicode__(self):
        return u'%s / %s' % (self.title, self.feature_type)

    choices = property(_choices)
    choices_linked_words = property(_choices_linked_words)


class SubFeature(Feature):
    class Meta:
        proxy = True

    objects = Feature()


class SubFeaturePart(Feature):
    class Meta:
        proxy = True

    objects = Feature()


class FeatureTranslationProxy(Feature):
    class Meta:
        proxy = True

    objects = Feature()


class FeatureTranslation(models.Model):
    """
    """
    # General
    title = models.CharField(verbose_name="Title",
                             max_length=80)
    text = models.TextField(verbose_name="Text",
                            blank=True)

    # Connection to features
    feature = models.ForeignKey(Feature,
                                related_name='%(class)s_feature',
                                verbose_name="Feature")

    # Translation language
    language = models.ForeignKey(Language,
                                 related_name='language',
                                 verbose_name="Language")

    # Auditing
    creator = models.ForeignKey(User, related_name='+',
                                verbose_name="Creator",
                                editable=False)
    created = models.DateTimeField(blank=True,
                                   editable=False,
                                   null=True)

    editor = models.ForeignKey(User, related_name='+',
                               verbose_name="Editor",
                               editable=False)
    updated = models.DateTimeField(editable=False,
                                   null=True)

    def __unicode__(self):
        return u'%s' % self.language
