/**
 * Handels the client communication with django-server, unigine-client, django-channels.
 * @param {$q} $q
 * @param {$timeout} $timeout
 * @param {$rootScope} $rootScope
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @param {UIService} uiService
 * @param {UICommunicateData} uiCommunicateData
 * @param {UIChannelData} uiChannelData
 * @param {UIBroadcastData} uiBroadcastData
 * @param {UIUser} uiUser
 * @class UICommunicate
 * @static
 * @constructor
 */
function UICommunicate($q, $timeout, $rootScope, helperService, logService, uiService, uiCommunicateData, uiChannelData, uiBroadcastData, uiUser) {

    /************************************************************** Private - Variables - START *****************************************************/

    var me;

    /**
     * @type {HelperService}
     * @private
     */
    var hs = null;

    /**
     *
     * @type {LogService}
     * @private
     */
    var ls = null;

    /**
     *
     * @type {UICommunicateData}
     * @private
     */
    var uiCData = null;


    /**
     *
     * @type {UIBroadcastData}
     * @private
     */
    var uiBData = null;


    /**
     * Inherits the engine call name
     * @private
     * @type {string}
     */
    var cppEngineExportName = "ShareJson";

    /**
     * Inherits the engine log call name.
     * @private
     * @type {string}
     */
    var cppEngineLogExportName = "LogEngine";

    /**
     *
     * @type {{QUIT: string, RELOAD: string}}
     */
    var syncBroadcastTypes = {
        QUIT: "QUIT",
        RELOAD: "RELOAD"
    };

    /**
     * @private
     * @type {Array}
     */
    var attachedSyncBroadcast = [];

    var broadcastTypes = {
        DISABLE_ENTER: "DISABLE_ENTER",
        ENABLE_ENTER: "ENABLE_ENTER",
        REGISTER_STORAGE: "REGISTER_STORAGE",
        TASKBAR_TOGGLE_STORAGE: "TASKBAR_TOGGLE_STORAGE",
        STORAGE_TOGGLE: "STORAGE_TOGGLE",
        TASKBAR_REGISTER_STORAGE: "TASKBAR_REGISTER_STORAGE",
        UI_BRING_TO_FRONT: "UI_BRING_TO_FRONT",
        //Someone stumbled into new area show overlay
        ENTERED_AREA: "ENTERED_AREA",
        OPEN_BANK: "OPEN_BANK",
        STORAGE_ADD_ITEM: "STORAGE_ADD_ITEM"
    };
    /************************************************************** Private - Variables - END *******************************************************/

    /************************************************************** Private - Functions - START *****************************************************/

    /**
     * @constructor
     */
    var init = function () {
        hs = helperService;
        ls = logService;
        uiCData = uiCommunicateData;
        uiBData = uiBroadcastData;


        if (typeof engine !== 'undefined') {
            engine.on('onJsonData', onJsonData);
        }


    };

    /**
     * Called from engine with _data as stringified json
     * @event onJsonData
     * @param {string} _data - JSON with caller,action.
     */
    var onJsonData = function onJsonData(_data) {
        var data = JSON.parse(_data);
        var jsonCaller = caller;
        ls.logRESP("UICommunicate - onJsonData : " + _data);
        var selfService = angular.element(document).injector().get("uiCommunicate");
        switch (data.CALLER) {
            case jsonCaller.UNIGINE:

                var jsonAction = actionMap[data.CALLER];
                switch (data.ACTION) {
                    case jsonAction.JSON_EVENT:

                        if (data.DATA.VIEW) {
                            uiService.showUI(uiService.getUiViews()[data.DATA.VIEW]);
                        }
                        //We come from char-selection and wait for engine spawn event.
                        if (data.DATA.CHARACTER_SPAWNED) {
                            var uiCommunicateModel = angular.element(document).injector().get("uiCommunicateModel");
                            uiCommunicateModel.SPAWN_RESOURCES_INIT(false, {}).then(function (_data) {
                                var data = _data;
                                uiCommunicateModel.SPAWN_RESOURCES_INIT(true, data);
                            });
                            uiService.showUI(uiService.getUiViews().CHAT);
                            uiService.showUI(uiService.getUiViews().TASKBAR);

                        }
                        if (data.DATA.TORCH == 0 || data.DATA.TORCH == 1)
                        {
                               selfService.broadcast("torch", {STATE: data.DATA.TORCH})
                        }
                        //We come from char-selection and wait for engine spawn event.
                        if (data.DATA.EQUIP_MAIN_HAND === 0 || data.DATA.EQUIP_MAIN_HAND === 1 || data.DATA.EQUIP_MAIN_HAND === 2) {

                            selfService.broadcast("equipMainHand", {STATE: data.DATA.EQUIP_MAIN_HAND})
                        }

                        break;
                }

                break;
            case jsonCaller.CHARACTER:
                var jsonAction = actionMap[data.CALLER];

                switch (data.ACTION) {
                    case jsonAction.TORCH: {
                        //We come from char-selection and wait for engine spawn event.
                        if (data.DATA.TORCH === 0 || data.DATA.TORCH === 1) {

                            //Workarround cause we come from engine and don't know the service instance anymore =(
                            var selfService = angular.element(document).injector().get("uiCommunicate");
                            selfService.broadcast("toggleTorch", {STATE: data.DATA.TORCH});

                        }
                    }
                }

                break;
            case jsonCaller.WORLD:
                var jsonAction = actionMap[data.CALLER];
                switch (data.ACTION) {
                    case jsonAction.NEW_LOCATION:
                        if (data.DATA.ID) {
                            selfService.broadcast(selfService.getBroadcastTypes().ENTERED_AREA, selfService.createBroadcastData().ENTERED_AREA(data.DATA.ID));
                        }
                        break;

                }
                break;
            case jsonCaller.STORAGE:
                var jsonAction = actionMap[data.CALLER];
                switch (data.ACTION) {
                    case jsonAction.OPEN_BANK:
                        if (data.DATA.ID) {
                            selfService.broadcast(selfService.getBroadcastTypes().OPEN_BANK, selfService.createBroadcastData().OPEN_BANK(data.DATA.ID));
                        }
                        break;
                }
                break;
            case jsonCaller.GATHERING_3D:
                var jsonAction = actionMap[data.CALLER];
                switch (data.ACTION) {

                    case jsonAction.CREATE_GUI:
                        uiService.showUI(uiService.getUiViews().GATHERING_MINING);
                        break;
                    case jsonAction.DESTROY_GUI:
                        uiService.destroyUI(uiService.getUiViews().GATHERING_MINING);
                        break;

                    case jsonAction.MINING_START:
                        var instacedScope = uiService.getUIScope(uiService.getUiViews().GATHERING_MINING);
                        instacedScope.START_MINING();
                        break;


                    case jsonAction.MINING_STOP:
                        var instacedScope = uiService.getUIScope(uiService.getUiViews().GATHERING_MINING);
                        instacedScope.STOP_MINING();
                        break;
                }
                break;
            case jsonCaller.GATHERING:
                var jsonAction = actionMap[data.CALLER];
                switch (data.ACTION) {

                    case jsonAction.UI_RESULT:
                        var minigameId = data.DATA.ID;
                        var itemId = data.DATA.ITEMID;//ore id
                        var layerId = data.DATA.LAYERID;
                        var instacedScope = uiService.getUIScope(uiService.getUiViews().GATHERING_MINING);
                        if (instancedScope !== null) {
                            instancedScope.UI_RESULT(minigameId, itemId, layerId);
                        }
                        else {
                            ls.logERR("UICommunicate - onJsonData - GATHERING _ UI_RESULT - View not open");
                        }

                        //Send this to minigame.
                        break;
                }
                break;


        }


    };


    /**
     * Checks if the passed callerId is valid
     * @method
     * @private
     * @param {number/getCaller} _callerId - Callerid
     * @returns {boolean}
     */
    var callerValid = function (_callerId) {
        if (_callerId === undefined) {
            return false;
        }
        for (var callerKey in caller) {

            if (caller[callerKey] === _callerId) {
                return true;
            }
        }

        return false;
    };

    /**
     * Checks if the passed action with the caller is valud
     * @method
     * @param {number} _callerId - Callerid
     * @param {number} _actionId - ActionId
     * @returns {boolean}
     */
    var actionValid = function (_callerId, _actionId) {
        if (_callerId === undefined || _actionId === undefined) {
            return false;
        }
        for (var callerKey in caller) {
            if (caller[callerKey] === _callerId) {

                for (var actionKey in actionMap) {
                    actionKey = parseInt(actionKey);
                    if (getKeyByValue(actionMap[actionKey], _actionId) !== undefined) {
                        return true;
                    }
                }
            }
        }

        return false;
    };
    /**
     * Get the key for the object by the passed value
     * @property getKeyByValue
     * @param {element} _obj - The object
     * @param {object} _value - The value to check
     * @type {string/undefined}
     * @returns {string/undefined} - The key else undefined
     */
    var getKeyByValue = function (_obj, _value) {
        for (var prop in _obj) {
            if (_obj.hasOwnProperty(prop)) {
                if (_obj[prop] === _value)
                    return prop;
                // return prop;
            }
        }
        return undefined;
    };


    /************************************************************** Private - Functions - End *******************************************************/


    /************************************************************** Public - Functions - START ******************************************************/
    /**
     * Checks if the passed callerId is valid
     * @method
     * @private
     * @param {number/getCaller} _callerId - Callerid
     * @returns {boolean}
     */
    this.callerValid = function (_callerId) {
        return callerValid(_callerId)
    };

    /**
     * Checks if the passed action with the caller is valud
     * @method
     * @param {number} _callerId - Callerid
     * @param {number} _actionId - ActionId
     * @returns {boolean}
     */
    this.actionValid = function (_callerId, _actionId) {
        return actionValid(_callerId, _actionId)
    };

    /**
     * Get the key for the object by the passed value
     * @property getKeyByValue
     * @param {element} _obj - The object
     * @param {object} _value - The value to check
     * @type {string/undefined}
     * @returns {string/undefined} - The key else undefined
     */
    this.getKeyByValue = function (_obj, _value) {
        return getKeyByValue(_obj, _value);
    };


    this.broadcast = function (_type, _data) {

        $rootScope.$broadcast(_type, {DATA: _data});
    };

    /**
     *
     * @returns {{QUIT: string}}
     */
    this.getSyncBroadcastTypes = function getSyncBroadcastTypes() {
        return syncBroadcastTypes;
    };

    this.syncBroadcast = function syncBroadcast(_type) {
        if (getKeyByValue(syncBroadcastTypes, _type) === undefined) {
            ls.logErr("Undefined BroadcastType" + _type);
            return;
        }
        ls.logINFO("Start broadcast" + _type);
        var deferred = $q.defer();

        var broadcastArr = [];
        for (var i = 0; i < attachedSyncBroadcast.length; i++) {
            if (attachedSyncBroadcast[i].type === _type) {
                broadcastArr.push(attachedSyncBroadcast[i]);
            }
        }

        var broadcastPromises = 0;
        for (var i = 0; i < broadcastArr.length; i++) {
            var returnedPromise = broadcastArr[i].callback();
            if (returnedPromise && returnedPromise.hasOwnProperty("then") === true) {

                //promise returned
                returnedPromise.then(function () {
                    broadcastPromises += 1;
                    if (broadcastPromises === broadcastArr.length) {
                        //All broadcasts recieved, callback now.
                        ls.logINFO("Broadcast finished" + _type);
                        deferred.resolve();
                    }
                });
            } else {
                //No promise - count up
                broadcastPromises += 1;
                if (broadcastPromises === broadcastArr.length) {
                    //All broadcasts recieved, callback now.
                    //Maybe we just got no promises back, for take sure, do a timeout so we'll resolve.
                    $timeout(function () {
                        ls.logINFO("Broadcast finished" + _type);
                        deferred.resolve();
                    }, 0, false);
                }
            }
        }

        if (broadcastArr.length === 0) {
            //Reslove immediately
            $timeout(function () {

                ls.logINFO("No broadcasts attached: " + _type);
                deferred.resolve();
            }, 0, false);
        }
        return deferred.promise;
    };

    this.$onSynchBroadcast = function $onSynchBroadcast(_viewName, _type, _callback) {
        var alreadyAttached = false;
        if (!_type, !_callback) {
            //Undefined callback
            return;
        }
        if (_viewName === undefined) {
            _viewName = "";
        }
        if (_viewName !== "") {
            for (var i = 0; i < attachedSyncBroadcast.length; i++) {
                if (attachedSyncBroadcast[i].viewName === _viewName) {
                    alreadyAttached = true;
                    break;
                }
            }
        }
        if (alreadyAttached === false) {
            var synchBroadcast = {
                viewName: _viewName,
                callback: _callback,
                type: _type
            };
            attachedSyncBroadcast.push(synchBroadcast);
        }
    };

    /**
     * Returns the caller
     * @property getCaller
     * @readOnly
     * @type {element}
     * @returns caller
     */
    this.getCaller = function () {
        return caller;
    };


    /**
     * Get the actions for the passed caller
     * @property getActions
     * @readOnly
     * @param {number|getCaller} _caller
     * @type {actionMap}
     * @returns {number|actionMap}
     */
    this.getActions = function (_caller) {

        var actions = {};

        if (callerValid(_caller) === true) {
            if (actionMap[_caller] !== undefined) {
                actions = actionMap[_caller];
            }
            else {
                ls.log("Actions not existing for caller: " + _caller, ls.logType().ERR, false, true);
            }
        }
        else {
            ls.log("Caller not defined: " + _caller, ls.logType().ERR, false, true);
        }


        return actions;
    };

    /**
     * Returns all return codes for the passed caller and action.
     * @property getCodeMap
     * @param {number|getCaller}_caller
     * @param {number|getActions} _action
     * @returns {codeMap/element}
     */
    this.getCodeMap = function (_caller, _action) {
        return codeMap[_caller][_action];
    };

    /**
     *
     * @returns {{REGISTER_STORAGE: string, TASKBAR_TOGGLE_STORAGE: string, STORAGE_TOGGLE: string, TASKBAR_REGISTER_STORAGE: string}}
     */
    this.getBroadcastTypes = function getBroadcastTypes() {
        return broadcastTypes;
    };


    /**
     * Django call, passed callback is called after the request run through
     * @method
     * @param {number/getCaller} _caller
     * @param {number/getActions} _action
     * @param {json} _data
     * @return {Promise}
     */
    this.callWeb = function (_caller, _action, _data) {
        var deferred = $q.defer();

        var webCaller = _caller;
        var action = _action;
        var data = _data;

        if (callerValid(webCaller) !== undefined) {
            if (actionValid(webCaller, action)) {
                //CALL WEB
                var token = uiUser.getToken();
                if (token) {
                    //angular.element(document).injector().get("uiCommunicate").webCallback(1, '{}');
                    ls.logSEND("UICommunicate - Call Web - " + JSON.stringify({
                            'CALLER': getKeyByValue(caller, webCaller),
                            'ACTION': getKeyByValue(actionMap[webCaller], action),
                            'DATA': data
                        }));

                    var header = {
                        "Authorization": "Token " + token
                    };

                    $.ajax({
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify({
                            'CALLER': webCaller,
                            'ACTION': action,
                            'DATA': data
                        }),
                        method: "POST",
                        url: "interface/request/",
                        cache: false,
                        success: function (_data) {
                            var parsedJSON = _data;
                            var parsedLogContent = copyData(_data);

                            parsedLogContent.CODE = getKeyByValue(codeMap[parsedLogContent.CALLER][parsedLogContent.ACTION], parsedLogContent.CODE);
                            parsedLogContent.ACTION = getKeyByValue(actionMap[parsedLogContent.CALLER], parsedLogContent.ACTION);
                            parsedLogContent.CALLER = getKeyByValue(caller, parsedLogContent.CALLER);

                            ls.logRESP("UICommunicate - callWeb - " + JSON.stringify(parsedLogContent));

                            deferred.resolve(parsedJSON);
                        },
                        error: function (_data) {
                            try {
                                ls.logERR("UICommunicate - callWeb - ERROR HAS OCCURED DURING REQUEST" + JSON.stringify(_data));
                            }
                            catch (Ex) {
                                ls.logERR("UICommunicate - callWeb -  ERROR HAS OCCURED DURING REQUEST, we could not log error data");

                            }
                            deferred.reject(_data);
                        },
                        headers: header

                    });

                }
                else {
                    ls.log("Token is not existing for: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
                }

            }
            else {
                ls.log("Action not defined: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
            }

        }
        else {
            ls.log("Caller not defined: " + webCaller, ls.logType().ERR, false, true);
        }

        return deferred.promise;
    };


    /**
     * Copy array or object
     * @method
     * @private
     * @param {[]*,{}*} _value
     */
    var copyData = function (_value) {
        if (_value.constructor == Array) {
            return $.extend(true, [], _value);
        }
        else {
            return $.extend(true, {}, _value);
        }
    };

    /**
     * login the user
     * @param {number/getCaller} _caller
     * @param {number/getActions} _action
     * @param {json} _data
     * @method
     */
    this.login = function (_caller, _action, _data) {
        var deferred = $q.defer();

        var webCaller = _caller;
        var action = _action;
        var data = _data;

        if (callerValid(webCaller) !== undefined) {
            if (actionValid(webCaller, action)) {
                //CALL WEB


                //angular.element(document).injector().get("uiCommunicate").webCallback(1, '{}');
                ls.logSEND("UICommunicate - Login - " + JSON.stringify({
                        'CALLER': getKeyByValue(caller, webCaller),
                        'ACTION': getKeyByValue(actionMap[webCaller], action),
                        'DATA': data
                    }));

                var header = {};

                $.ajax({
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'CALLER': webCaller,
                        'ACTION': action,
                        'DATA': data
                    }),
                    method: "POST",
                    url: "interface/login/",
                    cache: false,
                    success: function (_data) {

                        var parsedJSON = _data;
                        var parsedLogContent = copyData(_data);

                        parsedLogContent.CODE = getKeyByValue(codeMap[parsedLogContent.CALLER][parsedLogContent.ACTION], parsedLogContent.CODE);
                        parsedLogContent.ACTION = getKeyByValue(actionMap[parsedLogContent.CALLER], parsedLogContent.ACTION);
                        parsedLogContent.CALLER = getKeyByValue(caller, parsedLogContent.CALLER);

                        ls.logRESP("UICommunicate - Login - " + JSON.stringify(parsedLogContent));
                        deferred.resolve(parsedJSON);
                    },
                    error:function(_data){
                        ls.logRESP("UICommunicate - Login - Error occured");
                    },
                    headers: header

                });


            }
            else {
                ls.log("Action not defined: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
            }

        }
        else {
            ls.log("Caller not defined: " + webCaller, ls.logType().ERR, false, true);
        }

        return deferred.promise;

    };

    /**
     * Logout the actual authenticated user
     * @param {number/getCaller} _caller
     * @param {number/getActions} _action
     * @param {json} _data
     * @param {string} [_token=""]
     * @method
     */
    this.logout = function (_caller, _action, _data, _token) {
        var deferred = $q.defer();
        var webCaller = _caller;
        var action = _action;
        var data = JSON.stringify(_data);

        if (callerValid(webCaller) !== undefined) {
            if (actionValid(webCaller, action)) {


                //angular.element(document).injector().get("uiCommunicate").webCallback(1, '{}');
                ls.logSEND("UICommunicate - Logout - " + JSON.stringify({
                        'CALLER': getKeyByValue(caller, webCaller),
                        'ACTION': getKeyByValue(actionMap[webCaller], action),
                        'DATA': data
                    }));

                var tokenHeader = {};
                if (_token != undefined && _token != null && _token != "") {
                    ls.logSEND("UICommunicate - Logout - Logout with token: " + _token);
                    tokenHeader = {
                        "Authorization": "Token " + _token
                    }
                }

                $.ajax({
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'CALLER': webCaller,
                        'ACTION': action,
                        'DATA': data
                    }),
                    method: "POST",
                    url: "interface/logout/",
                    cache: false,
                    success: function (_data) {

                        var parsedJSON = _data;
                        var parsedLogContent = copyData(_data);

                        parsedLogContent.CODE = getKeyByValue(codeMap[parsedLogContent.CALLER][parsedLogContent.ACTION], parsedLogContent.CODE);
                        parsedLogContent.ACTION = getKeyByValue(actionMap[parsedLogContent.CALLER], parsedLogContent.ACTION);
                        parsedLogContent.CALLER = getKeyByValue(caller, parsedLogContent.CALLER);

                        ls.logRESP("UICommunicate - Logout - " + JSON.stringify(parsedLogContent));

                        deferred.resolve(parsedJSON);
                    },
                    error:function (_data){
                        ls.logRESP("UICommunicate - Logout - Error occured");
                        //Even when we run into an error, we resolve our function
                        deferred.resolve();
                    },
                    headers: tokenHeader

                });


            }
            else {
                ls.log("Action not defined: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
            }

        }
        else {
            ls.log("Caller not defined: " + webCaller, ls.logType().ERR, false, true);
        }

        return deferred.promise;

    };


    /**
     * Fire & Forget - log to engine
     * Optional call of our logservice.
     * Normal call would went into an endless repeat loop.
     * @param {string} _logMessage
     * @return - not existing.
     */
    this.logToEngine = function (_caller, _action, _logMessage) {

        var logMessage = _logMessage;

        //CALL WEB
        var engineCallData = JSON.stringify({
            'CALLER': _caller,
            'ACTION': _action,
            'REQUEST': -1,
            'DATA': logMessage
        });

        engine.call(cppEngineExportName, _caller, _action, engineCallData).then(function (_data) {
                //Who the fuck needs logging if its already got logged?
            },
            function (type, message) {
                // Will be called on error
                //Want an endless repeat loop?
            });
    };

    /**
     * CPP Engine call, passed callback is called after the request run through
     * @method
     * @param {number/getCaller} _caller
     * @param {number/getActions} _action
     * @param {json} _data
     * @return {promise}
     */
    this.callEngine = function callEngine(_caller, _action, _data) {
        var deferred = $q.defer();
        var engineCaller = _caller;
        var action = _action;
        var data = _data;

        // var callback =  _callback;

        //ls.logSEND("test blaa - " + engineCaller + "-" + action + "-"+  data,true,true);
        if (callerValid(engineCaller) !== undefined) {
            if (actionValid(engineCaller, action)) {
                //CALL WEB
                var engineCallData = JSON.stringify({
                    'CALLER': engineCaller,
                    'ACTION': action,
                    'REQUEST': -1,
                    'DATA': data
                });

                var skipLogging = false;

                if (engineCaller === me.getCaller().UNIGINE && (action !== me.getActions(me.getCaller().UNIGINE).UI_ENTER || action !== me.getActions(me.getCaller().UNIGINE).UI_LEAVE)) {
                    skipLogging = true;
                }
                else {
                    skipLogging = false;
                }

                //Don't log this actions because unneccessary overhead
                if (skipLogging == false) {
                    ls.logSEND("UICommunicate - Call Engine - " + JSON.stringify({
                            CALLER: getKeyByValue(caller, engineCaller),
                            ACTION: getKeyByValue(actionMap[engineCaller], action),
                            REQUEST: -1,
                            DATA: data
                        }));
                }

                try {
                    //engineCallData = encodeURIComponent(engineCallData);
                    engine.call(cppEngineExportName, engineCaller, action, engineCallData).then(function (_data) {
                            var parsedJSON = JSON.parse(_data);
                            var parsedLogContent = JSON.parse(_data);

                            parsedLogContent.CODE = getKeyByValue(codeMap[parsedLogContent.CALLER][parsedLogContent.ACTION], parsedLogContent.CODE);
                            parsedLogContent.ACTION = getKeyByValue(actionMap[parsedLogContent.CALLER], parsedLogContent.ACTION);
                            parsedLogContent.CALLER = getKeyByValue(caller, parsedLogContent.CALLER);
                            if (skipLogging == false) {
                                ls.logRESP("UICommunicate - Call Engine - " + JSON.stringify(parsedLogContent));
                            }

                            deferred.resolve(parsedJSON);
                        },
                        function (type, message) {
                            setTimeout(function () {
                                deferred.reject();
                            });
                            // Will be called on error
                            ls.log(message, ls.logType().EXCP, false, true);
                        });
                }
                catch (ex) {
                    ls.log("UICommunicate - callEngine - Exception triggered - Communication failed - " + ex.message);
                    setTimeout(function () {
                        deferred.reject();
                    });
                }

            }
            else {
                ls.log("Action not defined: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
            }

        }
        else {
            ls.log("Caller not defined: " + engineCaller, ls.logType().ERR, false, true);
        }

        return deferred.promise;
    };


    /**
     * Return the reference of UICommunicateData.
     * Create the data to call engine / web over this function.
     * @property createData
     * @readOnly
     * @returns {UICommunicateData} - reference
     */
    this.createData = function createData() {
        return uiCData;
    };


    /**
     *
     * @returns {UIBroadcastData}
     */
    this.createBroadcastData = function createBroadcastData() {
        return uiBData
    };


    /**
     * Return the reference of UIChannelData
     * Create the data to create the different channels.
     * @property createChannelData
     * @readOnly
     * @returns {UIChannelData} - reference
     */
    this.createChannelData = function createChannelData() {
        return uiChannelData;
    };


    /**
     * Returns if this service runs on browser or in engine
     * @property isBrowser
     * @returns {boolean}
     */
    this.isBrowser = function isBrowser() {
        return !engine.IsAttached;
    };


    /************************************************************** Public - Functions - End **************************************************************/
    /************************************************************** Public - Functions - End **************************************************************/
    me = this;
    init();
}
