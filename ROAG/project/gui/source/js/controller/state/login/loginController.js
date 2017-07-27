/**
 *
 * @param {$scope} $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @param {UIUser} uiUser
 * @constructor
 */
function LoginController($scope, uiService, uiCommunicate, uiCommunicateModel, helperService, logService, uiUser) {
    $scope.showCtrl = false;

    $scope.username = "";
    $scope.password = "";

    var controllerData;

    /**
     * Logservice instance
     * @private
     * @type {LogService}
     */
    var ls = null;

    $scope.init = function (_data) {

        ls = logService;
        controllerData = _data;
        if (uiCommunicate.isBrowser() === true) {
            $scope.username = "testing";
            $scope.password = "testing";
            $scope.showCtrl = true;
        }
        else {
            //Don't show login view - not needed
            $scope.showCtrl = false;
            setTimeout(function () {
                //Fire login automatic
                $scope.login();
            }, 100);
        }
    };


    /**
     * If engine is not ready, we cant do anything
     * @method
     * @private
     */
    var loginUserToEngine = function () {
        uiCommunicateModel.UNIGINE_GET_TOKEN({}).then(function (_data) {
            /// \todo get token.
            var data = _data;
            uiUser.setToken(data.DATA.TOKEN);
            ls.log("LoginController - Login user to engine - Response token: " + uiUser.getToken(), ls.logType().TRC, false, false);
            uiCommunicateModel.AUTHENTICATION_LOGIN_BY_TOKEN(uiUser.getToken()).then(function (_data) {
                var data = _data;

                var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
                switch (data.CODE) {
                    case code.SUCCESSFULLY:
                        var token = data.DATA.TOKEN;
                        ls.log("LoginController - Login user to engine - Login successfully, new token: " + uiUser.getToken(), ls.logType().TRC, false, false);
                        uiUser.setToken(token);

                        helperService.hidePopup();
                        //Check if we got a state by login
                        /// \todo DIRTY HACK!!!!
                        if (controllerData && controllerData.STATE) {
                            uiService.destroyUI(uiService.getUiViews().INFORMATION);
                            uiService.changeState(uiService.getStates().GAME).then
                            (function () {
                                for (var i = 0; i < controllerData.STATE.length; i++) {
                                    uiService.showUI(controllerData.STATE[i].VIEW);
                                }
                            });
                            /*   var state = parseInt(controllerData.STATE);
                             if (state === 1) {

                             uiService.changeState(uiService.getStates().GAME).then
                             (function () {
                             uiService.showUI(uiService.getUiViews().CHAR_SELECTION);
                             });
                             //Character selection
                             }
                             else if (state === 2) {
                             uiService.changeState(uiService.getStates().GAME).then
                             (function () {
                             uiService.showUI(uiService.getUiViews().TOPBAR);
                             uiService.showUI(uiService.getUiViews().CHAT);
                             uiService.showUI(uiService.getUiViews().TASKBAR);
                             });

                             //Ingame
                             }
                             else if (state === 3) {
                             uiService.changeState(uiService.getStates().GAME).then
                             (function () {
                             uiService.showUI(uiService.getUiViews().CHAR_CREATION);
                             });
                             }*/
                        }
                        else {
                            uiService.destroyUI(uiService.getUiViews().INFORMATION);
                            uiService.changeState(uiService.getStates().GAME).then(function (_data) {

                                uiCommunicateModel.UNIGINE_AJS_READY({}).then(function (_data) {
                                    uiService.createUI(uiService.getUiViews().CHAR_SELECTION);
                                });

                            });
                        }
                        break;
                    case code.FAILED_WRONG_USER_OR_PASSWORD:

                    /*break;*/
                    case code.FAILED_USER_NOT_ACTIVE:
                    /*helperService.showPopup({
                     type: helperService.getPopupTypes().WARN,
                     title: "T_EM1_Title",
                     message: "T_EM1_Text1",
                     button: "TB_CLOSE"
                     });
                     break;*/
                    case code.FAILED_SERVER_DOWN:
                    /* helperService.showPopup({
                     type: helperService.getPopupTypes().WARN,
                     title: "T_EM1_Title",
                     message: "T_EM1_Text1",
                     button: "TB_CLOSE"
                     });
                     break;*/
                    case code.FAILED_MAINTENANCE:
                    /*helperService.showPopup({
                     type: helperService.getPopupTypes().WARN,
                     title: "T_EM1_Title",
                     message: "T_EM1_Text1",
                     button: "TB_CLOSE"
                     });
                     break;*/
                    case code.FAILED_MISC:
                    /*helperService.showPopup({
                     type: helperService.getPopupTypes().WARN,
                     title: "T_EM1_Title",
                     message: "T_EM1_Text1",
                     button: "TB_CLOSE"
                     });
                     break;*/
                    default:
                        ls.log("LoginController - Login user to engine - Response for token invalid: " + uiUser.getToken() + " - Shutdown Engine", ls.logType().ERR, false, false);
                        uiCommunicateModel.UNIGINE_UI_ENTER();

                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE",
                            callback: function () {
                                uiCommunicateModel.AUTHENTICATION_LOGOUT().then(
                                    function (_webData) {

                                        uiCommunicateModel.UNIGINE_CLOSE().then(
                                            function (_engineData) {

                                            });

                                    });


                            }

                        });

                        break;
                }
            }, function () {
                //Error - Close client
                uiCommunicateModel.UNIGINE_UI_ENTER();

                helperService.showPopup({
                    type: helperService.getPopupTypes().WARN,
                    title: "T_EM1_Title",
                    message: "T_EM1_Text1",
                    button: "TB_CLOSE",
                    callback: function () {
                        uiCommunicateModel.AUTHENTICATION_LOGOUT().then(
                            function (_webData) {

                                uiCommunicateModel.UNIGINE_CLOSE().then(
                                    function (_engineData) {

                                    });

                            });


                    }

                });

            });
        });
    };
    /**
     * Fired automatic on startup
     * @event login
     */
    $scope.login = function () {

        if (uiCommunicate.isBrowser() === true) {
            //Blur password field, else you can HIT enter and spam server.
            // $scope.$element.find("#password").blur();
            helperService.showPopup({
                type: helperService.getPopupTypes().WAIT,
                title: "T_LP_Title",
                message: "T_LP_Text1"
            });
            uiCommunicateModel.AUTHENTICATION_LOGIN($scope.username, $scope.password).then(function (_data) {
                var data = _data;

                var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
                switch (data.CODE) {
                    case code.SUCCESSFULLY:
                        uiUser.setToken(data.DATA.TOKEN);
                        helperService.hidePopup();
                        uiService.destroyUI(uiService.getUiViews().INFORMATION);
                        uiService.changeState(uiService.getStates().GAME).then(function (_data) {
                            uiService.showUI(uiService.getUiViews().CHAR_SELECTION);
                        });

                        break;
                    case code.FAILED_WRONG_USER_OR_PASSWORD:
                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE"
                        });
                        break;
                    case code.FAILED_USER_NOT_ACTIVE:
                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE"
                        });
                        break;
                    case code.FAILED_SERVER_DOWN:
                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE"
                        });
                        break;
                    case code.FAILED_MAINTENANCE:
                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE"
                        });
                        break;
                    case code.FAILED_MISC:
                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE"
                        });
                        break;
                    default:
                        helperService.showPopup({
                            type: helperService.getPopupTypes().WARN,
                            title: "T_EM1_Title",
                            message: "T_EM1_Text1",
                            button: "TB_CLOSE"
                        });
                        break;
                }
            });

        }
        else {
            //ENGINE

            checkEngineReady(function () {
                ls.log("LoginController - Check Engine Ready - Engine ready, login", ls.logType().TRC, false, false);
                loginUserToEngine();
            });

        }

    };

    /**
     * This function will call the unigine server to retrieve the token.
     * If after 500 ms no response was made, we try to get the token again, and repeat this as long as we got the token.
     * This is one of the critical parts in unigine
     * TODO Change this with version 2 to a better setup
     * @method
     * @private
     * @param {Function} _success
     */
    var checkEngineReady = function (_success) {
        ls.log("LoginController - Login - Ingame login - Check Engine ready", ls.logType().TRC, false, false);
        var gotToken = false;
        uiCommunicateModel.UNIGINE_GET_TOKEN({}).then(function (_data) {
            ls.log("LoginController - Check Engine Ready - We got a valid response", ls.logType().TRC, false, false);
            gotToken = true;
        }, function () {
            ls.log("LoginController - Check Engine Ready - We got an error callback", ls.logType().ERR, false, false);
        });
        setTimeout(function () {
            if (gotToken == true) {
                _success();
            }
            else {
                checkEngineReady(_success);
            }
        }, 500);
    }


}