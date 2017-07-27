/**
 * Service for the dropdown control
 * @class directive_dropdown
 * @static
 * @constructor
 */
function directive_dropdown($document) {
    return {
        priority: 10005,
        restrict: 'E',
        transclude: true,
        scope: {
            values: '=ddlValues',
            change: '&ddlChange'
        },
        templateUrl: window.amazonURL + 'gui/templates/controls/dropdown.html',

        link: function (scope, element, attrs) {

            /**
             * Indicator if we need to bind the click event
             * @private
             * @type {boolean}
             */
            var firstToggleCall = true;
            scope.showSelect = false;
            scope.label = attrs.dropdownLabel || "";
            scope.labelPosition = attrs.dropdownLabelPosition || "right";

            scope.selectedEntry = "";

            if (scope.values) {


                for (var i = 0; i < scope.values.length; i++) {
                    //Set the entry which is "selected"
                    scope.$watch('values[' + i + ']["selected"]', function (newVal, oldValue, scope) {

                        if (scope.values) {
                            for (var i = 0; i < scope.values.length; i++) {
                                if (scope.values[i].selected === true) {
                                    scope.selectedEntry = scope.values[i].value;
                                    break;
                                }
                            }
                        }
                    }, true)
                }
            }
            else {
                //Watch if values has been changed, cause dynamic binding e.g.
                scope.$watch("values", function (newVal, oldValue, scope) {
                    if (scope.values) {


                        for (var i = 0; i < scope.values.length; i++) {
                            if (scope.values[i].selected === true) {
                                scope.selectedEntry = scope.values[i].value;
                                break;
                            }
                        }
                    }
                }, true);
            }
            //Show hide dropdown
            scope.toggle = function () {

                if (element.attr("disabled") !== "disabled") {
                    if (firstToggleCall === true) {
                        $document.bind('click', onClick);
                        firstToggleCall = false;
                    }
                    scope.showSelect = !scope.showSelect;
                    if (scope.showSelect === false) {
                        //Unbind
                        $document.unbind('click', onClick);
                        //Reset
                        firstToggleCall = true;
                    }
                }
            };

            //Select clicked entry.
            scope.select = function (_entry) {
                for (var i = 0; i < scope.values.length; i++) {
                    scope.values[i].selected = false;
                }
                _entry.selected = true;
                scope.selectedEntry = _entry.value;
                //Check if we can change this key
                if (scope.change) {
                    scope.change({_key: _entry.key, _value: _entry.value});
                }

            }

            /**
             * Called on document.click event
             * Check if we clicked our dropdown element, else hide the dropdown.
             * @event onClick
             * @private
             * @param {event} event
             */
            var onClick = function (event) {
                var isChild = element.has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                if (!isInside) {
                    scope.showSelect = false;
                    //Apply else the data are not pushed, cause its no "ng-click" event
                    scope.$apply();
                }
            }

        }
    }
}