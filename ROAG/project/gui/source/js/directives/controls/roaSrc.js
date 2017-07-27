/**
 * Service for the src
 * @class directive_src
 * @static
 * @constructor
 */
function directive_src() {

    return {
        priority: 10005,
        restrict: 'A',
        link: function (scope, element, attrs) {
            var roaSrc = element.attr("roa-src");
            if (roaSrc.indexOf("/") == 0) {
                roaSrc = roaSrc.substr(1, roaSrc.length - 1);
            }
            element.attr("src", window.amazonStaticURL + roaSrc);
        }

    }
}