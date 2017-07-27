/**
 *
 * @param {LogService} logService
 * @param {UICommunicate} uiCommunicate
 * @param {UISocket} uiSocket
 * @class UICommunicateSocketModel
 * @constructor
 */
function UICommunicateSocketModel($q,logService, uiCommunicate, uiSocket) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    /**
     * Own instance
     * @type {UICommunicateSocketModel}
     */
    var me = null;

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
                    //uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Fatal error occurred, client is closing"});
                    //quitClient();
                    return -2;
                    break;
                case code.ERROR_SERVER_OFFLINE:
                    //uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Server is offline, client is closing"});
                    //quitClient();
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


    var check_STORAGE_MOVE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't move item"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_STORAGE_SWAP_ITEM = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't swap item"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_STORAGE_STACK_ITEM = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't stack item"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_STORAGE_UNSTACK_ITEM = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't unstack item"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_CHANNEL_SEND = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't send message"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_STORAGE_GET_EQUIPPED_BAGS = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get equppied bags"});
                    break;
                default:
                    break;
            }
        }
    };
    var check_STORAGE_GET_DETAILS = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {

            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    break;
                case code.FAILED_MISC:
                    uiService.showUI(uiService.getUiViews().INFORMATION, {DATA: "Couldn't get details for bag"});
                    break;
                default:
                    break;
            }
        }
    };

    /************************************************************* Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
    /**
     * Send data to socket channel
     * Fire and forget
     * @method
     * @param {string} _channelId
     * @param {string} _message
     * @return {$q|promise}
     */
    this.CHANNEL_SEND = function (_url, _message) {

        var sendingData = uiSocket.createSocketData().CHANNEL_SEND(_message);
        return uiSocket.sendMessage(_url, uiCommunicate.getCaller().CHANNEL, uiCommunicate.getActions(uiCommunicate.getCaller().CHANNEL).SEND, sendingData);
    };


    this.STORAGE_MOVE = function (_socketUrl, _itemId, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
        var deferred = $q.defer();
        var moveData = uiSocket.createSocketData().STORAGE_MOVE(_itemId, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot);

        uiSocket.sendMessage(_socketUrl, uiCommunicate.getCaller().STORAGE,
            uiCommunicate.getActions(uiCommunicate.getCaller().STORAGE).MOVE,
            moveData).then(
            function (_data) {
                checkErrors(_data);
                check_STORAGE_MOVE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_STORAGE_MOVE(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };
    this.STORAGE_SWAP_ITEM = function (_socketUrl, _itemId, _storageId, _sourceSlot, _targetSlot) {
        var deferred = $q.defer();
        var swapData = uiSocket.createSocketData().STORAGE_SWAP_ITEM(_itemId, _storageId, _sourceSlot, _targetSlot);

        uiSocket.sendMessage(_socketUrl, uiCommunicate.getCaller().STORAGE,
            uiCommunicate.getActions(uiCommunicate.getCaller().STORAGE).SWAP_ITEM,
            swapData).then(
            function (_data) {
                checkErrors(_data);
                check_STORAGE_SWAP_ITEM(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_STORAGE_SWAP_ITEM(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };

    this.STORAGE_STACK_ITEM = function (_socketUrl, _itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
        var deferred = $q.defer();
        var stackData = uiSocket.createSocketData().STORAGE_STACK_ITEM(_itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot);

        uiSocket.sendMessage(_socketUrl, uiCommunicate.getCaller().STORAGE,
            uiCommunicate.getActions(uiCommunicate.getCaller().STORAGE).STACK,
            stackData).then(
            function (_data) {
                checkErrors(_data);
                check_STORAGE_STACK_ITEM(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_STORAGE_STACK_ITEM(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };


    this.STORAGE_UNSTACK_ITEM = function (_socketUrl, _itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
        var deferred = $q.defer();
        var unstackData = uiSocket.createSocketData().STORAGE_UNSTACK_ITEM(_itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot);

        uiSocket.sendMessage(_socketUrl, uiCommunicate.getCaller().STORAGE,
            uiCommunicate.getActions(uiCommunicate.getCaller().STORAGE).UNSTACK,
            unstackData).then(
            function (_data) {
                checkErrors(_data);
                check_STORAGE_UNSTACK_ITEM(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_STORAGE_UNSTACK_ITEM(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };


    this.STORAGE_GET_EQUIPPED_BAGS = function (_socketUrl) {
        var deferred = $q.defer();
        uiSocket.sendMessage(_socketUrl, uiCommunicate.getCaller().STORAGE, uiCommunicate.getActions(uiCommunicate.getCaller().STORAGE).GET_EQUIPPED_BAGS, uiSocket.createSocketData().STORAGE_GET_EQUIPPED_BAGS()).then(
            function (_data) {
                checkErrors(_data);
                check_STORAGE_GET_EQUIPPED_BAGS(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_STORAGE_GET_EQUIPPED_BAGS(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };

    this.STORAGE_GET_DETAILS = function (_socketUrl, _id) {
        var deferred = $q.defer();
        uiSocket.sendMessage(_socketUrl, uiCommunicate.getCaller().STORAGE, uiCommunicate.getActions(uiCommunicate.getCaller().STORAGE).GET_DETAILS, uiSocket.createSocketData().STORAGE_GET_DETAILS(_id)).then(
            function (_data) {
                checkErrors(_data);
                check_STORAGE_GET_DETAILS(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                checkErrors(_data);
                check_STORAGE_GET_DETAILS(_data);
                deferred.reject(_data);
            });
        return deferred.promise;
    };


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - PROPERTIES - START ***********************************************************/


    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/
    me = this;
    init();

}


