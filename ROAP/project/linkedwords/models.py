from django.db import models

from project.features.models import Feature


class LinkedWord(models.Model):

    name = models.CharField(verbose_name="Name",
                            max_length=80,
                            help_text="Keyword to link")
    feature = models.ForeignKey(Feature,
                                related_name='feature',
                                verbose_name="Feature")
