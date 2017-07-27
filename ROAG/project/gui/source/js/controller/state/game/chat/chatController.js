/**
 * Choose your character or create a new one.
 * @param $scope
 * @param {$compile} $compile
 * @param {LogService} logService
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel

 * @param ChatController
 * @constructor
 */
function ChatController($scope, $compile, logService, uiService, uiCommunicate, uiCommunicateModel) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    /**
     * Chat init queue which will be handeld after creating different chats.
     * @type {{}}
     */
    var chatInitQueue = {};

    var id = 0;
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE

    /**
     * Called on startup, all possible chats will be retrieved from server and build up
     * @method
     */
    var initChats = function () {

        uiCommunicateModel.CHANNEL_GET_LIST().then(function (_data) {
            var data = _data;
            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    for (var i = 0; i < _data.DATA.length; i++) {
                        var channelId = _data.DATA[i].UUID;

                        //Closure needed, else the _channelId is wrong
                        (function (_channelId) {
                            var chatId = $scope.addChatController(function (_scope, _tabId) {
                                _scope.initTab(_scope.tabId, _channelId);
                            });
                        })(channelId);


                    }
                    break;
            }


        });


    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/

    /************************************************************** Public - PROPERTIES - START ***********************************************************/
    $scope.getId = function () {
        id += 1;
        return id;
    };
    /************************************************************** Public - PROPERTIES - END  ***********************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    $scope.init = function (_data) {
        ls = logService;
        initChats();
    };

    /**
     * Called from chat-tab-controller to bring the different chats into the frontend.
     * @method
     * @returns {number}
     */
    $scope.chatZIndex = 99;
    var connectedChats = [];

    $scope.addChatController = function (_callback) {
        var chatId = $scope.getId();
        var controlEle = $("<chat-tab-ctrl data-is-single='true' tab-id ='" + chatId + "' chat-init='chatControllerInit(_scope)'/>");
        $scope.$element.find("[data-id=chatDropZone]").append(controlEle);

        $compile(controlEle)($scope);
        chatInitQueue[chatId] = {};

        chatInitQueue[chatId] = _callback || function (_scope, _tabId) {
                _scope.initTab(_scope.tabId, "");
            };
        return chatId;


    };
    /**
     * Called when the chatcontroller as added to html with finished scope
     * Callback the layed down chatInitQueue function
     * @event chatControllerInit
     * @param {$scope} _scope
     */
    $scope.chatControllerInit = function (_scope) {
        var chatQueue = chatInitQueue[_scope.tabId];
        chatQueue(_scope, _scope.tabId);
        chatInitQueue[_scope.tabId] = function () {
        };
    };


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/
    $scope.globalDrop = function (dragEl, dropEl, evt) {
        if (!dragEl) {
            //tab already handeld
            return;
        }
        var draggedScope = angular.element(dragEl).scope();

        if (draggedScope.isTab && draggedScope.isTab == true) {
            var tabCtrlScope = $("chat-tab-ctrl[tab-id='" + draggedScope.tabId + "']").isolateScope();
            if (tabCtrlScope.getTabs().length > 1) {
                //We cant drag the last tab.

                var chatId = $scope.addChatController(function (_scope, _tabId) {
                    var draggedScope = chatQueue["draggedScope"];
                    var tabCtrlScope = chatQueue["tabCtrlScope"];
                    //angular.element(dragEl).scope().$element

                    _scope.$element.find("[data-id=tabstrip]").append(draggedScope.$element);
                    //draggedScope.$parent = $scope;
                    draggedScope.setTabId(_scope.tabId);
                    tabCtrlScope.checkTabs();
                });


            }
        }
    };


    /************************************************************** Public - EVENTS - END ******************************************************************/


}



