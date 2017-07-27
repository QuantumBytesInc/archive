angular.module('App.directives', [])
    .directive("uiServiceCompileCallback", ['uiService', 'uiCommunicate', 'uiCommunicateModel', function (uiService, uiCommunicate, uiCommunicateModel) {
        return {
            priority: 10010, // make sure it's the last to run

            link: function (scope, element, attributes) {
                var jsonStr = attributes["uiServiceCompileCallback"];

                var data = JSON.parse(jsonStr);
                //Get the scope, and init it with the passed data.
                var uiId = data.id;
                var viewName = data.viewName;
                var showView = data.showView;
                var passedData = uiService.getPassedData(uiId);
                scope.leaveEnabled = true;
                scope.$on(uiCommunicate.getBroadcastTypes().DISABLE_ENTER, function () {
                    scope.leaveEnabled = false;

                });

                scope.$on(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, function () {
                    scope.leaveEnabled = true;
                });
                uiService.preloadImages().then(function () {


                    var viewEle = angular.element('[ui-view="' + viewName + '"');

                    //We bind the mouse enter ourself in the chat-tab-ctrl
                    if (viewName.toUpperCase() !== "CHAT") {
                        viewEle.mouseenter(function () {
                            uiCommunicateModel.UNIGINE_UI_ENTER();

                        });

                        viewEle.mouseleave(function () {
                            if (scope.leaveEnabled) {
                                uiCommunicateModel.UNIGINE_UI_LEAVE();

                            }

                        });
                    }
                    var scopeEle = viewEle.scope();
                    scopeEle.show = function (_data) {
                        if (viewEle.is(":hidden") === true) {
                            viewEle.show();
                        }
                        scopeEle.showCtrl = true;
                        if (_data) {
                            scopeEle.$broadcast("ctrlShow", {DATA: _data});
                        }
                        else {
                            scopeEle.$broadcast("ctrlShow");
                        }

                        if (!scopeEle.$$phase) {
                            scopeEle.$apply();
                        }

                    };
                    scopeEle.hide = function (_data) {
                        if (viewEle.is(":visible") === true) {
                            viewEle.hide();
                        }
                        scopeEle.showCtrl = false;
                        if (_data) {
                            scopeEle.$broadcast("ctrlHide", {DATA: _data});
                        }
                        else {
                            scopeEle.$broadcast("ctrlHide");
                        }

                        if (!scopeEle.$$phase) {
                            scopeEle.$apply();
                        }
                    };
                    /*Bind event if needed.*/
                    scopeEle.$on('$destroy', function () {

                    });

                    scopeEle.$element = viewEle;

                    //After showing the "DOM" show now the angular js :)
                    if (showView == true) {
                        //Fix cause angular js would show the view for some "milliseconds"
                        viewEle.show();
                        scopeEle.showCtrl = true;
                    }
                    else {
                        viewEle.hide();
                        scopeEle.showCtrl = false;
                    }
                    //Initialize controll
                    viewEle.scope().init(passedData.DATA);

                    if (!scopeEle.$$phase) {
                        scopeEle.$apply();
                    }
                    passedData.PROMISE.resolve();

                });


            }
        }
    }])
    .directive('preloadScope', ['uiService', 'uiCommunicate', function (uiService, uiCommunicate) {
        return {
            priority: 10001, // make sure it's the last to run
            scope: {
                compileCallback: "&"
            },
            link: function (scope, element) {

                uiService.preloadImages(function () {
                    var uiViewName = element.parent().attr("ui-view");

                    var viewEle = angular.element('[ui-view="' + uiViewName + '"');

                    viewEle.mouseenter(function () {

                        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).UI_ENTER, {}).then(function (_data) {
                        });
                    });

                    viewEle.mouseleave(function () {

                        uiCommunicate.callEngine(uiCommunicate.getCaller().UNIGINE, uiCommunicate.getActions(uiCommunicate.getCaller().UNIGINE).UI_LEAVE, {}).then(function (_data) {
                        });
                    });

                    var scopeEle = viewEle.scope();
                    scopeEle.show = function () {
                        scopeEle.showCtrl = true;
                        scopeEle.$broadcast("ctrlShow");
                        if (!scopeEle.$$phase) {
                            scopeEle.$apply();
                        }

                    };
                    scopeEle.hide = function () {
                        scopeEle.showCtrl = false;
                        scopeEle.$broadcast("ctrlHide");
                        if (!scopeEle.$$phase) {
                            scopeEle.$apply();
                        }
                    };
                    /*Bind event if needed.*/
                    scopeEle.$on('$destroy', function () {

                    });

                    scopeEle.$element = viewEle;

                    //Fix cause angular js would show the view for some "milliseconds"
                    viewEle.show();
                    //After showing the "DOM" show now the angular js :)

                    scopeEle.show();
                });


                // scope.compileCallback();
            }
        }
    }])
    .directive('ngEnter', [function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }])
    .directive('ngFocus', ['$parse', function ($parse) {
        return function (scope, element, attr) {
            var fn = $parse(attr['ngFocus']);
            element.bind('focus', function (event) {
                scope.$apply(function () {
                    fn(scope, {$event: event});
                });
            });
        }
    }])

    .directive('ngBlur', ['$parse', function ($parse) {
        return function (scope, element, attr) {
            var fn = $parse(attr['ngBlur']);
            element.bind('blur', function (event) {
                scope.$apply(function () {
                    fn(scope, {$event: event});
                });
            });
        }
    }])
    .directive('dropTarget', ['$rootScope', 'uuid', function ($rootScope, uuid) {
        return {
            restrict: 'A',
            scope: {
                onDrop: '&'
            },
            link: function (scope, el, attrs, controller) {
                var id = attrs.id;
                if (!attrs.id) {
                    id = uuid.new()
                    angular.element(el).attr("id", id);
                }

                el.bind("dragover", function (e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                    return false;
                });

                el.bind("dragenter", function (e) {
                    // this / e.target is the current hover target.
                    angular.element(e.target).addClass('lvl-over');
                });

                el.bind("dragleave", function (e) {
                    angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
                });

                el.bind("drop", function (e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    if (e.stopPropogation) {
                        e.stopPropogation(); // Necessary. Allows us to drop.
                    }
                    var data = e.originalEvent.dataTransfer.getData("text");
                    var dest = document.getElementById(id);
                    var src = document.getElementById(data);

                    scope.onDrop({dragEl: src, dropEl: dest, evt: e});
                });

                $rootScope.$on("LVL-DRAG-START", function () {
                    var el = document.getElementById(id);
                    angular.element(el).addClass("lvl-target");
                });

                $rootScope.$on("LVL-DRAG-END", function () {
                    var el = document.getElementById(id);
                    angular.element(el).removeClass("lvl-target");
                    angular.element(el).removeClass("lvl-over");
                });
            }
        }
    }])
    .directive('draggable', ['$rootScope', 'uuid', function ($rootScope, uuid) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs, controller) {
                scope.$watch(function () {
                    return attrs.lvlDraggable;
                }, function (newVal, oldVal) {
                    //Change dragable status if the value is changed.
                    angular.element(el).attr("draggable", newVal);
                });

                angular.element(el).attr("draggable", "true");

                var id = angular.element(el).attr("id");
                if (!id) {
                    id = uuid.new();
                    angular.element(el).attr("id", id);
                }

                el.bind("dragstart", function (e) {
                    e.originalEvent.dataTransfer.setData('text', id);
                    $rootScope.$emit("LVL-DRAG-START");
                });

                el.bind("dragend", function (e) {
                    $rootScope.$emit("LVL-DRAG-END");
                });
            }
        }
    }])
    .directive('dropDown', ['$document', directive_dropdown])
    .directive('textbox', [directive_textbox])
    .directive('buttonText', directive_buttonText)
    .directive('buttonIcon', directive_buttonIcon)
    .directive('radio', ['uiService', directive_radio])
    .directive('checkbox', ['uiService', directive_checkbox])
    .directive('qbSlider', ['uiService', directive_slider])
    .directive("registerKey", ['$compile', '$document', 'uiService', 'logService', directive_registerKey])
    .directive("chatTab", ['$parse', '$timeout', 'uiCommunicate', 'uiCommunicateModel','uiCommunicateSocketModel', '$timeout', '$q', 'logService','uiSocket', directive_chatTab])
    .directive("chatTabCtrl", ['$compile', '$parse', '$timeout', '$rootScope', 'uuid', 'uiCommunicate', 'uiCommunicateModel', directive_chatTabCtrl])
    .directive('item', ['$q', 'uiDB', '$timeout', directive_item])
    .directive('storage', ['$compile', '$timeout', 'uiDB', 'uiCommunicate', 'uiCommunicateSocketModel','uuid', '$q', directive_storage])
    .directive('roaSrc', [directive_src])
    .directive('roaBackgroundImage',[directive_backgroundImage]);