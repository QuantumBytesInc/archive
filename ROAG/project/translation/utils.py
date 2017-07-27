from django.core.files import File
from project.translation.models import TranslationLabel, TranslationLabelEntry
from project.game.models import Language


def export_translations():
    """

    :param modeladmin:
    :param request:
    :param queryset:
    :return:
    """
    # Open file
    f = open('project/gui/source/js/static/translations.js', 'w')
    jsfile = File(f)
    # Get all languages
    for language in Language.objects.all():
        # Get all translations for this language
        translations = TranslationLabelEntry.objects.filter(language=language)
        jsfile.write('var translation' + language.name + ' = {\n')

        # For each translation add entry
        json = ''

        for translation in translations:
            json += '\t"' + translation.label.name + '":"' + translation.text.replace('"', '\\"') + '",\n'

        # Cleanup
        json = json[:-2]
        json += '\n};\n\n'
        #json = json.encode('utf-8')

        # Close tags
        jsfile.write(json)

    jsfile.close()
