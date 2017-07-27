/**
 * Service for the src
 * @class directive_src
 * @static
 * @constructor
 */
function directive_backgroundImage() {

    return {
        priority: 10005,
        restrict: 'A',
        link: function (scope, element, attrs) {
            var roaBG = element.attr("roa-background-image");

            if (roaBG.indexOf("/") == 0) {
                roaBG = roaBG.substr(1, roaBG.length - 1);
            }
            element.css({
                'background-image': 'url(' + window.amazonStaticURL + roaBG + ')'

            });

        }

    }
}