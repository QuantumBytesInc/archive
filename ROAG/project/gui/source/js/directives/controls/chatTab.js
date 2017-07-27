/**
 * Service for the chat-tab control
 * @class directive_chatTab
 * @static
 * @constructor
 */
function directive_chatTab($scope, $element, uiCommunicate, uiCommunicateModel, uiCommunicateSocketModel, $timeout, $q, logService, uiSocket) {
    return {
        restrict: 'E',
        templateUrl: window.amazonURL + 'gui/templates/controls/chatTab.html',
        scope: {},

        controller: ['$scope', '$element', function ($scope, $element) {
            var ls = logService;
            var channel = null;

            //Anti spam
            var score = 0;
            var penalty = 200; // Penalty can be fine-tuned.
            var lastact = new Date();

            $scope.$element = $element;
            $scope.isTab = true;
            $scope.tabId = $element.data("tabid");
            //UUID === ChannelId
            var channelId = $element.data("channelid");

            //Will be filled after connecting
            var channelSocketURL = "";

            $scope.visible = true;
            $scope.$element.toggleClass("active");
            /**
             * @property setTabId
             * @param {string} _tabId - The actual tabId
             */
            $scope.setTabId = function (_tabId) {
                $scope.tabId = _tabId;
            };

            $scope.users = [];

            $scope.messages = [];
            $scope.msgObj = {};
            $scope.msgObj.messageToSend = "";

            $scope.userObj = {};
            $scope.userObj.userNameToAdd = "";


            $scope.addMessage = function addMessage(_msg) {
                $scope.messages.push(_msg);
                //Short timeout to scroll to bottom, else the message wasn't published.
                scrollToBottom();
            };
            /**
             * Called after a message was added
             * @event scrollToBottom
             */
            var scrollToBottom = function () {
                $timeout(function () {
                    var d = $('.history');
                    d.scrollTop(d.prop("scrollHeight"));
                }, 100, false);
            };

            /**
             * @property getChannelId
             * @returns {string}
             */
            $scope.getChannelId = function () {
                return channelId;
            };


            /**
             * Ein User wird den users hinzugefügt.
             * @return object
             */
            $scope.userJoin = function (_data) {
                var username = _data.USER;
                var timestamp = _data.TIMESTAMP;
                $scope.addMessage({USER: "SYSTEM", MESSAGE: username + " joined", TIMESTAMP: timestamp});
                addUser(username);
            };

            var addUser = function (_userName) {
                ls.logTRC("User joined channel:" + _userName);
                $scope.users.push(_userName);

            };
            var removeUser = function (_userName) {
                $scope.users = $($scope.users).not([_userName]).get();
            };

            /**
             * Called on userLeft event.
             * @method
             */
            $scope.userLeft = function (_data) {
                var username = _data.USER;
                var timestamp = _data.TIMESTAMP;

                $scope.addMessage({USER: "SYSTEM", MESSAGE: username + " left", TIMESTAMP: timestamp});
                removeUser(username);

            };

            /**
             * @event resize
             */
            $scope.resize = function resize() {
                scrollToBottom();
            };
            /**
             * Triggerd on click - broadcast to tabcontroller we shall be displayed.
             * @event showTab
             */
            $scope.showTab = function showTab() {
                if ($scope.visible !== true) {

                    $scope.$element.toggleClass("active");
                    $scope.visible = !$scope.visible;
                    // $element.find("[data-id='tabContent']").show();

                    var tabCtrlScope = $("chat-tab-ctrl[tab-id='" + $scope.tabId + "']").isolateScope();
                    tabCtrlScope.showTab(channelId);

                }
            };


            /**
             * Set the actual tab visible.
             * @property setVisible
             * @param _visible
             */
            $scope.setVisible = function setVisible(_visible) {
                if (_visible === true) {
                    $scope.visible = true;
                }
                else {
                    $scope.visible = false;
                }
            };

            /**
             * Called on ng-click
             * @event closeTab
             */
            $scope.closeTab = function closeTab() {
                //todo - disconnect everywhere.
                var tabCtrlScope = $("chat-tab-ctrl[tab-id='" + $scope.tabId + "']").isolateScope();
                tabCtrlScope.closeTab(uniqueId);
            };

            // @todo dynamic user
            /**
             * Called on enter or on click
             * @event sendMessage
             */
            $scope.sendMessage = function sendMessage() {


                var msg = $scope.msgObj.messageToSend;
                if (msg.toString().trim() !== "" && msg.toString().trim().toLowerCase() === "/unstuck") {
                    ls.logTRC("Unstuck character - chatmessage");
                    uiCommunicateModel.CHARACTER_UNSTUCK();
                }
                else if (msg.toString().trim() !== "") {
                    sendMessageToServer(msg);
                }
                $scope.msgObj.messageToSend = "";


            };

            /**
             * Triggered from chatController or from itself.
             * @method
             */
            $scope.closeChat = function () {
                disconnect();
            };

            /**
             * Sends written message to server / ajax
             * @method
             * @private
             * @param {string} _message
             */
            var sendMessageToServer = function (_message) {
                uiCommunicateSocketModel.CHANNEL_SEND(channelSocketURL, _message);
                ls.logTRC("ChatTab - sendMessageToServer - Message successfully send to server");
            };


            var reload = function () {
                var deferred = $q.defer();
                //We need to encode it before, else json would crash away.
                uiCommunicateModel.UNIGINE_SET_STATE(channelId, Base64.encode(JSON.stringify($scope.messages)))
                    .then(function (_data) {
                            deferred.resolve();
                        },
                        function (_data) {
                            deferred.resolve();
                        });
                return deferred.promise;
            };
            /**
             * Called on QUIT or Close toggling
             * @method
             * @returns {promise}
             */
            var disconnect = function () {

                var deferred = $q.defer();
                uiCommunicateModel.CHANNEL_LEAVE(channelId)
                    .then(function (_data) {
                            deferred.resolve();
                        },
                        function (_data) {
                            deferred.resolve();
                        });
                return deferred.promise
            };

            /**
             * Triggered from socket-recieve event
             * @event
             * @private
             * @param _data
             */
            var fillUserList = function (_data) {

                var userList = _data.USERS;
                var timestamp = _data.TIMESTAMP;
                //Check if we stored some messages (did we do a reload)
                if (!uiCommunicate.isBrowser()) {

                    uiCommunicateModel.UNIGINE_GET_STATE(channelId).then(function (_data) {
                            if (_data && _data.DATA && typeof(_data.DATA) === "string" && _data.DATA !== "{}" && _data.DATA.length > 0) {
                                var messages = JSON.parse(Base64.decode(_data.DATA));
                                if (messages.length > 0) {
                                    $scope.messages = messages;
                                }
                                else {
                                    $scope.addMessage({
                                        USER: "SYSTEM",
                                        MESSAGE: "Welcome",
                                        TIMESTAMP: timestamp
                                    });
                                }
                            }
                            else {
                                $scope.addMessage({
                                    USER: "SYSTEM",
                                    MESSAGE: "Welcome",
                                    TIMESTAMP: timestamp
                                });
                            }
                        },
                        function (_data) {
                            $scope.addMessage({USER: "SYSTEM", MESSAGE: "Welcome", TIMESTAMP: timestamp});
                        });
                }
                else {
                    $scope.addMessage({USER: "SYSTEM", MESSAGE: "Welcome", TIMESTAMP: timestamp});
                }

                //Refill user list
                $scope.users = [];
                //we need a short delay, because angularjs wouldn't render the list again else.
                $timeout(function () {
                    if (userList) {
                        for (var i = 0; i < userList.length; i++) {
                            addUser(userList[i]);
                        }
                    }
                },50);

            };

            var init = function () {
                uiSocket.createChannel(channelId).then(function (_url) {
                    channelSocketURL = _url;
                    uiSocket.listen(channelSocketURL,function (_data) {
                        var data = _data;
                        $scope.$apply(function () {
                            var jsonCaller = caller;
                            switch (data.CALLER) {
                                case jsonCaller.CHANNEL:

                                    var jsonAction = actionMap[data.CALLER];
                                    switch (data.ACTION) {
                                        case jsonAction.GET_USER_LIST:
                                            fillUserList(data.DATA);
                                            break;
                                        case jsonAction.JOIN:
                                            $scope.userJoin(data.DATA);
                                            break;

                                        case jsonAction.LEAVE:
                                            $scope.userLeft(data.DATA);
                                            break;
                                        case jsonAction.SEND:
                                            $scope.addMessage(_data.DATA);
                                            break;
                                    }
                                    break;
                            }
                        })
                    });

                });
                uiCommunicate.$onSynchBroadcast("", uiCommunicate.getSyncBroadcastTypes().RELOAD, reload);
                uiCommunicate.$onSynchBroadcast("", uiCommunicate.getSyncBroadcastTypes().QUIT, disconnect);

            };
            init();
        }]

    }
}
