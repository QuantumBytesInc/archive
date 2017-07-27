/**
 * Provides the complete logservice to manage logging-flow.
 * @class LogService
 * @static
 * @constructor
 */
function LogService() {

    /************************************************************** Private - Variables - START *****************************************************/

    /**
     * @type LogService
     * @private
     */
    var me;


    /**
     * Inherits the whole log history.
     * @private
     * @type {Array}
     */
    var logHistory = [];

    /**
     *
     * @type {UICommunicate}
     */
    var uiCommunicate = null;
    /************************************************************** Private - Variables - END *******************************************************/

    /************************************************************** Private - FUNCTIONS - START ****************************************************/
    /**
     * @method
     */
    var init = function init() {
        me = this;

    };

    /**
     * Push the history log.
     * @method
     * @param {string} _msg - Message
     * @param {string} _type= - Message
     * @param {boolean} _trace - Log the actual trace?
     * @param {boolean} _logArguments - Log the passed arguments?
     * @private
     */
    var pushLogHistory = function pushLogHistory(_msg, _type) {
        var historyData = {
            "msg": _msg,
            "type": _type
        };

        logHistory.push(historyData);

       logToServer(_msg, _type);

    };

    var logToServer = function logToServer(_msg, _type) {
        //We cant init in "init" mehtod cause the injector isn't know there atm.
        if (uiCommunicate === null) {
            uiCommunicate = angular.element(document).injector().get("uiCommunicate");
        }

        if (uiCommunicate && uiCommunicate.isBrowser() === false) {
            uiCommunicate.logToEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).LOG_TO_ENGINE,{TYPE: _type, MESSAGE: _msg});
        }

    };

    /**
     * Return the actual timestamp
     * @property getTimestamp
     * @readOnly
     * @returns {number}
     */
    var getTimestamp = function getTimestamp() {
        var _date = new Date();

        var dateString = "";
        if (_date.getHours() < 10) {
            dateString += "0" + _date.getHours();
        }
        else {
            dateString += _date.getHours();
        }
        if (_date.getMinutes() < 10) {
            dateString += ":0" + _date.getMinutes();
        }
        else {
            dateString += ":" + _date.getMinutes();
        }
        if (_date.getSeconds() < 10) {
            dateString += ":0" + _date.getSeconds();
        }
        else {
            dateString += ":" + _date.getSeconds();
        }

        if (_date.getMilliseconds() < 10) {
            dateString += ":00" + _date.getSeconds();
        }
        if (_date.getMilliseconds() < 100) {
            dateString += ":0" + _date.getSeconds();
        }
        else {
            dateString += ":" + _date.getMilliseconds();
        }


        return dateString;

    };
    /************************************************************** Private - FUNCTIONS - END *******************************************************/

    /************************************************************** Public - Functions - START ******************************************************/

    /**
     * Log message
     * @method
     * @param {string} _msg - Message
     * @param {string} _type="INFO" - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.log = function (_msg, _type, _trace, _logArguments) {
        var msg = _msg;
        var type = _type || "INFO";
        var trace = _trace || false;
        var logArguments = _logArguments || false;

        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + me.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);

    };

    /**
     * Returns the complete logHistory
     * @property getLogHistory
     */
    this.getLogHistory = function getLogHistory() {
        return logHistory;
    };
    /**
     /** Public Properties **/

    /**
     * Returns the actual stacktrace.
     * @property getStackTrace
     * @readOnly
     * @type {Error.stack}
     * @returns {Error.stack}
     */
    this.getStackTrace = function () {
        return new Error().stack;
    };

    /**
     * Log messageType
     * @property log
     * @readOnly
     * @type {element}
     * @returns {{INFO: string, WARN: string, ERR: string, EXCP: string}}
     */pushLogHistory
    this.logType = function () {
        var logTypes =
        {
            "INFO": "INFO",
            "WARN": "WARN",
            "ERR": "ERR",
            "EXCP": "EXCP",
            "TRC": "TRC",
            "RESP": "RESP",
            "SEND": "SEND"
        };
        return logTypes;
    };
    /**
     * Log message
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logTRC = function logTRC(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().TRC;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };
    /**
     * Log message
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logINFO = function logINFO(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().INFO;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };

    /**
     * Log response
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logRESP = function logINFO(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().RESP;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };
    /**
     * Log sended data
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logSEND = function logINFO(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().SEND;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };
    /**
     * Log message
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logWARN = function logWARN(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().WARN;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };

    /**
     * Log message
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logERR = function logERR(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().ERR;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };

    /**
     * Log message
     * @method
     * @param {string} _msg - Message
     * @param {boolean} _trace=false - Log the actual trace?
     * @param {boolean} _logArguments=true - Log the passed arguments?
     */
    this.logEXCP = function logEXCP(_msg, _trace, _logArguments) {
        var base = this;
        var msg = _msg;
        var type = base.logType().EXCP;

        var trace = _trace || false;
        var logArguments = _logArguments || false;
        //var caller = arguments.callee.caller.toString();


        var logMessage = getTimestamp() + " - " + type + ":" + msg + "\n\r";
        if (trace) {
            logMessage += " Trace:" + this.getStackTrace() + "\n\r";
        }
        if (logArguments) {
            logMessage += " Arguments:" + JSON.stringify(arguments.callee.caller.arguments) + "\n\r";
        }

        console.log(logMessage);
        pushLogHistory(logMessage, type);
    };


    /************************************************************** Public - Functions - END ********************************************************/
    /************************************************************** PUBLIC - Functions - START ******************************************************/

    /************************************************************** PUBLIC - Functions - END ********************************************************/

    init();
}