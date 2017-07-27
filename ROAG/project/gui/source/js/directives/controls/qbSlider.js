/**
 * Service for the slider control
 * @class directive_slider
 * @static
 * @constructor
 */
function directive_slider(uiService) {

  return {
            priority: 10005,
            restrict: 'E',
            transclude: true,
            scope: {
                value: '=sliderValue',
                options: '=sliderOptions'
            },
            templateUrl: window.amazonURL + 'gui/templates/controls/slider.html',


            link: function (scope, element, attrs) {
                //Pass value to data.ngmodel so ng-slider can access the right scope.
                scope.data = {};
                scope.data.ngModel = scope.value;

                //Just update the ngModel once the value isn't undefined anymore - we need this else the ng-slider would crash - don'T ask me why.
                scope.$watch("value", function (newValue, oldValue, scope) {
                    //Just update once.
                    if (newValue !== undefined && scope.data.ngModel === undefined) {
                        scope.data.ngModel = newValue;
                    }

                }, true);

                //If the right value is set in our first watch expression, attach to the right "data-change" event.
                scope.$watch("data.ngModel", function (newValue, oldValue, scope) {
                    scope.value = newValue;
                }, true);


                scope.label = attrs.sliderLabel || "";
                scope.labelPosition = attrs.sliderLabelPosition || "right";


            }

        }
}