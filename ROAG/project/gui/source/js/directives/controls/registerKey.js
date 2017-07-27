/**
 * Service for the registerKey control
 * @class directive_registerKey
 * @static
 * @constructor
 */
function directive_registerKey($compile, $document, uiService,logService)
{
  return {
            priority: 10005,
            restrict: 'E',
            scope: {
                ngModel: "=",
                change: '&change',
                click: '&click',
                init: '&init'
            },
            templateUrl: window.amazonURL + 'gui/templates/controls/registerkey.html',


            link: function (scope, element, attrs) {
                /**
                 * Internal key binding, map " " to Backspace e.g.
                 * @param {ascii} _keyCode
                 */
                var bindKey = function (_keyCode) {

                    var boundKey = "";
                    switch (_keyCode) {
                        case 16:
                            boundKey = "SHIFT";
                            break;
                        case 17:
                            boundKey ="CTRL";
                            break;
                        case 18:
                            boundKey ="ALT";
                            break;
                        case 32:
                            boundKey = "BACKSPACE";
                            break;
                        case 0:
                            boundKey = "EMPTY";
                            break;
                        case 37:
                            boundKey = "LEFT";
                            break;
                        case 38:
                            boundKey = "TOP";
                            break;
                        case 39:
                            boundKey = "RIGHT";
                            break;
                        case 40:
                            boundKey = "BOTTOM";
                            break;
                        default:
                            boundKey = String.fromCharCode(_keyCode).toUpperCase();
                            break;

                    }


                    element.find("span").text(boundKey);
                };

                scope.ngModel = scope.ngModel;
                var oldChar = scope.ngModel;
                var newChar = "";

                var name = attrs.name || "";
                var keypressBound = false;


                bindKey(oldChar);


                /**
                 * Called on ng-click
                 * @event registerKey
                 */
                scope.registerKey = function () {
                    oldChar = scope.ngModel;
                    scope.click({_name:name, _value:oldChar});

                    $document.bind('keyup', scope.keyPress);
                    keypressBound = true;


                    element.find("span").text("Press any key...");
                };

                /**
                 * Reverts the char changes.
                 * @method
                 */
                scope.revert = function () {
                    if (keypressBound === true) {
                        scope.ngModel = oldChar;
                        bindKey(oldChar);

                        $document.unbind('keyup', scope.keyPress);
                        keypressBound = false;
                    }
                };

                /**
                 * Called on keypress
                 * @event keyPress
                 */
                scope.keyPress = function (_event) {
                    var pressedKeyCode = _event.keyCode;
            //		    logService.logINFO("Keycode:" + pressedKeyCode);
                    pressedKeyCode = String.fromCharCode(pressedKeyCode).toLowerCase().charCodeAt(0);

                    var canBeChanged = true;
                    if ((pressedKeyCode >= 97 && pressedKeyCode <= 122) || (pressedKeyCode >= 37 && pressedKeyCode <= 40) || pressedKeyCode === 32 || (pressedKeyCode >= 16 && pressedKeyCode <= 18 )) {

                        //Check if we can change this key
                        if (scope.change) {
                            canBeChanged = scope.change({ _name: name, _value: pressedKeyCode });
                        }
                    }
                    else {
                        canBeChanged = false;
                    }


                    if (canBeChanged === false) {
                        bindKey(oldChar);
                        scope.ngModel = oldChar;
                    }
                    else {
                        scope.ngModel = pressedKeyCode;
                        //Set via HTML, cause the ngModel is a little bit crashed cause we take control about html and angular ;)

                        bindKey(pressedKeyCode);
                        if (!scope.$$phase) {
                            scope.$apply();
                        }


                    }

                    //Unbind
                    $document.unbind('keyup', scope.keyPress);


                    keypressBound = false;
                };

                /**
                 * Returns the actual bounded key
                 * @property getKey
                 * @readOnly
                 * @returns {string}
                 */
                scope.getKey = function () {
                    return scope.ngModel;
                };

                /**
                 * Sets the passed key
                 * @property setKey
                 * @writeOnly
                 * @param {string/number} _key - If integer it will be transformed via String.fromCharCode
                 */
                scope.setKey = function (_key) {
                    var key = _key;
                    scope.ngModel = key;
                    bindKey(key);

                };
                //Send init event to controller
                scope.init({_name: name, _instance: scope});


            }

        }
}
