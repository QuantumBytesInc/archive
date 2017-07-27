function RouteProvider($stateProvider) {


    var stateLogin = {
        views: {
            "LOGIN_VIEW": {
                templateUrl: window.amazonURL + 'gui/templates/state/login/loginView.html',
                controller: 'loginController',
            },
            "HELP_VIEW": {
                templateUrl: window.amazonURL + 'gui/templates/help/help.html',
                controller: 'helpController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/help/help.css" rel="stylesheet">');
                    }
                }
            },
            "SETTINGS_MENU": {
                templateUrl: window.amazonURL + 'gui/templates/settings/settings.html',
                controller: 'settingsController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/esc/esc.css" rel="stylesheet">');
                    }
                }
            },
            "ESC_MENU": {
                templateUrl: window.amazonURL + 'gui/templates/esc/esc.html',
                controller: 'escController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/settings/settings.css" rel="stylesheet">');
                    }
                }
            },
            "TEMPORARY_VIEW": {
                templateUrl: window.amazonURL + 'gui/templates/temporary/temporary.html',
                controller: 'temporaryController'
            },
            "LOG_VIEW": {
                templateUrl: window.amazonURL + 'gui/templates/log/log.html',
                controller: 'logController',
                 resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/log/log.css" rel="stylesheet">');
                    }
                }
            },
            "INFORMATION": {
                templateUrl: window.amazonURL + 'gui/templates/information/information.html',
                controller: 'informationController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/information/information.css" rel="stylesheet">');
                    }
                }
            }

        }
    };

    var stateGame = {
        views: {
            "HELP_VIEW": {
                templateUrl: window.amazonURL + 'gui/templates/help/help.html',
                controller: 'helpController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/help/help.css" rel="stylesheet">');
                    }
                }
            },
            "SETTINGS_MENU": {
                templateUrl: window.amazonURL + 'gui/templates/settings/settings.html',
                controller: 'settingsController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/esc/esc.css" rel="stylesheet">');
                    }
                }
            },
            "ESC_MENU": {
                templateUrl: window.amazonURL + 'gui/templates/esc/esc.html',
                controller: 'escController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/settings/settings.css" rel="stylesheet">');
                    }
                }
            },

            "CHAR_SELECTION": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/charSelection/charSelection.html',
                controller: 'charSelectionController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/charSelection/charSelection.css" rel="stylesheet">');
                    }
                }
            },

            "CHAR_CREATION": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/charCreation/charCreation.html',
                controller: 'charCreationController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/charCreation/charCreation.css" rel="stylesheet">');
                    }
                }
            },
            "TOPBAR": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/topbar/topbar.html',
                controller: 'topbarController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/topbar/topbar.css" rel="stylesheet">');
                    }
                }
            },
            "LOG_VIEW": {
                templateUrl: window.amazonURL + 'gui/templates/log/log.html',
                controller: 'logController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/log/log.css" rel="stylesheet">');
                    }
                }

            },
             "CHAT": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/chat/chat.html',
                controller: 'chatController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/chat/chat.css" rel="stylesheet">');
                    }
                }
            },
              "TASKBAR": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/taskbar/taskbar.html',
                controller: 'taskbarController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/taskbar/taskbar.css" rel="stylesheet">');
                    }
                }
            },
              "STORAGE": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/storage/storage.html',
                controller: 'storageController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/storage/storage.css" rel="stylesheet">');
                    }
                }
            },
              "OVERLAY": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/overlay/overlay.html',
                controller: 'overlayController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/overlay/overlay.css" rel="stylesheet">');
                    }
                }
            },
              "INFORMATION": {
                templateUrl: window.amazonURL + 'gui/templates/information/information.html',
                controller: 'informationController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/information/information.css" rel="stylesheet">');
                    }
                }
            }
            ,
              "GATHERING_MINING": {
                templateUrl: window.amazonURL + 'gui/templates/state/game/minigames/gathering/mining/gatheringMining.html',
                controller: 'gatheringMiningController',
                resolve: {
                    style: function () {
                        //angular.element('head').append('<link  href="' + window.amazonURL + 'gui/css/state/game/minigames/gathering/mining/gatheringMining.css" rel="stylesheet">');
                    }
                }
            }
        }

    };

    //Add existing states, just one can be active at same time
    $stateProvider.state('LOGIN', stateLogin).state("GAME", stateGame);

    var tempStateProvider = {"LOGIN": stateLogin, "GAME": stateGame};


    for (var stateKey in tempStateProvider) {

        var views = tempStateProvider[stateKey].views;

        for (var viewKey in views) {
            var view = views[viewKey];
            view.viewName = viewKey;
            view.controllerName = view.controller.name;
            tempStateProvider[stateKey].views[viewKey] = view;
        }
    }

    window.globalStateProvider = tempStateProvider;


}
