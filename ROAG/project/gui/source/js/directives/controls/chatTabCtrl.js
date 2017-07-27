/**
 * Service for the chatTab control control
 * @class directive_chatTabCtrl
 * @static
 * @constructor
 */

function directive_chatTabCtrl($compile, $parse, $timeout, $rootScope, uuid, uiCommunicate, uiCommunicateModel) {
    return {
        restrict: 'E',
        templateUrl: window.amazonURL + 'gui/templates/controls/chatTabCtrl.html',
        scope: {
            tabId: "=tabId",
            chatInit: "&chatInit"
        },
        controller: ['$scope', '$element', function ($scope, $element) {
            $scope.uniqueId = uuid.new();
            $scope.$element = $element;
            $scope.leaveEnabled = true;
            $scope.$on(uiCommunicate.getBroadcastTypes().DISABLE_ENTER, function () {
                $scope.leaveEnabled = false;
            });

            $scope.$on(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, function () {
                $scope.leaveEnabled = true;
            });
            $scope.$element.mouseenter(function () {

                uiCommunicateModel.UNIGINE_UI_ENTER();

            });

            $scope.$element.mouseleave(function () {
                if ($scope.leaveEnabled === true) {
                    uiCommunicateModel.UNIGINE_UI_LEAVE();

                }
            });


            $(document).mousedown(function () {

            }).mouseup(function () {
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, {});
            });
            var resizeSensor = new ResizeSensor($('.resizer'), function () {
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().DISABLE_ENTER, {});
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, uiCommunicate.createBroadcastData().UI_BRING_TO_FRONT($scope.uniqueId));
                var tabs = $scope.getTabs();
                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].resize();
                }

            });

            $scope.isTabCtrl = true;
            $scope.isDragable = false;
            var startDragOffset = {w: 0, h: 0};
            //#controls - controlbar - close
            $scope.closeChat = function () {

                uiCommunicate.broadcast("toggleChat", {});
                //uiCommunicate.broadcast("toggleChat",{});
                //var tabs = $scope.getTabs();
                //for (var i = 0; i < tabs.length; i++) {
                //  tabs[i].closeChat();
                // }

                // $scope.closeTabs();
            };


            /**
             * Called on ng-click, minimize chat
             * @event minimizeChat
             */
            $scope.minimizeChat = function () {
                uiCommunicate.broadcast("toggleChat", {});
            };


            //#region - moveable section - dragarround
            var mouseUp = function () {
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, {});
                window.removeEventListener('mousemove', divMove, true);
            };
            var mouseDown = function (e) {
                var target = $scope.$element.find("[data-id='container']")[0];
                startDragOffset = {
                    w: e.clientX - parseInt(target.style.left),
                    h: e.clientY - parseInt(target.style.top)
                };
                // @todo bring to front

                //
                //if ($(e.originalEvent.toElement).data("id") === "container")
                // all drag except tabs
                var isTab = $(e.originalEvent.toElement).parents('.tabtitle').length;
                var isInput = $(e.originalEvent.toElement).prop("tagName") == "INPUT";
                var isButton = $(e.originalEvent.toElement).prop("tagName") == "BUTTON";
                if (!isTab && !isInput && !isButton) {
                    uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().DISABLE_ENTER, {});
                    uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, uiCommunicate.createBroadcastData().UI_BRING_TO_FRONT($scope.uniqueId));
                    window.addEventListener('mousemove', divMove, true);
                }
            };

            // @param _chat chat html
            $scope.bringToFront = function (_chat) {
                var zindex = $scope.$parent.chatZIndex++;
                $(_chat).css("z-index", zindex)
            };
            $scope.$on(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, function (_evt, _data) {

                if (_data.DATA.UNIQUE_ID !== $scope.uniqueId) {
                    $scope.bringToFront(false);
                }
                else {
                    $scope.bringToFront(true);
                }
            });
            $scope.bringToFront = function (_front) {
                if (_front) {
                    $scope.$element.find("[data-id='container']").css("z-index", 101);
                }
                else {
                    $scope.$element.find("[data-id='container']").css("z-index", 100);
                }
            };


            var divMove = function (e) {
                var div = $scope.$element.find("[data-id='container']")[0];
                div.style.position = 'absolute';
                div.style.left = (e.clientX - startDragOffset["w"]) + "px";
                div.style.top = (e.clientY - startDragOffset["h"]) + "px";
            };


            $scope.$element.find("[data-id='container'] .jewel").mousedown(mouseDown);
            window.addEventListener('mouseup', mouseUp, false);
            //#endregion

            // @return array
            $scope.getTabs = function getTabs() {
                var tabs = [];
                $scope.$element.find("[data-id=tabstrip]").find("chat-tab").each(function () {
                    //Take the child element else the wrong scope will be taken.
                    tabs.push(angular.element($(this).children()[0]).scope());
                });
                return tabs;
            };

            $scope.closeTab = function (_channelId) {
                var tabs = $scope.getTabs();
                if (tabs.length <= 1) {
                    //Dismiss complete chat.
                    $scope.$destroy();
                    $scope.$element.remove();
                }
                else {
                    for (var i = 0; i < tabs.length; i++) {
                        if (tabs[i].getChannelId() === _channelId) {
                            tabs[i].$destroy();
                            tabs[i].$element.remove();
                        }
                    }
                }
            };
            $scope.closeTabs = function () {
                var tabs = $scope.getTabs();
                if (tabs.length <= 1) {
                    //Dismiss complete chat.
                    $scope.$destroy();
                    $scope.$element.remove();
                }
                else {
                    for (var i = 0; i < tabs.length; i++) {
                        if (tabs[i].getChannelId() === _channelId) {
                            tabs[i].$destroy();
                            tabs[i].$element.remove();
                        }
                    }
                }
            };
            $scope.showTab = function (_channelId) {
                var tabs = $scope.getTabs();
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].getChannelId() !== _channelId) {
                        tabs[i].setVisible(false);
                        tabs[i].$element.removeClass("active");
                    }
                }
            };

            $scope.checkTabs = function () {
                if ($scope.getTabs().length <= 0) {
                    //Dismiss tabctrl.

                    if ($scope.$parent && $scope.$parent.$destroy) {
                        $scope.$parent.$destroy();
                    }
                    $scope.$destroy();
                    $scope.$element.remove();
                }
            };

            /**
             * resize content height to 100%
             * @new
             */
            $scope.$element.find(".resizer").resize(function () {
                var w = $(this).width();
                var h = $(this).height();
                var interaction = $(this).find(".interaction");
                var otherHeight = 110;
                $(interaction).css("height", h - otherHeight);
            });

            $scope.drop = function (dragEl, dropEl, evt) {
                //Cancle the bubble, else we would call the global drop event aswell.
                evt.originalEvent.cancelBubble = true;
                var draggedScope = angular.element(dragEl).scope();
                $scope.isDragable = false;
                if (draggedScope.isTabCtrl) {
//                        //We dropped a tab control
//
//                        if (draggedScope.tabId != angular.element(dropEl).scope().tabId) {
//                            //@todo
//
//                            var draggedTabs = draggedScope.getTabs();
//
//                            if (draggedTabs.length > 0) {
//                                //We have tabs inside.
//                                $.each(draggedTabs, function () {
//                                    $scope.$element.find("[data-id=tabstrip]").append(this.$element);
//                                    this.setTabId($scope.tabId);
//                                    this.$parent = $scope;
//
//                                });
//
//
//                                if (draggedScope.$parent && draggedScope.$parent.$destroy) {
//                                    // draggedScope.$parent.$destroy();
//                                }
//                                //draggedScope.$destroy();
//
//                                draggedScope.$element.remove()
//                            }
//                            else {
//                                $scope.initTab(angular.element(dropEl).scope().tabId);
//                                $scope.isDragable = false;
//
//
//                                if (draggedScope.$parent && draggedScope.$parent.$destroy) {
//                                    //draggedScope.$parent.$destroy();
//                                }
//                                //draggedScope.$destroy();
//
//                                draggedScope.$element.remove()
//                            }
//
//
//                        }

                }
                else if (draggedScope.isTab) {
                    //we droppen a tab.


                    var tabCtrlScope = $("chat-tab-ctrl[tab-id='" + draggedScope.tabId + "']").isolateScope();

                    $scope.$element.find("[data-id=tabstrip]").append(draggedScope.$element);

                    //draggedScope.$parent = $scope;
                    draggedScope.setTabId($scope.tabId);

                    if (tabCtrlScope && tabCtrlScope.getTabs && tabCtrlScope.getTabs().length <= 0) {
                        //We dropped the last tab, remove this controll now.

                        //angular.element(dragEl).scope().$element

                        //tabCtrlScope.$destroy();
                        tabCtrlScope.$element.remove();

                    }


                }
                else {
                    alert("other");
                }

            };
            $scope.initTab = function initTab(_tabId, _channelId) {
                var controlEle = $("<chat-tab data-tabId='" + _tabId + "' data-channelId='" + _channelId + "' />");
                $scope.$element.find("[data-id=tabstrip]").append(controlEle);
                $compile(controlEle)($scope);

            };
            $scope.addExistingTab = function addExistingTab(_el) {

            };

            $scope.chatInit({_scope: $scope});
            //Make our chatcontrolle resizeable.


        }],
        link: function (scope, ele, attrs) {

        }


    }
}