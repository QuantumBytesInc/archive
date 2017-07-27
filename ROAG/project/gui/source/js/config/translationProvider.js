function TranslationProvider ($translateProvider) {


  $translateProvider.translations('en',	translationEnglish);
  $translateProvider.translations('fr', translationFrench);
  $translateProvider.translations('de', translationGerman);
  $translateProvider.translations('el', translationGreek);
  $translateProvider.translations('it', translationItalian);
  $translateProvider.translations('pl', translationPolnish);
  $translateProvider.translations('es', translationSpanish);
  $translateProvider.translations('br', translationPortuguese);

  $translateProvider.preferredLanguage('en');




}
