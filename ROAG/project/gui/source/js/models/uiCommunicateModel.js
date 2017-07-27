/**
 *
 * @param {LogService} logService
 * @param {UICommunicate} uiCommunicate
 * @param {$q} $q
 * @param {UIService} uiService
 * @param {HelperService} helperService
 * @param {UIUser} uiUser
 * @class UICommunicateModel
 * @constructor
 */
function UICommunicateModel(logService, uiCommunicate, $q, uiService, helperService, uiUser) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    /**
     * Own instance
     * @type {UICommunicateModel}
     */
    var me = this;

    /************************************************************** Private - VARIABLES - END *************************************************************/

    /************************************************************** Public - VARIABLES - START ************************************************************/


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    var init = function init() {
        ls = logService;


    };

    var getGlobalCodeMap = function getGlobalCodeMap() {
        return uiCommunicate.getCodeMap(0, 0);
    };

    /**
     * Avoid more quit-statements if were already quitting.
     * @type {boolean}
     */
    var clientIsQuitting = false;
    /**
     * Called if an global error occured.
     */
    var quitClient = function quitClient() {
        if (clientIsQuitting === false) {
            clientIsQuitting = true;
            me.UNIGINE_UI_ENTER();
            uiCommunicate.syncBroadcast(uiCommunicate.getSyncBroadcastTypes().QUIT).then(function () {
                helperService.showPopup({
                    type: helperService.getPopupTypes().WARN,
                    title: "Error",
                    message: "Fatal error occured, client is closing",
                    button: "TB_CLOSE",
                    callback: function () {
                        ls.logERR("Quit client, fatal error occured");
                        //Wait for everything to deattach.
                        me.AUTHENTICATION_LOGOUT().then(
                            function (_webData) {

                                me.UNIGINE_CLOSE().then(
                                    function (_engineData) {

                                    });

                            });

                    }
                });
            });
        }
    };

    /**
     *
     * @param _data
     * @returns {number} -2 Global Error, -1 normal global error, 0 no global error
     */
    var checkErrors = function checkErrors(_data) {
        var data = _data;

        if (data && data.ERROR !== -1) {

            var code = getGlobalCodeMap();
            switch (data.ERROR) {
                case code.ERROR_NOT_AUTHENTICATED:
                case code.ERROR_MISC_ERROR:
                    //QUIT CLIENT
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Fatal error occurred, client is closing"});
                    quitClient();
                    return -2;
                    break;
                case code.ERROR_SERVER_OFFLINE:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Server is offline, client is closing"});
                    quitClient();
                    return -2;
                    break;

                default:
                    //Show error
                    return -1;
                    break;
            }

        }

        return 0;

    };

    var check_AUTHENTICATION_TOKEN_REFRESH = function (_data) {
        var data = _data;
        var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {
            switch (data.CODE) {
                case code.FAILED_MISC:
                case code.FAILED_TO_OLD:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Fatal error occurred, client is closing"});
                    quitClient();
                    break;
                default:
                    break;
            }

        }
    };

    var check_AUTHENTICATION_LOGOUT = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Failed Misc"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_UNIGINE_CLOSE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };


    var check_CHARACTER_CREATE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't create character"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHARACTER_GUI_SELECTION = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_ACCOUNT_SETTINGS_GET = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get settings"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_ACCOUNT_SETTINGS_SET = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't set settings"});
                    break;
                default:
                    break;
            }
        }
    };


    var check_CHANNEL_LEAVE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't leave channel"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHANNEL_GET_USER_LIST = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get user list"});
                    break;
                default:
                    break;
            }
        }
    };


    var check_CHARACTER_SPAWN = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.INVALID_TOKEN:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Fatal error occurred, client is closing"});
                    quitClient();
                    break;
                case code.INVALID_CHARACTER:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Fatal error occurred, client is closing"});
                    quitClient();
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't spawn character"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHARACTER_DELETE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.INVALID_CHARACTER:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Fatal error occurred, client is closing"});
                    quitClient();
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't delete character"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_SYNC_TIME_WEATHER = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't sync weather"});
                    break;
                default:
                    break;
            }
        }
    };


    var check_SPAWN_RESOURCES = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't sync spawn resources"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_DESPAWN_RESOURCES = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't sync despawn resources"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_SPAWN_RESOURCES_INIT = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't init resources"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_CHANNEL_GET_BY_NAME = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get channel"});
                    break;
                case code.NOT_FOUND:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Channel not known"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_CHANNEL_GET_LIST = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get channellist"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHARACTER_SELECT = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't select character"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_AUTHENTICATION_LOGIN = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_WRONG_USER_OR_PASSWORD:
                case code.FAILED_USER_NOT_ACTIVE:
                case code.FAILED_SERVER_DOWN:
                case code.FAILED_MAINTENANCE:
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't login"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_AUTHENTICATION_LOGIN_BY_TOKEN = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_TO_OLD:
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't login by token"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_CHARACTER_LIST = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get character list"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHARACTER_SLOT_STATE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHARACTER_GUI_CREATE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    break;
                default:
                    break;
            }
        }
    };

    var check_GATHERING_RESULT = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Resultdata of mining invalid"});
                    break;
                default:
                    break;
            }
        }
    };

    var check_EQUIP_MAIN_HAND = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;

                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Main hand cant be equipped"});
                    break;
                default:
                    break;
            }
        }
    };

    /************************************************************* Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    this.AUTHENTICATION_TOKEN_REFRESH = function () {
        var deferred = $q.defer();

        var refreshTokenData = uiCommunicate.createData().AUTHENTICATION_TOKEN_REFRESH();
        uiCommunicate.callWeb(uiCommunicate.getCaller().AUTHENTICATION, uiCommunicate.getActions(uiCommunicate.getCaller().AUTHENTICATION).TOKEN_REFRESH, refreshTokenData).then(function (_data) {
                checkErrors(_data);
                check_AUTHENTICATION_TOKEN_REFRESH(_data);

                //Set token always for the user, the token for the engine is set by other processes
                if (_data.DATA && _data.DATA.TOKEN) {
                    uiUser.setToken(_data.DATA.TOKEN);
                }
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_AUTHENTICATION_TOKEN_REFRESH(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    /**
     * Logout the current user with or without token
     * @method
     * @param {string} [_token=""]
     * @constructor
     */
    this.AUTHENTICATION_LOGOUT = function (_token) {
        var deferred = $q.defer();
        uiCommunicate.logout(uiCommunicate.getCaller().AUTHENTICATION, uiCommunicate.getActions(uiCommunicate.getCaller().AUTHENTICATION).LOGOUT, {}, _token).then(function (_data) {
                checkErrors(_data);
                check_AUTHENTICATION_LOGOUT(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_AUTHENTICATION_LOGOUT(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.UNIGINE_CLOSE = function () {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).CLOSE, {}).then(function (_data) {
                checkErrors(_data);
                check_UNIGINE_CLOSE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_UNIGINE_CLOSE(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.CHARACTER_CREATE = function (_nickname, _forename, _surname, _locationId) {
        var createCharacterData = uiCommunicate.createData().CHARACTER_CREATE(_nickname, _forename, _surname, _locationId);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).CREATE, createCharacterData).then(function (_data) {
                checkErrors(_data);
                check_CHARACTER_CREATE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHARACTER_CREATE(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.CHARACTER_GUI_SELECTION = function () {
        var selectionGUIData = uiCommunicate.createData().CHARACTER_GUI_SELECTION();
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).GUI_SELECTION, selectionGUIData).then(function (_data) {
                checkErrors(_data);
                check_CHARACTER_GUI_SELECTION(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.UNIGINE_UI_ENTER = function () {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).UI_ENTER, {}).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    this.UNIGINE_UI_LEAVE = function () {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).UI_LEAVE, {}).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.ACCOUNT_SETTINGS_GET = function () {

        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().ACCOUNT, uiCommunicate.getActions(uiCommunicate.getCaller().ACCOUNT).SETTINGS_GET, uiCommunicate.createData().ACCOUNT_SETTINGS_GET())
            .then(function (_data) {
                    checkErrors(_data);
                    check_ACCOUNT_SETTINGS_GET(_data);
                    deferred.resolve(_data);
                },
                function (_data) {
                    checkErrors(_data);
                    check_ACCOUNT_SETTINGS_GET(_data);
                    deferred.reject(_data);
                }
            );
        return deferred.promise;
    };

    this.ACCOUNT_SETTINGS_SET = function (_callEngine, _data) {
        if (!_data) {
            _data = {};
        }
        var deferred = $q.defer();
        if (_callEngine) {
            uiCommunicate.callEngine(uiCommunicate.getCaller().ACCOUNT, uiCommunicate.getActions(uiCommunicate.getCaller().ACCOUNT).SETTINGS_SET,
                _data)
                .then(function (_data) {
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        deferred.reject(_data);
                    }
                );
        }
        else {
            uiCommunicate.callWeb(uiCommunicate.getCaller().ACCOUNT, uiCommunicate.getActions(uiCommunicate.getCaller().ACCOUNT).SETTINGS_SET,
                _data)
                .then(function (_data) {
                        checkErrors(_data);
                        check_ACCOUNT_SETTINGS_SET(_data);
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        checkErrors(_data);
                        check_ACCOUNT_SETTINGS_SET(_data);
                        deferred.reject(_data);
                    }
                );
        }
        return deferred.promise;
    };


    this.CHANNEL_LEAVE = function (_channelId) {
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CHANNEL, uiCommunicate.getActions(uiCommunicate.getCaller().CHANNEL).LEAVE, {UUID: _channelId}).then(
            function (_data) {
                checkErrors(_data);
                check_CHANNEL_LEAVE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHANNEL_LEAVE(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };

    this.CHANNEL_GET_USER_LIST = function (_channelId) {
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CHANNEL, uiCommunicate.getActions(uiCommunicate.getCaller().CHANNEL).GET_USER_LIST, {UUID: _channelId}).then(
            function (_data) {
                checkErrors(_data);
                check_CHANNEL_GET_USER_LIST(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHANNEL_GET_USER_LIST(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };

    this.UNIGINE_SET_STATE = function (_id, _data) {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).SET_STATE, {
            KEY: _id,
            DATA: _data
        }).then(
            function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            });
        return deferred.promise;
    };

    this.UNIGINE_GET_STATE = function (_id) {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).GET_STATE, {KEY: _id}).then(
            function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            });
        return deferred.promise;
    };

    this.CHARACTER_UNSTUCK = function () {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).UNSTUCK, {}).then(
            function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            });
        return deferred.promise;
    };


    /**
     *
     * @param {boolean} _callEngine
     * @param _characterId
     * @param _token
     * @returns {promise|*|d.promise}
     * @constructor
     */
    this.CHARACTER_SPAWN = function (_callEngine, _characterId, _token) {
        var deferred = $q.defer();

        if (_callEngine) {
            uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).SPAWN,
                uiCommunicate.createData().CHARACTER_SPAWN(_characterId, _token))
                .then(function (_data) {

                        deferred.resolve(_data);
                    },
                    function (_data) {

                        deferred.reject(_data);
                    }
                );
        }
        else {
            uiCommunicate.callWeb(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).SPAWN,
                uiCommunicate.createData().CHARACTER_SPAWN(_characterId, _token))
                .then(function (_data) {
                        checkErrors(_data);
                        check_CHARACTER_SPAWN(_data);
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        checkErrors(_data);
                        check_CHARACTER_SPAWN(_data);
                        deferred.reject(_data);
                    }
                );
        }

        return deferred.promise;
    };


    /**
     *
     * @param {boolean} _callEngine
     * @param _characterId
     * @returns {promise|*|d.promise}
     * @constructor
     */
    this.CHARACTER_DELETE = function (_callEngine, _characterId) {
        var deferred = $q.defer();
        if (_callEngine) {
            uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).DELETE,
                uiCommunicate.createData().CHARACTER_DELETE(_characterId))
                .then(function (_data) {
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        deferred.reject(_data);
                    }
                );
        }
        else {
            uiCommunicate.callWeb(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).DELETE,
                uiCommunicate.createData().CHARACTER_DELETE(_characterId))
                .then(function (_data) {
                        checkErrors(_data);
                        check_CHARACTER_DELETE(_data);
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        checkErrors(_data);
                        check_CHARACTER_DELETE(_data);
                        deferred.reject(_data);
                    }
                );
        }

        return deferred.promise;
    };

    this.SYNC_TIME_WEATHER = function (_callEngine, _data) {

        if (!_data) {
            _data = {};

        }

        var deferred = $q.defer();
        if (_callEngine) {
            uiCommunicate.callEngine(uiCommunicate.getCaller().SYNC, uiCommunicate.getActions(uiCommunicate.getCaller().SYNC).TIME_WEATHER, _data)
                .then(function (_data) {
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        deferred.reject(_data);
                    }
                );
        }
        else {

            uiCommunicate.callWeb(uiCommunicate.getCaller().SYNC, uiCommunicate.getActions(uiCommunicate.getCaller().SYNC).TIME_WEATHER, _data)
                .then(function (_data) {
                        checkErrors(_data);
                        check_SYNC_TIME_WEATHER(_data);
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        checkErrors(_data);
                        check_SYNC_TIME_WEATHER(_data);
                        deferred.reject(_data);
                    }
                );
        }

        return deferred.promise;
    };


    this.SPAWN_RESOURCES = function (_data) {

        if (!_data) {
            _data = {};
        }

        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().SYNC, uiCommunicate.getActions(uiCommunicate.getCaller().SYNC).SPAWN_RESOURCES, _data)
            .then(function (_data) {
                    checkErrors(_data);
                    check_SPAWN_RESOURCES(_data);
                    deferred.resolve(_data);
                },
                function (_data) {
                    checkErrors(_data);
                    check_SPAWN_RESOURCES(_data);
                    deferred.reject(_data);
                }
            );

        return deferred.promise;
    };

    this.DESPAWN_RESOURCES = function (_data) {

        if (!_data) {
            _data = {};
        }

        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().SYNC, uiCommunicate.getActions(uiCommunicate.getCaller().SYNC).DESPAWN_RESOURCES, _data)
            .then(function (_data) {
                    checkErrors(_data);
                    check_DESPAWN_RESOURCES(_data);
                    deferred.resolve(_data);
                },
                function (_data) {
                    checkErrors(_data);
                    check_DESPAWN_RESOURCES(_data);
                    deferred.reject(_data);
                }
            );

        return deferred.promise;
    };

    this.SPAWN_RESOURCES_INIT = function (_callEngine, _data) {

        if (!_data) {
            _data = {};
        }

        var deferred = $q.defer();
        if (_callEngine) {
            uiCommunicate.callEngine(uiCommunicate.getCaller().SYNC, uiCommunicate.getActions(uiCommunicate.getCaller().SYNC).SPAWN_RESOURCES_INIT, _data)
                .then(function (_data) {
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        deferred.reject(_data);
                    }
                );
        }
        else {

            uiCommunicate.callWeb(uiCommunicate.getCaller().SYNC, uiCommunicate.getActions(uiCommunicate.getCaller().SYNC).SPAWN_RESOURCES_INIT, _data)
                .then(function (_data) {
                        checkErrors(_data);
                        check_SPAWN_RESOURCES_INIT(_data);
                        deferred.resolve(_data);
                    },
                    function (_data) {
                        checkErrors(_data);
                        check_SPAWN_RESOURCES_INIT(_data);
                        deferred.reject(_data);
                    }
                );
        }

        return deferred.promise;
    };


    this.CHANNEL_GET_BY_NAME = function (_channelName) {
        var deferred = $q.defer();

        var channelNameData = uiCommunicate.createChannelData().GET_CHANNEL_NAME(_channelName);
        uiCommunicate.callWeb(uiCommunicate.getCaller().CHANNEL, uiCommunicate.getActions(uiCommunicate.getCaller().CHANNEL).GET_BY_NAME, channelNameData).then(function (_data) {
                checkErrors(_data);
                check_CHANNEL_GET_BY_NAME(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHANNEL_GET_BY_NAME(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;

    };

    this.CHANNEL_GET_LIST = function () {
        var deferred = $q.defer();

        var getListData = uiCommunicate.createChannelData().GET_LIST();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CHANNEL, uiCommunicate.getActions(uiCommunicate.getCaller().CHANNEL).GET_LIST, getListData).then(function (_data) {
                checkErrors(_data);
                check_CHANNEL_GET_LIST(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHANNEL_GET_LIST(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.CHARACTER_SELECT = function (_characterId, _slotId) {
        var deferred = $q.defer();


        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).SELECT,
            uiCommunicate.createData().CHARACTER_SELECT(_characterId, _slotId)).then(function (_data) {
                checkErrors(_data);
                check_CHARACTER_SELECT(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHARACTER_SELECT(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    /**
     * Login
     * @param _username
     * @param _password
     * @returns {promise|*|d.promise}
     * @method
     */
    this.AUTHENTICATION_LOGIN = function (_username, _password) {
        var deferred = $q.defer();
        uiCommunicate.login(uiCommunicate.getCaller().AUTHENTICATION, uiCommunicate.getActions(uiCommunicate.getCaller().AUTHENTICATION).LOGIN,
            uiCommunicate.createData().AUTHENTICATION_LOGIN(_username, _password)).then(function (_data) {
                checkErrors(_data);
                check_AUTHENTICATION_LOGIN(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_AUTHENTICATION_LOGIN(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    /**
     *
     * @param _data
     * @returns {promise|*|d.promise}
     * @method
     */
    this.UNIGINE_GET_TOKEN = function (_data) {
        if (!_data) {
            _data = {};
        }
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).GET_TOKEN, _data).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    /**
     *
     * @param _data
     * @returns {promise|*|d.promise}
     * @method
     */
    this.UNIGINE_SET_TOKEN = function (_token) {
        if (!_token) {
            _token = "";
        }
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).SET_TOKEN, {"TOKEN": _token}).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    this.UNIGINE_SET_GUI_STATE = function (_state) {
        if (!_state) {
            _state = {};
        }
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).SET_GUI_STATE, _state).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.UNIGINE_GET_GUI_STATE = function () {
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).GET_GUI_STATE, {}).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    /**
     *
     * @param _token
     * @returns {promise|*|d.promise}
     * @method
     */
    this.AUTHENTICATION_LOGIN_BY_TOKEN = function (_token) {
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().AUTHENTICATION, uiCommunicate.getActions(uiCommunicate.getCaller().AUTHENTICATION).LOGIN_BY_TOKEN,
            uiCommunicate.createData().AUTHENTICATION_LOGIN_BY_TOKEN(_token))
            .then(function (_data) {
                    checkErrors(_data);
                    check_AUTHENTICATION_LOGIN_BY_TOKEN(_data);
                    deferred.resolve(_data);
                },
                function (_data) {
                    checkErrors(_data);
                    check_AUTHENTICATION_LOGIN_BY_TOKEN(_data);
                    deferred.reject(_data);
                }
            );
        return deferred.promise;
    };

    this.UNIGINE_AJS_READY = function (_data) {
        if (!_data) {
            _data = {};
        }
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).AJS_READY, _data).then(function (_data) {
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    /**
     *
     * @param _data
     * @returns {promise|*|d.promise}
     * @method
     */
    this.CHARACTER_LIST = function (_data) {
        if (!_data) {
            _data = {};
        }
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).LIST, uiCommunicate.createData().CHARACTER_LIST()).then(function (_data) {
                deferred.resolve(_data);
                checkErrors(_data);
                check_CHARACTER_LIST(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHARACTER_LIST(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    /**
     *
     * @param _data
     * @returns {promise|*|d.promise}
     * @method
     */
    this.CHARACTER_SLOT_STATE = function (_data) {
        if (!_data) {
            _data = {};
        }
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).SLOT_STATE, _data).then(function (_data) {
                checkErrors(_data);
                check_CHARACTER_SLOT_STATE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHARACTER_SLOT_STATE(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.CHARACTER_GUI_CREATE = function () {
        var createGUIData = uiCommunicate.createData().CHARACTER_GUI_CREATE();
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).GUI_CREATE, createGUIData).then(function (_data) {
                checkErrors(_data);
                check_CHARACTER_GUI_CREATE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_CHARACTER_GUI_CREATE(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    /**
     *
     * @param _minigameId
     * @param _itemId
     * @param _layerId
     * @param _value
     * @returns {promise|*|d.promise}
     * @example
     * [
     {
     STORAGE: ID
     ITEMS: [{"IS_STACKED":true,"WIDTH":1,"WEIGHT":0,"NAME":"StackingBagItem","TEMPLATE":4,"SLOT":10,"IS_BANK":false,"ID":8,"HEIGHT":1}]
     }
     ]                                                                                                                                                                
     * @constructor
     */
    this.GATHERING_RESULT = function (_minigameId, _itemId, _layerId, _value) {
        var gatheringResultData = uiCommunicate.createData().GATHERING_RESULT(_minigameId, _itemId, _layerId, _value);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().GATHERING, uiCommunicate.getActions(uiCommunicate.getCaller().GATHERING).RESULT, gatheringResultData).then(function (_data) {
                checkErrors(_data);
                check_GATHERING_RESULT(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_GATHERING_RESULT(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.EQUIP_TORCH = function(_state){
        ///TODO Remove in next version for equip main hand.
        var torchData = uiCommunicate.createData().CHARACTER_TORCH(_state);
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).TORCH, torchData).then(function (_data) {
                checkErrors(_data);
                //check_EQUIP_MAIN_HAND(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                //check_EQUIP_MAIN_HAND(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.EQUIP_MAIN_HAND = function (_id) {
        var gatheringResultData = uiCommunicate.createData().EQUIP_MAIN_HAND(_id);
        var deferred = $q.defer();
        uiCommunicate.callEngine(uiCommunicate.getCaller().CHARACTER, uiCommunicate.getActions(uiCommunicate.getCaller().CHARACTER).EQUIP_MAIN_HAND, gatheringResultData).then(function (_data) {
                checkErrors(_data);
                check_EQUIP_MAIN_HAND(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_EQUIP_MAIN_HAND(_data);
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    /************************************************************** Public - PROPERTIES - START ***********************************************************/


    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/
    me = this;
    init();

}


