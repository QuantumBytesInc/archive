from django.contrib.syndication.views import Feed
from project.news.models import Entry
from project.settings.base import BASE_URL


class LatestEntriesFeed(Feed):
    title = "Latests news of Relics of Annorath"
    link = "/news/"
    description = "Updates about the development of RoA."

    @staticmethod
    def items():
        return Entry.objects.order_by('-created')[:5]

    def item_title(self, entry):
        return entry.title

    def item_description(self, entry):
        return entry.short_text

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, entry):
        return BASE_URL + '#!news.' + str(entry.id)
