/**
 * Handels the client communication with django-server, unigine-client, django-channels.
 * @param {$q} $q
 * @param {UICommunicateData} uiCommunicateData
 * @class UICommunicate
 * @static
 * @constructor
 */
function UICommunicate($q, uiCommunicateData) {

    /************************************************************** Private - Variables - START *****************************************************/

    var me;

    /**
     *
     * @type {UICommunicateData}
     * @private
     */
    var uiCData = null;

    /**
     * WebCallbackFunction
     * @private
     * @type {string}
     */
    var webCallbackFunction = 'angular.element(document).injector().get("uiCommunicate").webCallback';

    /**
     * Inherits all callback functions with the getCallbackId() as indexer counting up.
     * @private
     * @type {{}}
     */
    var webCallbacks = {};

    /**
     * Inherits the webCallbackId number which is counted up
     * @private
     * @property getCallbackId
     * @type {number}
     */

    var webCallbackId = 0;

    /************************************************************** Private - Variables - END *******************************************************/

    /************************************************************** Private - Functions - START *****************************************************/

    /**
     * @constructor
     */
    var init = function () {

        uiCData = uiCommunicateData;

    };


    /**
     * Returns a unique callbackId
     * @property getCallbackId
     * @readOnly
     * @type {number}
     * @returns {number}
     */
    var getCallbackId = function () {
        webCallbackId += 1;
        return webCallbackId;
    };

    /**
     * Checks if the passed callerId is valid
     * @method callerValid
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
     * @method actionValid
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
              //  ls.log("Actions not existing for caller: " + _caller, ls.logType().ERR, false, true);
            }
        }
        else {
          //  ls.log("Caller not defined: " + _caller, ls.logType().ERR, false, true);
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
     * Callback from django
     * @event webCallback
     * @param {number} _id
     * @param {element} _json
     */
    this.webCallback = function webCallback(_id, _json) {
        webCallbacks[_id].resolve(_json);
    };

    /**
     * Django call, passed callback is called after the request run through
     * @method callWeb
     * @param {number/getCaller} _caller
     * @param {number/getActions} _action
     * @param {json} _data
     * @return {Promise}
     */
    this.callWeb = function (_caller, _action, _data) {
        var deferred = $q.defer();
        var callbackId = getCallbackId();
        var base = this;

        var webCaller = _caller;
        var action = _action;
        var data = JSON.stringify(_data);

        if (callerValid(webCaller) !== undefined) {
            if (actionValid(webCaller, action)) {
                //CALL WEB
                var callbackFunction = webCallbackFunction + "(" + callbackId;
                webCallbacks[callbackId] = deferred;

                (function (_id, base, _deffered) {
                    //angular.element(document).injector().get("uiCommunicate").webCallback(1, '{}');
                   /* ls.logSEND("Call Web - " + JSON.stringify({
                        'CALLER': getKeyByValue(caller, webCaller),
                        'ACTION': getKeyByValue(actionMap[webCaller], action),
                        'DATA': data
                    }));*/

                    ajaxPost('interface/request', {
                        'CALLER': webCaller,
                        'ACTION': action,
                        'DATA': data
                    }, function (content) {

                        var parsedJSON = JSON.parse(content);
                        var parsedLogContent = JSON.parse(content);


                        parsedLogContent.CODE = getKeyByValue(codeMap[parsedLogContent.CALLER][parsedLogContent.ACTION], parsedLogContent.CODE);
                        parsedLogContent.ACTION = getKeyByValue(actionMap[parsedLogContent.CALLER], parsedLogContent.ACTION);
                        parsedLogContent.CALLER = getKeyByValue(caller, parsedLogContent.CALLER);

                       // ls.logRESP("Call Web - " + JSON.stringify(parsedLogContent));


                        base.webCallback(_id, parsedJSON);
                    })
                })(callbackId, base, deferred);

            }
            else {
               // ls.log("Action not defined: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
            }

        }
        else {
           // ls.log("Caller not defined: " + webCaller, ls.logType().ERR, false, true);
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


    /************************************************************** Public - Functions - End **************************************************************/
    me = this;
    init();
}
