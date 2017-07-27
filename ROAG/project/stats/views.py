# Copyright (C) 2015 Quantum Bytes GmbH. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Python imports
import datetime
import arrow

# Django imports
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.shortcuts import render_to_response
from django.template import RequestContext

# Model imports
from project.stats.models import *


class AnalyticsIndexView(TemplateView):
    template_name = 'stats.html'

    def get_context_data(self, **kwargs):
        context = super(AnalyticsIndexView, self).get_context_data(**kwargs)
        context['thirty_days_unique_logins'] = self.thirty_days_unique_logins()
        context['thirty_days_logins'] = self.thirty_days_logins()
        context['thirty_days_messages'] = self.thirty_days_messages()
        context['thirty_days_characters_created'] = self.thirty_days_characters_created()
        context['thirty_days_characters_joins'] = self.thirty_days_characters_joins()
        context['thirty_days_launcher_logins'] = self.thirty_days_launcher_logins()
        context['duration_lt_5'] = self.duration_lt_5()
        context['duration_gt_5'] = self.duration_gt_5()
        context['duration_gt_10'] = self.duration_gt_10()
        context['duration_gt_15'] = self.duration_gt_15()
        context['duration_gt_30'] = self.duration_gt_30()
        context['duration_gt_45'] = self.duration_gt_45()
        context['duration_gt_60'] = self.duration_gt_60()
        return context

    def thirty_days_unique_logins(self):
        final_data = []

        date = arrow.now()
        date = date.replace(days=+1)
        for day in xrange(1, 31):
            date = date.replace(days=-1)
            count = User.objects.filter(
                last_login__gte=date.floor('day').datetime,
                last_login__lte=date.ceil('day').datetime).count()
            final_data.append(count)

        final_data.sort(reverse=False)
        return final_data

    def thirty_days_logins(self):
        final_data = []

        date = arrow.now()
        date = date.replace(days=+1)
        for day in xrange(1, 31):
            date = date.replace(days=-1)
            count = UserLogin.objects.filter(
                date__gte=date.floor('day').datetime,
                date__lte=date.ceil('day').datetime).count()
            final_data.append(count)

        final_data.sort(reverse=False)
        return final_data

    def thirty_days_messages(self):
        final_data = []

        date = arrow.now()
        date = date.replace(days=+1)
        for day in xrange(1, 31):
            date = date.replace(days=-1)
            count = ChatMessage.objects.filter(
                date__gte=date.floor('day').datetime,
                date__lte=date.ceil('day').datetime).count()
            final_data.append(count)

        final_data.sort(reverse=False)
        return final_data

    def thirty_days_characters_created(self):
        final_data = []

        date = arrow.now()
        date = date.replace(days=+1)
        for day in xrange(1, 31):
            date = date.replace(days=-1)
            count = CharacterCreate.objects.filter(
                date__gte=date.floor('day').datetime,
                date__lte=date.ceil('day').datetime).count()
            final_data.append(count)

        final_data.sort(reverse=False)
        return final_data

    def thirty_days_characters_joins(self):
        final_data = []

        date = arrow.now()
        date = date.replace(days=+1)
        for day in xrange(1, 31):
            date = date.replace(days=-1)
            count = CharacterJoin.objects.filter(
                date__gte=date.floor('day').datetime,
                date__lte=date.ceil('day').datetime).count()
            final_data.append(count)

        final_data.sort(reverse=False)
        return final_data

    def thirty_days_launcher_logins(self):
        final_data = []

        date = arrow.now()
        date = date.replace(days=+1)
        for day in xrange(1, 31):
            date = date.replace(days=-1)
            count = LauncherDownload.objects.filter(
                date__gte=date.floor('day').datetime,
                date__lte=date.ceil('day').datetime).count()
            final_data.append(count)

        final_data.sort(reverse=False)
        return final_data

    def duration_lt_5(self):
        return PlayDuration.objects.filter(duration__lt=300).count()

    def duration_gt_5(self):
        return PlayDuration.objects.filter(duration__gte=300, duration__lt=600).count()

    def duration_gt_10(self):
        return PlayDuration.objects.filter(duration__gte=600, duration__lt=900).count()

    def duration_gt_15(self):
        return PlayDuration.objects.filter(duration__gte=900, duration__lt=1800).count()

    def duration_gt_30(self):
        return PlayDuration.objects.filter(duration__gte=1800, duration__lt=2700).count()

    def duration_gt_45(self):
        return PlayDuration.objects.filter(duration__gte=2700, duration__lt=3600).count()

    def duration_gt_60(self):
        return PlayDuration.objects.filter(duration__gte=3600).count()
