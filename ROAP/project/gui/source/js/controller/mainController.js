/**

 * @class MainController
 * @static
 * @constructor
 */
function MainController($scope, $rootScope, uiCommunicateModel, $state, $stateParams, $window, $location, notificationManager) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.pageTitle = "About The Game";
    $rootScope.siteTitle = $scope.pageTitle;
    $scope.subtitle = "Sandbox Game";
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    $scope.init = function () {
        mobileSocialShare();
        loginBoard();
        checkCustomerLogin();
        $rootScope.currentPage = window.location.href;

        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'About the game');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'About the game');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL +"img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'About the game');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'About the game');

    };

    $scope.$root.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            $rootScope.setMetaTag($rootScope.metaTagTypes.OG_URL, window.location.href);

        });

    $scope.keepNotification = function () {
        $window.setTimeout(function () {
            $rootScope.showNotification = false;
            $rootScope.$digest();
        }, 2000);
    };

    /**
     * Check if the screen is mobile.
     * @method isMobile
     * @returns {boolean}
     */
    $scope.$root.isMobile = function ()
    {
        //If user would rotate the device and the height will get the width, it wouldn't be mobile anymore.
        if (window.screen.availWidth <=1070 && window.screen.availHeight<=1070)
        {
            return true;
        }
        return false;
    }

    /**
     * Inherits all meta-tags
     * @type {{}}
     */
    $scope.$root.metaTags = {};

    $scope.$root.setMetaTag = function (_type, _content) {
        $('#meta' + _type).attr('content', _content);
    };

    /**
     * Get all psosible meta tag types
     * @method getMetaTagTypes
     * @returns {{TITLE: string, OG_URL: string, OG_TYPE: string, OG_TTITLE: string, OG_DESCRIPTION: string, OG_IMAGE: string}}
     */
    $scope.$root.metaTagTypes = {
        'TITLE': 'Title',
        'OG_URL': 'OgURL',
        'OG_TYPE': 'OgType',
        'OG_TITLE': 'OgTitle',
        'OG_DESCRIPTION': 'OgDescription',
        'OG_IMAGE': 'OgImage',
        'DESCRIPTION': 'Description',
    };
    //seo
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'About the game');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'About the game');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'About the game');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'About the game');

    /************************************************************** Private - FUNCTIONS - START ***********************************************************/

    function loginBoard() {
        $(".site_header .btn.login").unbind("mouseenter").unbind("mouseleave").bind({
            mouseenter: function () {
                $(this).find(".loginBoard").stop(1, 0).slideDown(300);
                $(this).addClass("act");
            }, mouseleave: function () {
                $(this).find(".loginBoard").stop(0, 1).slideUp(300);
                $(this).removeClass("act");
            }
        });
        $(".site_header .btn.login .loginBoard > a").unbind("click").bind("click", function () {
            $(this).parents(".loginBoard").stop(0, 1).slideUp(300, function () {
                $(".site_header .btn.login").removeClass("act");
                $rootScope.$broadcast("close-navigation");
            });
        });
        $(".site_header .btn.login .mobileTouchArea").unbind("click").bind("click", function () {
            $(this).parents(".btn.login").find(".loginBoard").stop(1, 0).slideDown(300);
            $(this).parents(".btn.login").find(".loginBoard").addClass("act");
        });
    }

    function mobileSocialShare() {
        var scroller = $(".mobile_share");
        var lastScrollTop = 0;
        $(window).scroll(function (event) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) { //down
                scroller.stop(1, 0).animate({"bottom": "-80px"}, 300, function () {
                    scroller.removeClass("anim");
                })
            } else { //up
                if (st < 100) scroller.stop(1, 0).animate({"bottom": 0}, 300, function () {
                    scroller.removeClass("anim");
                })
                else scroller.stop(1, 0).animate({"bottom": "-80px"}, 300, function () {
                    scroller.removeClass("anim");
                })
            }
            if (st + $(window).height() >= $(document).height()) { //end
                scroller.stop(1, 0).animate({"bottom": 0}, 300, function () {
                    scroller.removeClass("anim");
                })
            }
            lastScrollTop = st;
        });
    }

    function checkCustomerLogin() {
        uiCommunicateModel.CUSTOMER_AUTHENTICATED().then(function (_data) {
            $rootScope.loggedIn = _data.DATA;
            if ($rootScope.loggedIn) {
                var msg = "Logged in successfully.";
                var type = "success";
                notificationManager.showNotification(msg, type, 2500);
            }
            //console.log(_data);
            //console.log(_data.DATA);
        });
    }

    /************************************************************** Private - FUNCTIONS - END ***********************************************************/
}
