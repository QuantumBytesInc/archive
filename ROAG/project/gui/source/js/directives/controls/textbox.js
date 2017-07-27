/**
 * Service for the textbox control
 * @class directive_textbox
 * @static
 * @constructor
 */
function directive_textbox()
{
    return {
            priority: 10005,
            restrict: 'E',
            transclude: true,
            scope: {
                textModel: '=textModel',
                textEnter: '&textEnter',
                textRequired: '=?textRequired'
            },
            templateUrl: window.amazonURL + 'gui/templates/controls/textbox.html',


            link: function (scope, element, attrs) {

                scope.error = "";
                scope.placeholder = attrs.textPlaceholder || "";

                //Texttype
                scope.type = attrs.textType || "text";
                if (scope.type !== "text" && scope.type !== "password") {
                    scope.type = "text";
                }

                //Required?
                scope.required = scope.textRequired || "false";
                if (scope.required === "true" || scope.required === "required") {
                    scope.required = true;
                }
                else {
                    scope.required = false;
                }

                scope.label = attrs.textLabel || "";
                scope.labelPosition = attrs.textLabelPosition || "right";

            }

        }
}
