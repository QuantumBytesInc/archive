/**
 * Service for the button-icon control
 * @class directive_buttonIcon
 * @static
 * @constructor
 */
function directive_buttonIcon()
{
  return {
            priority: 10005,
            restrict: 'E',
            transclude: true,
            scope: {
                buttonTooltip: '@?',
                buttonClick: '&buttonClick',
                buttonDisabled: '=?buttonDisabled'
            },
            templateUrl: window.amazonURL + 'gui/templates/controls/buttonIcon.html',


            link: function (scope, element, attrs) {

                scope.label = attrs.buttonLabel || "";
                scope.class = attrs.buttonClass || "";
                if (scope.buttonDisabled === undefined || scope.buttonDisabled === null)
                {
                    scope.buttonDisabled = false;
                }
                /**
                 * Called on ng-click
                 * Check if the state is disabled - don't forward the event so.
                 * @event click
                 */
                scope.click = function ()
                {
                    if (!scope.buttonDisabled)
                    {
                        scope.buttonClick();
                    }
                }
            }

        }
}