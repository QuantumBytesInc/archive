/**
 * @class SocialShareController
 * @static
 * @constructor
 */
function SocialShareController($scope, uiCommunicateModel, $state, $window, $location, $rootScope) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.pageTitle = "Social share";
    $scope.encodedUri = $window.encodeURIComponent($location.absUrl());
    $scope.$root.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            $scope.encodedUri = $window.encodeURIComponent($location.absUrl());
        });
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    $scope.init = function () {
        shareAnimation();
    }

    /************************************************************** Public - FUNCTIONS - START ***********************************************************/
    /************************************************************** Public - FUNCTIONS - END ***********************************************************/

    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
    function shareAnimation() {
        $(".main .share").unbind("click").bind("click", function () {
            var sb = $(this).find(".socialbox");
            if (sb.hasClass("act")) {
                sb.stop(0, 1).animate({"top": "-70px", "opacity": 0}, 200, function () {
                    sb.css("display", "none")
                });
            }
            else {
                sb.css("display", "block");
                sb.stop(0, 1).animate({"top": "-80px", "opacity": 1}, 200, function () {
                });
            }
            sb.toggleClass("act");
        });
    }

    /************************************************************** Private - FUNCTIONS - END ***********************************************************/


}
