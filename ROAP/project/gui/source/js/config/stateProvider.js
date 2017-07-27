function StateProvider($stateProvider, $urlRouterProvider) {
    var guiURL = amazonURL + "gui/";

    $urlRouterProvider.otherwise('/game/');

    $stateProvider
        .state('game', {
            url :"/game/",
            templateUrl: guiURL + 'templates/game.html',
            controller: 'mainController'
        })
        .state('news', {
            url :"/news/",
            templateUrl: guiURL + 'templates/news.html',
            controller: 'newsController'
        })
        .state('newsDetail', {
            url :"^/news/{newsID}/",
            templateUrl: guiURL + 'templates/news.detail.html',
            controller: 'newsDetailController'
        })
        .state('features', {
            url :"/features/",
            templateUrl: guiURL + 'templates/features.html',
            controller: 'featureController'
        })
        .state('featureDetail', {
            url :"^/features/{featureID}/{partID}/",
            templateUrl: guiURL + 'templates/feature.detail.html',
            controller: 'featureDetailController'
            /*resolve : {
              detailFeature: ['uiCommunicateModel','$state','$stateParams',function(uiCommunicateModel, $state, $stateParams){
                return uiCommunicateModel.FEATURES_FEATURE($stateParams.featureID,$stateParams.partID).then(function(_data){ return _data; });
              }]
            }*/
        })
        .state('lore', {
            url :"/lore/",
            templateUrl: guiURL + 'templates/lore.html',
            controller: 'mainController'
        })
        .state('register', {
            url :"/register/",
            templateUrl: guiURL + 'templates/register.html',
            controller: 'mainController'
        })
        .state('faq', {
            url :"/faq/",
            templateUrl: guiURL + 'templates/faq.html',
            controller: 'faqController',
            data : {"faqTitle" : ""}
        })
        .state('faqDetail', {
            url :"^/faq/{faqCategory}/{faqID}/",
            templateUrl: guiURL + 'templates/faq.detail.html',
            controller: 'faqDetailController',
            data : {"faqTitle" : ""},
            reloadOnSearch: false
        })
        /*.state('support', {
            url :"/support/",
            templateUrl: guiURL + 'templates/support.html',
            controller: 'supportController'
        })*/
        .state('privacyPolicy', {
            url :"/privacy-policy/",
            templateUrl: guiURL + 'templates/privacypolicy.html',
            controller: 'mainController'
        })
        .state('nonDisclosureAgreement', {
            url :"/non-disclosure-agreement/",
            templateUrl: guiURL + 'templates/nondisclosureagreement.html',
            controller: 'mainController'
        })
        .state('passwordRecovery', {
            url :"/password-recovery/",
            templateUrl: guiURL + 'templates/password-recovery.html',
            controller: 'passwordRecoveryController'
        })
        .state('accountActivation', {
            url :"/account-activation/{activationID}",
            templateUrl: guiURL + 'templates/account-activation.html',
            controller: 'accountActivationController'
        })
        .state('profile', {
            url :"/profile/",
            templateUrl: guiURL + 'templates/profile.html',
            controller: 'profileController'
        })
        .state('gettingStarted', {
            url :"/getting-started/",
            templateUrl: guiURL + 'templates/getting-started.html',
            controller: 'gettingStartedController'
        });
}
