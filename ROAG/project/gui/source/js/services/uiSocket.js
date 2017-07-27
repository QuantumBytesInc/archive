/**
 * Handles all socket communication.
 * @param {$q} $q
 * @param {LogService} logService
 * @param {$timeout} $timeout
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateSocketData} uiCommunicateSocketData
 * @param {HelperService} helperService
 * @class UISocket
 * @constructor
 */
function UISocket($q, logService, $timeout, uiCommunicate, uiCommunicateSocketData, helperService) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    /**
     * Fixed heartbeat message
     * @private
     * @constant
     * @type {number}
     */
    var CONST_HEART_BEAT = "---heartbeat---";

    /**
     * Number how ofen the heartbeat should be send
     * Value in milliseconds
     * @private
     * @type {number}
     * @constant
     */
    var CONST_HEART_BEAT_TIME = 5000;

    /**
     * Own instance for calling
     * @private
     * @type {UISocket}
     */
    var me = this;

    /**
     * Inherits all websockets which are connected.
     * @private
     * @type {*}
     */
    var websockets = {};

    /**
     *
     * @type {UICommunicate}
     */
    var uc = null;

    /**
     * @private
     * @type {HelperService}
     */
    var helper = null;


    /**
     * Inherits all global possible channels which can be called.
     * @private
     * @type {}
     */
    var socketChannelNames = {
        //Needed for sync
        "SYNC": "sync",
        //Needed for storage communication
        "STORAGE": "storage",
    };

    var uiCSocketData = null;


    /**
     * Inherits the socket endpoint string
     * @private
     * @type {string}
     */
    var socketEndpoint = 'wss://droag-socket.annorath-game.com/ws/';


    /************************************************************** Private - VARIABLES - END *************************************************************/

    /************************************************************** Public - VARIABLES - START ************************************************************/


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    /**
     * Initialization of this service
     * @method
     */
    var init = function init() {
        ls = logService;
        uc = uiCommunicate;
        uiCSocketData = uiCommunicateSocketData;
        helper = helperService;
        if (helper.isDevUI() !== true) {
            socketEndpoint = 'wss://gui-socket.annorath-game.com/ws/';
        }
    };


    /**
     * Connect to the websocket or reconnect to the websocket
     * @method
     * @private
     * @param {string}_url
     * @param [_promise=undefined]
     */
    var connectWebsocket = function connectWebsocket(_url, _promise) {
        ls.log("UISocket - Connect: " + _url, ls.logType().TRC, false, true);

        var ws = new WebSocket(_url);
        ws.onopen = function (_event) {
            socket_on_open(_url);
        };
        ws.onmessage = function (_event) {
            socket_on_message(_event, _url);
        };
        ws.onerror = function (_event) {
            socket_on_error(_event, _url);
        };
        ws.onclose = function (_event) {
            socket_on_close(_event, _url);
        };
        if (websockets[_url] != undefined && websockets[_url] != null) {
            //Old websocket
            websockets[_url].WEBSOCKET = ws;
            websockets[_url].RECONNECT_INTERVAL = null;
            websockets[_url].HEART_BEAT_INTERVAL = null;
            websockets[_url].PROMISE = null;
        }
        else {
            //New websocket
            var promise = _promise;
            if (promise == undefined) {
                promise = null;
            }
            websockets[_url] = {
                "WEBSOCKET": ws,
                "MESSAGE_QUEUE": {},
                //Inherits all listeners which will be informed when server sends something to client
                "ATTACHED_LISTENERS": [],
                "REQUEST_ID": 1,
                "PROMISE": _promise,
                "URL": _url,
                "RECONNECT_INTERVAL": null,
                "HEART_BEAT_INTERVAL": null,
                "RECONNECT_ATTEMPTS":0,
            };
        }

    };

    /**
     * Called on socket open
     * @method
     * @private
     * @param {string} _url - Inherits the socket url
     */
    var socket_on_open = function (_url) {
        ls.log("UISocket - Socket on open - Triggered: " + _url, ls.logType().TRC, false, true);
        // new connection, reset attemps counter
        //When websocket is reconnecting we don't need to notify the attacher again
        if (websockets[_url].PROMISE != null) {
            websockets[_url].PROMISE.resolve(_url);

            //We connected successfuly, we don't need this promise anymore
            //If we would not remove it here, and an error would be triggered the whole logic would crash later on
            websockets[_url].PROMISE = null;
        }


        var heartbeatIntv = setInterval(function () {
            //Send every 5 seconds a heartbeat to the websocket
            send_heartbeat(websockets[_url].WEBSOCKET);
        }, CONST_HEART_BEAT_TIME);

        websockets[_url].HEART_BEAT_INTERVAL = heartbeatIntv;

    };

    /**
     * Sends the heartbeat to server, without this heartbeat the connection would be interrupted after 30-60 seconds
     * @method
     * @private
     * @param {Websocket} _websocket
     */
    var send_heartbeat = function (_websocket) {
        try {
            _websocket.send(CONST_HEART_BEAT);
        } catch (e) {
            //Socket may closed.
            ls.log("UISocket - Send heartbeat - Error", ls.logType().EXCP, false, true);
        }
    };


    /**
     * Called on websocket close event - Reconnect tried
     * @method
     * @private
     * @param evt
     * @param {string} _url - Inherits the socket url
     */
    var socket_on_close = function (evt, _url) {
        ls.log("UISocket - Socket on close - Closed unexpected: " + _url, ls.logType().ERR, false, true);

        window.clearInterval(websockets[_url].HEART_BEAT_INTERVAL);

        if (websockets[_url].RECONNECT_INTERVAL == null) {
            // try to reconnect

            var interval = generateInterval( websockets[_url].RECONNECT_ATTEMPTS);
             websockets[_url].RECONNECT_ATTEMPTS++;
            //DON'T do any interval, because the socket will be called with an close again.
            websockets[_url].RECONNECT_INTERVAL = setTimeout(function () {
                connectWebsocket(websockets[_url]["URL"]);
            }, interval);
        }
    };

    /**
     * Called if an error occures while connected to websocket.
     * If this is occures while connection, the promise will be resolved, else it won't to prevent wrong logic
     * @method
     * @private
     * @param evt
     * @param {string} _url - Inherits the socket url
     */
    var socket_on_error = function (evt, _url) {
        ls.log("UISocket - Socket on close - Closed unexpected: " + _url, ls.logType().ERR, false, true);
        if (websockets[_url].PROMISE == null) {
            //If not null its the initial request, if this would be called again because of reconnecting not needed strange logic would be executed.
            websockets[_url].PROMISE.reject(evt);
        }

    };

    /**
     * Called on message receive from server.
     * Message will be parsed an distributed private (if REQUEST_ID is existing) else it will be distributed to all attached listeners.
     * @method
     * @private
     * @param evt
     * @param {string} _url - Inherits the socket url
     * @returns {*}
     */
    var socket_on_message = function (evt, _url) {
        var message = evt.data;
        ls.log("UISocket - Socket on message - " + _url + -" - " + message, ls.logType().TRC, false, true);
        receiveMessage(message, _url);
    };

    // this code is borrowed from http://blog.johnryding.com/post/78544969349/
    //
    // Generate an interval that is randomly between 0 and 2^k - 1, where k is
    // the number of connection attmpts, with a maximum interval of 30 seconds,
    // so it starts at 0 - 1 seconds and maxes out at 0 - 30 seconds
    var generateInterval = function (k) {
        var maxInterval = (Math.pow(2, k) - 1) * 1000;

        // If the generated interval is more than 30 seconds, truncate it down to 30 seconds.
        if (maxInterval > 30 * 1000) {
            maxInterval = 30 * 1000;
        }

        // generate the interval to a random number between 0 and the maxInterval determined from above
        return Math.random() * maxInterval;
    };


    /**
     * Called on on_message receive.
     * @event receiveMessage
     * @param _message
     * @returns {*}
     */
    var receiveMessage = function (_message, _url) {
        try {
            var message = JSON.parse(_message);

            if (message.REQUEST_ID != undefined && message.REQUEST_ID != null) {
                //Direct message - Client send something before
                sendMessageDirect(message, _url);
            }
            else {

                //No direct message - Server send directly to client.

                //We need to wait till the first ATTACHED_LISTENERS is attached
                //Else call would land in nirvanaland =(
                if (websockets[_url].ATTACHED_LISTENERS.length > 0) {
                    broadcastMessage(message, _url);
                }
                else {
                    var messageIntv = setInterval(function () {
                        if (websockets[_url].ATTACHED_LISTENERS.length > 0) {
                            broadcastMessage(message, _url);
                            window.clearInterval(messageIntv);
                        }
                    }, 5);
                }

            }
        }
        catch (ex) {

        }
    };
    /**
     * Sends the received message from server to the private listener (promise)
     * @method
     * @private
     * @param {*} _message
     * @param {string} _url - Inherits the socket url
     */
    var sendMessageDirect = function (_message, _url) {
        websockets[_url].MESSAGE_QUEUE[_message.REQUEST_ID].resolve(_message);
        //Queue done, remove this request.
        delete websockets[_url].MESSAGE_QUEUE[_message.REQUEST_ID];
    };

    /**
     * Sends the received message from server to all attached listeners
     * @method
     * @private
     * @param {*} _message
     * @param {string} _url - Inherits the socket url
     */
    var broadcastMessage = function (_message, _url) {
        for (var i = 0; i < websockets[_url].ATTACHED_LISTENERS.length; i++) {
            websockets[_url].ATTACHED_LISTENERS[i](_message);
        }
    };

    /**
     * Get a request id for the specific url
     * @param {string} _url
     * @returns {number|string}
     */
    var getRequestId = function (_url) {
        var newRequestId = websockets[_url].REQUEST_ID;
        websockets[_url].REQUEST_ID++;
        return newRequestId;
    };
    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE

    /// \todo update this always.
    /**
     * Return the possible callable channels
     * @property getChannelNames
     * @returns {{SYNC: string}}
     */
    this.getChannelNames = function getChannelNames() {
        return socketChannelNames;
    };

    /**
     * @method
     * @returns {{SYNC: string}}
     */
    this.getWebsockets = function () {
        return websockets;
    };

    this.getWebsocket = function (_url) {
        return websockets[_url];
    };

    /**
     * Return the reference of UICommunicateSocketData.
     * Create the data to call  the websocket in django
     * @property
     * @readonly
     * @returns {UICommunicateSocketData}
     */
    this.createSocketData = function createSocketData() {
        return uiCSocketData;
    };

    /**
     *
     * @param _websocketUrl
     */
    this.createChannel = function createChannel(_channelId) {
        try {
            var deferred = $q.defer();
            var connectingURL = socketEndpoint + _channelId;
            connectWebsocket(connectingURL,deferred);
        } catch (ex) {
            $timeout(function () {
                deferred.reject(ex);
            }, 0, false)
        }
        return deferred.promise;
    };

    /**
     * @param {string} _channelType - Must not with an "/"
     * @param {sring} _channelId - The channel id
     * @param _websocketUrl
     */
    this.createChannelWithPrefix = function createChannel(_channelType, _channelId) {
        try {
            var deferred = $q.defer();
            var connectingURL = socketEndpoint + _channelType + "/" + _channelId;
            connectWebsocket(connectingURL,deferred);
        } catch (ex) {
            $timeout(function () {
                deferred.reject(ex);
            }, 0, false)
        }
        return deferred.promise;
    };


    /**
     * Attach your function on message receive
     * @method
     * @param {string} _url
     * @param {function} _function
     */
    this.listen = function (_url, _function) {
        websockets[_url].ATTACHED_LISTENERS.push(_function);
    };


    /**
     *
     * @param _url
     * @param _caller
     * @param _action
     * @param _data
     */
    this.sendMessage = function (_url, _caller, _action, _data) {
        var deferred = $q.defer();

        var caller = _caller;
        var action = _action;
        var data = _data;

        if (uc.callerValid(caller) !== undefined) {
            if (uc.actionValid(caller, action)) {
                //CALL WEB
                var requestId = getRequestId(_url);

                ls.logSEND("UISocket - Send - " + JSON.stringify({
                        'CALLER': uc.getKeyByValue(caller, caller),
                        'ACTION': uc.getKeyByValue(actionMap[caller], action),
                        'REQUEST_ID': requestId,
                        'DATA': data
                    }));
                websockets[_url].MESSAGE_QUEUE[requestId] = deferred;
                websockets[_url].WEBSOCKET.send(JSON.stringify({
                    'CALLER': caller,
                    'ACTION': action,
                    'REQUEST_ID': requestId,
                    'DATA': data
                }));


            }
            else {
                ls.log("UISocket - Send - Action not defined: " + action + " for caller: " + caller, ls.logType().ERR, false, true);
            }

        }
        else {
            ls.log("UISocket - Send - Caller not defined: " + caller, ls.logType().ERR, false, true);
        }

        return deferred.promise;


    };

    /************************************************************** Public - FUNCTIONS - END **************************************************************/

    /************************************************************** Public - PROPERTIES - START ***********************************************************/


    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/

    init();

}

