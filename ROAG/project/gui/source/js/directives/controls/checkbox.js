/**
 * Service for the checkbox control
 * @class directive_checkbox
 * @static
 * @constructor
 */
function directive_checkbox(uiService) {
   return {
            priority: 10005,
            restrict: 'E',
            transclude: true,
            scope: {
                checked: '=checkboxChecked',
                chkChange: '&checkboxChange',
                disabled: "=?ngDisabled"
            },
            templateUrl: window.amazonURL + 'gui/templates/controls/checkbox.html',


            link: function (scope, element, attrs) {

                scope.$watch('checked', function (newVal, oldVal) {

                });

                scope.change = function()
                {
                    if (scope.chkChange)
                    {
                        scope.chkChange();
                    }

                };


                scope.id = uiService.getUniqueId();
                scope.label = attrs.checkboxLabel || "";
                scope.element = element;

            }

        }
}