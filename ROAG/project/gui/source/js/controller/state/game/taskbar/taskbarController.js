/**
 *
 * @param $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {LogService} logService
 * @param TaskbarController
 * @constructor
 */
function TaskbarController($scope, uiService, uiCommunicate, uiCommunicateModel, logService, $timeout) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;
    $scope.storages = {};
    $scope.storageCount = 0;


    $scope.chat = {};
    $scope.chat.visible = false;

    $scope.settings = {};
    $scope.settings.visible = false;

    $scope.torch = {};
    $scope.torch.visible = false;

    $scope.axe = {};
    $scope.axe.visible = false;
    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    $scope.init = function (_data) {
        ls = logService;
        $timeout(function () {
            checkSettingState();
            checkChatState();
        }, 1000);


        $scope.$on("equipMainHand", function (_evt, _data) {
            ls.logINFO("Equip main hand");
            $scope.toggleTorch(_data.DATA.STATE);
        });

        $scope.$on("torch", function (_evt, _data) {
            ls.logINFO("Equip torch",false,true);
            setTorchState(_data.DATA.STATE);
        });

        /**
         * Attached on broadcast
         * @event toggleSettings
         */
        $scope.$on("toggleSettings", function () {

            $scope.toggleSettings();
        });
        /**
         * Attached on broadcast
         * @event toggleChat
         */
        $scope.$on("toggleChat", function () {

            $scope.toggleChat();
        });

        $scope.$on(uiCommunicate.getBroadcastTypes().TASKBAR_REGISTER_STORAGE, function (_evt, _data) {
            ls.logTRC("Register storage");
            var storageId = _data.DATA.STORAGEID;
            var obj =
            {
                VISIBLE: false
            };
            $scope.storages[storageId] = obj;
            $scope.storageCount = Object.keys($scope.storages).length;
        });

        $scope.$on(uiCommunicate.getBroadcastTypes().TASKBAR_TOGGLE_STORAGE, function (_evt, _data) {
            var storageId = _data.DATA.STORAGEID;
            var visible = _data.DATA.VISIBLE;
            setStorageState(storageId, visible);

        });

        //Show storage just if we have our storage.
        uiService.showUI(uiService.getUiViews().STORAGE);
    };

    $scope.toggleItem = function toggleItem(_item) {

        var equippedId = 0;
        var state = 0;
        if (_item === "torch" || _item === 1) {
            if ($scope.torch.visible === true) {
                state = 0;
            }
            else {
                state = 1;
            }
            setTorchState(state);
            setAxeState(0);
        }
        else if (_item === "axe" || _item === 2) {
            if ($scope.axe.visible === true) {
                state = 0;
            }
            else {
                state = 1;
            }
            setTorchState(0);
            setAxeState(state);
        }

        if (state === 0) {
            equippedId = 0;
        }
        else {
            if (_item === "torch" || _item === 1) {
                equippedId = 1;
            }
            else if (_item === "axe" || _item === 2) {
                equippedId = 2;
            }
        }

       uiCommunicateModel.EQUIP_MAIN_HAND(equippedId);


    };


    $scope.toggleTorch = function (){
        var _state = 0;
         if ($scope.torch.visible === true) {
                _state = 0;
            }
            else {
                _state = 1;
            }
        setTorchState(_state);
       uiCommunicateModel.EQUIP_TORCH(_state);
    };
    /**
     * Triggerd on NG-CLICK - tell our storage to show or hide.
     * @event toggleStorage
     * @param {string} _storageId
     */
    $scope.toggleStorage = function toggleStorage(_storageId) {
        setStorageState(_storageId, !$scope.storages[_storageId].VISIBLE);
        var data = uiCommunicate.createBroadcastData().STORAGE_TOGGLE(_storageId, $scope.storages[_storageId].VISIBLE);
        uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().STORAGE_TOGGLE, data);

    };

    var setStorageState = function (_storageId, _visible) {
        $scope.storages[_storageId].VISIBLE = _visible;
    };


    var setAxeState = function (_state)
    {
        if (_state === 1) {
            $scope.axe.visible = true;
        }
        else {
            $scope.axe.visible = false;
        }

        //Scope maybe doesn't get it should get changed...
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    var setTorchState = function (_state) {
        if (_state === 1) {
            $scope.torch.visible = true;
        }
        else {
            $scope.torch.visible = false;
        }

        //Scope maybe doesn't get it should get changed...
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    /**
     */
    $scope.toggleChat = function () {
        var chatEl = $("chat-tab-ctrl");
        if (chatEl.length > 0) {


            if (chatEl.is(":visible")) {
                chatEl.hide();
                $scope.chat.visible = false;
            }
            else {
                chatEl.show();
                $scope.chat.visible = true;
            }
        }

    };
    var checkChatState = function () {
        var chatEl = $("chat-tab-ctrl");
        if (chatEl.length > 0) {
            if (chatEl.is(":visible")) {
                $scope.chat.visible = true;
            }
            else {
                $scope.chat.visible = false;
            }
        }
    };
    var checkSettingState = function () {
        if (uiService.isUIHidden(uiService.getUiViews().SETTINGS_MENU) === true) {
            $scope.settings.visible = false;
        }
        else {
            $scope.settings.visible = true;
        }
    };

    /**
     */
    $scope.toggleSettings = function () {
        if (uiService.isUIHidden(uiService.getUiViews().SETTINGS_MENU) === true) {
            uiService.showUI(uiService.getUiViews().SETTINGS_MENU);
            $scope.settings.visible = true;
        }
        else {
            uiService.hideUI(uiService.getUiViews().SETTINGS_MENU);
            $scope.settings.visible = false;

        }

    };


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/


}

