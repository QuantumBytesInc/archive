/**
 * @class GettingStartedController
 * @static
 * @constructor
 */
function GettingStartedController($scope, $rootScope, uiCommunicateModel, $state, $stateParams) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.pageTitle = "Getting started";
    $rootScope.siteTitle = $scope.pageTitle;
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    $scope.init = function () {

          $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'Start');
          $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Start');
          $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Start');
          $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'All ready to go? take your first steps into ROA');
          $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'All ready to go? take your first steps into ROA');

    }

    /************************************************************** Private - FUNCTIONS - START ***********************************************************/

    /************************************************************** Private - FUNCTIONS - END ***********************************************************/
}
