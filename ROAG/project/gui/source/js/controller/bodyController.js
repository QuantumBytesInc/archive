/**
 * Handels the whole body functionality, initalized as first controller of all.
 * Brings up the login view.
 * @param $scope
 * @param $state
 * @param $translate
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {HelperService} helperService
 * @param {$interval} $interval
 * @class BodyController
 * @constructor
 */
function BodyController($scope, $state, $translate, uiService, uiCommunicate, uiCommunicateModel, helperService, $interval, uiDB,uiUser) {
    //If someone of you touches this line, i'll remove you from this earth.
    // / \todo delete this line and I'll kill you.
    console.log("Body Controller instanced - needed for protractor - never remove this line.");
    /**
     * Called on ng-init
     * State is changed on start to LOGIN.
     * Translation set to english
     * @event init
     */
    var initInterval;
    $scope.init = function () {

        initInterval = $interval(function () {
            if (window.onloadFinished) {
                console.log("Onload - Instance App");
                $interval.cancel(initInterval);
                instanceApp();
            }
        })
    };

    var instanceApp = function instanceApp() {
        if (uiCommunicate.isBrowser()) {
            logWatches();
        }
        /**
         * Handels the keydown event on the body. shows the ESCP menu if esc was pressed
         * @event keydown
         * @param {keycode} e
         */
        $(document).keydown(function (e) {
            // ESCAPE key pressed
            if (e.keyCode == 27) {
                if (uiService.getState() !== uiService.getStates().LOGIN) {


                    //$state.go("game");
                    var toggleESC = false;
                    if (uiService.isUIHidden(uiService.getUiViews().SETTINGS_MENU) === true) {

                        toggleESC = true;

                    }
                    else {
                        uiService.hideUI(uiService.getUiViews().SETTINGS_MENU);
                        return;
                    }

                    if (uiService.isUIHidden(uiService.getUiViews().HELP_VIEW) === true) {
                        toggleESC = true;
                    }
                    else {
                        uiService.hideUI(uiService.getUiViews().HELP_VIEW);
                        return;
                    }

                    if (uiService.isUIHidden(uiService.getUiViews().LOG_VIEW) === true) {
                        toggleESC = true;
                    }
                    else {
                        uiService.hideUI(uiService.getUiViews().LOG_VIEW);
                        return;
                    }
                    if (toggleESC === true) {
                        if (uiService.isUIHidden(uiService.getUiViews().ESC_MENU) === false) {
                            uiService.hideUI(uiService.getUiViews().ESC_MENU);
                        }
                        else {
                            uiService.showUI(uiService.getUiViews().ESC_MENU);
                        }
                    }
                }
            }
        });


        if (!uiCommunicate.isBrowser()) {

            uiCommunicateModel.UNIGINE_GET_STATE("STATE").then(
                function (_data) {

                    var intervalPromise = $interval(refreshToken, 120000);
                    var data = _data;


                    if (data && data.DATA && typeof(data.DATA) === "string" && data.DATA !== "{}" && data.DATA.length > 0) {
                        var state = JSON.parse(Base64.decode(data.DATA));
                        uiService.changeState(uiService.getStates().LOGIN).then
                        (function () {
                            uiCommunicateModel.UNIGINE_GET_STATE("LANGUAGE").then(function (_data) {

                                    $translate.use("en");
                                    if (_data && _data.DATA && typeof(_data.DATA) === "string" && _data.DATA !== "{}" && _data.DATA.length > 0) {
                                        $translate.use(_data.DATA);
                                    }
                                    else {
                                        $translate.use("en");
                                    }
                                },
                                function (_data) {

                                });
                            uiService.createUI(uiService.getUiViews().INFORMATION).then(function () {
                                uiService.showUI(uiService.getUiViews().LOGIN_VIEW, {STATE: state});
                            });

                        });

                    }
                    else {


                        uiService.changeState(uiService.getStates().LOGIN).then(function () {

                            uiService.createUI(uiService.getUiViews().INFORMATION).then(function () {

                                uiCommunicateModel.UNIGINE_GET_STATE("LANGUAGE").then(function (_data) {

                                        $translate.use("en");
                                        if (_data && _data.DATA && typeof(_data.DATA) === "string" && _data.DATA !== "{}" && _data.DATA.length > 0) {
                                            $translate.use(_data.DATA);
                                        }
                                        else {
                                            $translate.use("en");
                                        }
                                    },
                                    function (_data) {

                                    });

                                //Saftey logout, so user cant be logged in twice.
                                uiCommunicateModel.AUTHENTICATION_LOGOUT("").then(
                                    function (_data) {

                                        uiService.showUI(uiService.getUiViews().LOGIN_VIEW);
                                    });


                            });

                        });
                    }
                }
            );
        }
        else {

            uiService.changeState(uiService.getStates().LOGIN).then(function () {
                $translate.use("en");
                uiService.createUI(uiService.getUiViews().INFORMATION).then(function () {
                    uiCommunicateModel.AUTHENTICATION_LOGOUT().then(
                        function (_data) {
                            uiService.showUI(uiService.getUiViews().LOGIN_VIEW);

                        });
                });
            });


        }

    };
    var refreshToken = function () {

        uiCommunicateModel.AUTHENTICATION_TOKEN_REFRESH().then(function (_data) {
                var token = _data.DATA.TOKEN;
                uiUser.setToken(token);
                //TOKEN REFRESH.
                uiCommunicateModel.UNIGINE_SET_TOKEN(uiUser.getToken()).then(
                    function (_data) {
                        // ls.logINFO("Refreshed token: " + token);

                    });
            },
            function (_data) {

            });

    };

    /**
     * Logs the actual watches count when inside the browser
     * @method
     * @private
     */
    var logWatches = function () {
        setInterval(function () {

            (function () {
                var root = angular.element(document.getElementsByTagName('body'));

                var watchers = [];

                var f = function (element) {
                    angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
                        if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                            angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
                                watchers.push(watcher);
                            });
                        }
                    });

                    angular.forEach(element.children(), function (childElement) {
                        f(angular.element(childElement));
                    });
                };

                f(root);

                // Remove duplicate watchers
                var watchersWithoutDuplicates = [];
                angular.forEach(watchers, function (item) {
                    if (watchersWithoutDuplicates.indexOf(item) < 0) {
                        watchersWithoutDuplicates.push(item);
                    }
                });

                console.log("Watcher:" + watchersWithoutDuplicates.length);
            })();

        }, 1000);
    }
}
