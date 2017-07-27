/**
 * Class provides the complete handling of different states and the
 * @param {$compile} $compile
 * @param {$state} $state
 * @param {$timeout} $timeout
 * @param {$interval} $interval
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @class UIService
 * @static
 * @constructor
 */
function UIService($q, $compile, $state, $timeout, $interval, helperService, logService, $rootScope) {

    /************************************************************** Private - Variables - START *****************************************************/
    /**
     * @type HelperService
     * @private
     */
    var hs = null;

    /**
     * @type {LogService}
     * @private
     */
    var ls = null;


    /**
     * Inherits the active state
     * @private
     * @type {string}
     */
    var activeState = "";

    /**
     * The form element
     * @private
     * @type {$|element}
     */
    var formEle = null;

    /**
     * The angular-scope
     * @private
     * @type {scope}
     */
    var angularScope = null;
    /**
     * Inherits all created ui elements
     * @type {array}
     */
    var uiElements = null;

    /**
     * Inherits the uniqueId - counted up on "getUniqueId"
     * @private
     * @property getUniqueId
     * @type {number}
     */
    var uniqueId = 0;

    /**
     * Inherits the uiId for showUI method
     * @private
     * @type {number}
     */
    var uiId = 0;

    /**
     * Inherits the passed data for the shown UI, with the uiId as indexer.
     * @private
     * @property getPassedData
     * @type {element}
     */
    var passedData = null;
    /************************************************************** Private - Variables - END *******************************************************/
    /************************************************************** Private - Functions - START *****************************************************/

    /**
     * @constructor
     */
    var init = function init() {

        hs = helperService;
        ls = logService;

        formEle = $("#form");
        angularScope = $rootScope;//angular.element(document).scope();
        uiElements = {};
        passedData = {};
        /**
         * Extension for document object - crawles through passed element-css for the given style.
         * @method
         */
        document.deepCss = function (who, css) {
            if (!who || !who.style) return '';
            var sty = css.replace(/\-([a-z])/g, function (a, b) {
                return b.toUpperCase();
            });

            if (who.currentStyle) {
                return who.style[sty] || who.currentStyle[sty] || '';
            }
            var dv = document.defaultView || window;
            return who.style[sty] ||
                dv.getComputedStyle(who, "").getPropertyValue(css) || '';
        }

    };

    /**
     * Returns all not c
     * @property getBackgroundImages
     * @returns {Array}
     */
    var getBackgroundImages = function getBackgroundImages() {
        var url, B = [], A = jQuery("*").toArray();
        while (A.length) {
            url = document.deepCss(A.shift(), 'background-image');
            if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
            url = url[1];
            if (url && B.indexOf(url) == -1) B[B.length] = url;
        }
        return B;

    };

    /************************************************************** Private - Functions - END *******************************************************/

    /************************************************************** Public - PROPERTIES - START *****************************************************/

    /**
     * Returns the actual states
     * @property getStates
     * @readOnly
     * @type [element}
     * @returns {{LOGIN: string, GAME: string}}
     */
    this.getStates = function getStates() {

        var state = "";
        var states = {};
        for (state in window.globalStateProvider) {
            states[state] = state;
        }

        return states;
    };


    /**
     * Returns the actual existing Ui-Views for the active state.
     * @property getUiViews
     * @readOnly
     * @type {Array}
     * @returns {Array}
     */
    this.getUiViews = function getUiViews() {
        var uiViews = {};
        if (window.globalStateProvider[activeState] !== undefined) {
            uiViews = window.globalStateProvider[activeState].views;
        }

        return uiViews;
    };

    /**
     *
     * @param _uiId
     * @returns {*}
     */
    this.getPassedData = function (_uiId) {
        return passedData[_uiId];
    };

    /************************************************************** Public - PROPERTIES - END *******************************************************/


    /************************************************************** Public - Functions - START ******************************************************/

    /**
     * Brings up or shows a given UI.
     * @method
     * @param {object|getUiViews()} _uiView
     * @param {object}  [_data] - Optional data, will be passed into $scope.init(_data).
     */
    this.createUI = function createUI(_uiView, _data) {

        var base = this;
        var uiView = _uiView;
        var uiViewName = uiView.viewName;
        var view = base.getUiViews()[uiViewName];
        var deferred = $q.defer();
        //Is the actual called view provided for the active state?
        if (view !== null && view !== undefined) {

            if (uiElements[uiViewName] === undefined || uiElements[uiViewName] === null) {

                /// \todo if view is created, but don't run into the directive to finish the event, we need to check it here and do something strange then.
                /// \todo normaly just happens if the angular-state isn't rightly rendered on start, so just UI's on start would need that check.
                //Element doesn't exist - create it
                uiId += 1;
                var passedUiId = uiId;

                var data = _data;
                if (data === undefined || data === null) {
                    data = {};
                }
                data = {PROMISE: deferred, DATA: data};
                passedData[passedUiId] = data;

                //Data will be grabbed in uiServiceCompileCallback-directive
                var viewInitParam = {viewName: uiViewName, id: passedUiId, showView: false};
                //Stringify it, cause we pass this attributes via HTML... bad alternative but need to be
                viewInitParam = "'" + JSON.stringify(viewInitParam).toString() + "'";

                //removed  ng-init="init(' + viewInitParam + ')" 24.august.2014 - LS
                //Compile callback will transfer the ui-data
                var controlEle = $('<div style="display:none" class="view_' + uiViewName + '" ng-show="showCtrl" ui-view="' + uiViewName + '" ui-service-compile-callback=' + viewInitParam + '></div>');

                uiId += 1;
                formEle.append(controlEle);
                $compile(controlEle)(angularScope);

                uiElements[uiViewName] = true;

            }
            else {
                //Element already created - show it
                //angular.element('[ui-view="' + uiViewName + '"').scope().show();
                $timeout(function () {
                    deferred.resolve();
                }, 0, false);
            }

        }
        else {
            ls.log("View not existing" + uiViewName, ls.logType().WARN);
            $timeout(function () {
                deferred.resolve();
            }, 0, false);
        }
        return deferred.promise;
    };


    /**
     * Brings up or shows a given UI.
     * @method
     * @param {object|getUiViews()} _uiView
     * @param {object}  [_data] - Optional data, will be passed into $scope.init(_data).
     */
    this.showUI = function showUI(_uiView, _data) {
        var base = this;
        var uiView = _uiView;
        var uiViewName = uiView.viewName;
        var view = base.getUiViews()[uiViewName];

        var deferred = $q.defer();
        var promise = deferred.promise;
        //Is the actual called view provided for the active state?
        if (view !== null && view !== undefined) {

            if (uiElements[uiViewName] === undefined || uiElements[uiViewName] === null) {

                /// \todo if view is created, but don't run into the directive to finish the event, we need to check it here and do something strange then.
                /// \todo normaly just happens if the angular-state isn't rightly rendered on start, so just UI's on start would need that check.
                //Element doesn't exist - create it
                uiId += 1;
                var passedUiId = uiId;

                var data = _data;
                if (data === undefined || data === null) {
                    data = {};
                }
                data = {PROMISE: deferred, DATA: data};
                passedData[passedUiId] = data;
                //Data will be grabbed in uiServiceCompileCallback-directive
                var viewInitParam = {viewName: uiViewName, id: passedUiId, showView: true};
                //Stringify it, cause we pass this attributes via HTML... bad alternative but need to be
                viewInitParam = "'" + JSON.stringify(viewInitParam).toString() + "'";

                //removed  ng-init="init(' + viewInitParam + ')" 24.august.2014 - LS
                //Compile callback will transfer the ui-data
                var controlEle = $('<div style="display:none" class="view_' + uiViewName + '" ng-show="showCtrl" ui-view="' + uiViewName + '" ui-service-compile-callback=' + viewInitParam + '></div>');

                uiId += 1;
                formEle.append(controlEle);
                $compile(controlEle)(angularScope);

                uiElements[uiViewName] = true;

            }
            else {
                //Element already created - show it
                angular.element('[ui-view="' + uiViewName + '"').scope().show(_data);
                $timeout(function () {
                    deferred.resolve();
                }, 0, false);
            }

        }
        else {
            ls.log("View not existing" + uiViewName, ls.logType().WARN);
            $timeout(function () {
                deferred.resolve();
            }, 0, false);
        }
        return deferred.promise;
    };
    /**
     * Get the UIScope (if element exists)
     * @method
     * @param {object|getUiViews()} _uiView
     */
    this.getUIScope = function getUIScope(_uiView) {
        var base = this;
        var uiView = _uiView;
        var uiViewName = uiView.viewName;
        var view = base.getUiViews()[uiViewName];

        var deferred = $q.defer();

        //Is the actual called view provided for the active state?
        if (view !== null && view !== undefined) {

            if (uiElements[uiViewName] === undefined || uiElements[uiViewName] === null) {

                return null;

            }
            else {
                //Element already created - show it
                return angular.element('[ui-view="' + uiViewName + '"').scope();

            }

        }
        else {
            return null;
        }
        return null;
    };


    /**
     *  Preloads all images on all background images.
     *  /// \todo maybe map images which already were preloaded
     * @method
     * @param {function} _callback - called when all images are preloaded.
     */
    this.preloadImages = function preloadImages() {
        var deferred = $q.defer();


        var images = getBackgroundImages();
        var count = images.length;
        if (count === 0) {
            setTimeout(function () {
                deferred.resolve();
            }, 0);
            return deferred.promise;
        }
        var loaded = 0;
        for (var i = 0; i < images.length; i++) {


            $('<img>').attr('src', images[i]).on('load', function () {
                delete this;
                loaded++;
                if (loaded === count) {
                    deferred.resolve();

                }
            }).on('error', function () {
                delete this;
                loaded++;
                if (loaded === count) {
                    deferred.resolve();
                }
            });
        }
        return deferred.promise;

    };

    /**
     * Hides the passed ui
     * @method
     * @param {object|getUiViews()} _uiView
     */
    this.hideUI = function hideUI(_uiView, _data) {
        var base = this;
        var uiView = _uiView;
        var uiViewName = uiView.viewName;

        //Is the actual called view provided for the active state?
        if (base.getUiViews()[uiViewName] !== null && base.getUiViews()[uiViewName] !== undefined) {

            if (uiElements[uiViewName] !== undefined && uiElements[uiViewName] !== null) {
                ls.log("View hidden" + uiViewName, ls.logType().INFO);
                //Hide element
                angular.element('[ui-view="' + uiViewName + '"').scope().hide(_data);
            }
            else {
                ls.log("View not created" + uiViewName, ls.logType().WARN);
            }

        }
        else {
            ls.log("View not existing" + uiViewName, ls.logType().WARN);
        }
    };


    /**
     * Checks if the ui is hidden
     * @property isUIHidden
     * @param {object|getUiViews()} _uiView
     */
    this.isUIHidden = function isUIHidden(_uiView) {
        var base = this;
        var uiView = _uiView;
        var uiViewName = uiView.viewName;

        //Is the actual called view provided for the active state?
        if (base.getUiViews()[uiViewName] !== null && base.getUiViews()[uiViewName] !== undefined) {

            if (uiElements[uiViewName] !== undefined && uiElements[uiViewName] !== null) {
                ls.log("Is view hidden" + uiViewName, ls.logType().INFO);
                //Hide element
                return !angular.element('[ui-view="' + uiViewName + '"').scope().showCtrl;
            }
            else {
                ls.log("View not created" + uiViewName, ls.logType().WARN);
                return true;
            }

        }
        else {
            ls.log("View not existing" + uiViewName, ls.logType().WARN);
            return true;
        }
    };

    /**
     * Destroys the passed UI
     * @method
     * @param {object|getUiViews()} _uiView
     */
    this.destroyUI = function destroyUI(_uiView) {
        var base = this;
        var uiView = _uiView;
        var uiViewName = uiView.viewName;
        //Is the actual called view provided for the active state?
        if (base.getUiViews()[uiViewName] !== null && base.getUiViews()[uiViewName] !== undefined) {

            if (uiElements[uiViewName] !== undefined && uiElements[uiViewName] !== null) {
                ls.log("View destroyed" + uiViewName, ls.logType().INFO);

                var ele = angular.element('[ui-view="' + uiViewName + '"');
                //Hide
                ele.scope().hide();
                //Destroy scope
                if (ele.scope().$parent && ele.scope().$parent.$destroy) {
                    ///lars Saalbach - removed destroy of parent scope, cause other ui views were affected of this and weren't displayed rightly after (wtf?) 18.02.2015
                    //ele.scope().$parent.$destroy();
                }
                ele.scope().$broadcast("$destroy");
                ele.scope().$destroy();

                //Remove from dom.
                ele.remove();
                //Hide element

                //Delete in array
                uiElements[uiViewName] = null;

            }
            else {
                ls.log("View not created" + uiViewName, ls.logType().WARN);
            }

        }
        else {
            ls.log("View not existing" + uiViewName, ls.logType().WARN);
        }
    };


    /**
     * Returns a new unique id.
     * @property getUniqueId
     * @readOnly
     * @returns {string}
     */
    this.getUniqueId = function getUniqueId() {
        uniqueId += 1;
        return "roa_" + uniqueId;
    };

    /**
     * Returns the actual state
     * @property getState
     * @returns {string}
     */
    this.getState = function getState() {
        return activeState;
    };
    /**
     * Change to the passed state.
     * States are defined in the routeProvider.
     * States are changed e.g. in the Login Screen -> Login State changed to game state.
     * @method
     * @param {string/getStates} _state
     */
    this.changeState = function changeState(_state) {
        var deferred = $q.defer();

        var base = this;
        var state = _state;
        if (base.getStates()[state] !== undefined) {
            ls.log("State changed:" + state, ls.logType().INFO);

            activeState = state;
            $state.go(state);

            //$state needs some time to get changed rightly, after $scope.$watch cant handle $q.promise() we take an interval and cancel ourself if state is changed.
            var promiseInterval = $interval(function () {

                if ($state.current.name === activeState) {
                    deferred.resolve();
                    $interval.cancel(promiseInterval);
                }

            }, 20,0,false);

        }
        else {
            ls.log("State don't exists :" + state, ls.logType().WARN);
            $timeout(function () {
                deferred.resolve();
            },0,false);

        }

        return deferred.promise;
    };
    /************************************************************** Public - Functions - END ********************************************************/
    init();
}
