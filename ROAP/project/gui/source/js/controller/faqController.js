/**

 * @class FaqController
 * @static
 * @constructor
 */
function FaqController($scope, uiCommunicateModel, $state, faqProps, $rootScope, $timeout) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.pageTitle = "FAQ";
    $rootScope.siteTitle = $scope.pageTitle;
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    $scope.init = function () {
        uiCommunicateModel.PORTAL_FAQS().then(function (_data) {
            $scope.faqs = _data.DATA;
            $scope.$broadcast('dataloaded');
            //console.log("- Faqs");
            //console.log(_data);
        }, function (_err) {
            //console.log("faq error");
            //console.log(_err);
        });

        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'FAQ');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Frequently asked questions');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'FAQ');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL + "img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'Frequently asked questions');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'Questions that are asked often, both support and stats');
        $timeout(function () {
            //Wait for new url
            $scope.$root.setMetaTag($rootScope.metaTagTypes.OG_URL, window.location.href);
        }, 50)

    }


    /************************************************************** Public - FUNCTIONS - START ***********************************************************/
    $scope.navigateToDetailFAQ = function (faqCategory, faqID, faqTitle) {
        faqProps.currentFaqTitle = faqTitle;
        $state.go("faqDetail", {"faqCategory": faqCategory, "faqID": faqID, "faqTitle": faqTitle}, {inherit: false});
    }
    /************************************************************** Public - FUNCTIONS - END ***********************************************************/
    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
    /************************************************************** Private - FUNCTIONS - END *************************************************************/
}
