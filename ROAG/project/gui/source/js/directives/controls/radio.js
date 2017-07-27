/**
 * Service for the radio control
 * @class directive_radio
 * @static
 * @constructor
 */
function directive_radio(uiService) {

    return {
            priority: 10005,
            restrict: 'E',
            transclude: true,
            require: "ngModel",

            scope: {
                change: '&radioChange',
                values: '=radioValues',
                name: '=radioName',
                ngModel: '='
            },
            templateUrl: window.amazonURL + 'gui/templates/controls/radio.html',


            link: function (scope, element, attrs, ngModel) {


                scope.radioChange = function () {
                    ngModel.$setViewValue(scope.ngModel);
                    scope.change({_value: scope.ngModel});
                }
            }

        }
}