/**
 *
 * @param $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {LogService} logService
 * @param {UISocket} uiSocket
 * @param {UICommunicateSocketModel} uiCommunicateSocketModel
 * @param StorageController
 * @constructor
 */
function StorageController($scope, $compile, $q, uiCommunicate, uiCommunicateModel, logService, uiSocket,uiCommunicateSocketModel) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @private
     * @type {LogService}
     */
    var ls = null;

    /**
     * Filled on initialization, inherits the communication socketId for the specific user.
     * @private
     * @type {string}
     */
    var storageSocketURL = "";
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
    //CODE

    /**
     * @method
     */
    var getStorageScope = function getStorageScope(_storageId) {
        var storageEl = $scope.$element.find("storage[storage-id='" + _storageId + "']");
        if (storageEl.length > 0) {
            var storageScope = angular.element(storageEl).isolateScope();
            return storageScope;
        }
        return null;
    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/

    var initDirectiveQueue = {};

    var id = 0;
    $scope.getId = function () {
        id += 1;
        return id;
    };

    /**
     * Creates a new storage
     * @method
     * @param _id
     * @param _callback
     */
    var addStorage = function (_id, _callback) {

        initDirectiveQueue[_id] = _callback;
        var controlEle = $("<storage storage-id='" + _id + "' storage-init='storageInit(_scope)'  />");
        $("[data-id='storageAdd']").append(controlEle);
        $compile(controlEle)($scope);

    };


    /**
     * Returns all equipped abgs
     * @method
     * @example
     * {
               "DATA":[
                  {
                     "SLOTS":[
                        {
                           "IS_STACKED":false,
                           "WIDTH":1,
                           "WEIGHT":1,
                           "NAME":"Brown flower",
                           "TEMPLATE":3,
                           "SLOT":0,
                           "ID":3,
                           "HEIGHT":1
                        },
                        {
                           "IS_STACKED":false,
                           "WIDTH":1,
                           "WEIGHT":1,
                           "NAME":"Brown flower",
                           "TEMPLATE":3,
                           "SLOT":2,
                           "ID":3,
                           "HEIGHT":1
                        }
                     ],
                     "ID":2,
                     "TEMPLATE":1,
                     "NAME":"Awesome bag"
                  },
                  {
                     "SLOTS":[

                     ],
                     "ID":3,
                     "TEMPLATE":1,
                     "NAME":"Awesome bag"
                  }
               ]
            }
     */
    var getEquippedStorages = function () {
        return uiCommunicateSocketModel.STORAGE_GET_EQUIPPED_BAGS(storageSocketURL);
    };


    var getstorage = function () {
        return uiCommunicateSocketModel.STORAGE_GET_DETAILS(storageSocketURL,4);
    };


    var initializeBags = function () {
        getEquippedStorages(storageSocketURL).then(function (_data) {
            if (_data.ERROR === -1) {
                var storages = _data.DATA;
                if (storages.length <= 0) {
                    ls.logTRC("StorageController - init - no storage available");
                }
                for (var i = 0; i < storages.length; i++) {
                    //Wrap into anonymus function else we don't know the index anymore.
                    (function (_index) {
                        addStorage(storages[i].ID, function (_scope) {
                            _scope.initStorage(storages[_index],storageSocketURL);
                            var broadcastData = uiCommunicate.createBroadcastData().TASKBAR_REGISTER_STORAGE(storages[_index].ID);
                            uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().TASKBAR_REGISTER_STORAGE, broadcastData);
                        });
                    })(i);


                }
            }
            else {
                ls.logERR("StorageController - init - cant equip storages")
            }
        });
    };
    /************************************************************** Public - FUNCTIONS - START ************************************************************/
    //CODE


    /************************************************************** Public - FUNCTIONS - END **************************************************************/
    $scope.init = function () {
        ls = logService;
        /** getstorage().then(function (_data)
         {
               addStorage(_data.DATA.ID, function (_scope) {
                     _scope.initStorage(_data.DATA);
                     _scope.toggle(true);
                 });
         });**/
        uiCommunicateModel.CHANNEL_GET_BY_NAME(uiSocket.getChannelNames().STORAGE).then(function (_data) {

            var data = _data;
            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    var channelId = data.DATA.id;
                    uiSocket.createChannelWithPrefix("storage", channelId).then(function (_url) {
                        storageSocketURL = _url;
                        //After we got the socket url we initialize our bags.
                        initializeBags();
                    });

                    break;
            }

        });


    };

    /**
     *
     * @event storageInit
     * @param _scope
     */
    $scope.storageInit = function (_scope) {
        initDirectiveQueue[_scope.storageId](_scope);
    };


    /************************************************************** Public - EVENTS - START ***************************************************************/
    /**
     * Show or hide the given bag.
     * @event toggleStorage
     * @param {number} _storageId
     * @param {Boolean} _showOrHide
     */
    /**$scope.toggleStorage = function toggleStorage(_storageId, _showOrHide) {
        var storageScope = getStorageScope(_storageId);
        if (storageScope) {
            storageScope.toggle(_showOrHide);
        }

    };
     **/
    $scope.$on(uiCommunicate.getBroadcastTypes().OPEN_BANK, function (_evt, _data) {
        var storageID = _data.DATA.STORAGEID;
        if (storageID) {
            addStorage(storageID, function (_scope) {
                _scope.initStorage(storages[_index]);
                var broadcastData = uiCommunicate.createBroadcastData().TASKBAR_REGISTER_STORAGE(storages[_index].ID);
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().TASKBAR_REGISTER_STORAGE, broadcastData);
            });
        }

    });

    /************************************************************** Public - EVENTS - END ******************************************************************/


}

