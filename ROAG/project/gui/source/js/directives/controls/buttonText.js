/**
 * Service for the button-text control
 * @class directive_buttonText
 * @static
 * @constructor
 */
function directive_buttonText() {

    return {
        priority: 10005,
        restrict: 'E',
        transclude: true,
        scope: {
            buttonClick: '&buttonClick',
            buttonDisabled: '=?buttonDisabled'

        },
        templateUrl: window.amazonURL + 'gui/templates/controls/button.html',


        link: function (scope, element, attrs) {
            scope.label = attrs.buttonLabel || "";
            scope.class = attrs.buttonClass || "";

            if (scope.buttonDisabled === undefined || scope.buttonDisabled === null) {
                scope.buttonDisabled = false;
            }
            /**
             * Called on ng-click
             * Check if the state is disabled - don't forward the event so.
             * @event click
             */
            scope.click = function () {
                if (!scope.buttonDisabled) {
                    scope.buttonClick();
                }
            }

        }

    }
}