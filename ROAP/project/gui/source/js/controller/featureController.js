/**
 * @class FeatureController
 * @static
 * @constructor
 */
function FeatureController($scope, uiCommunicateModel, $state,$rootScope) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Features";
  $rootScope.siteTitle = $scope.pageTitle;
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    uiCommunicateModel.FEATURES_OVERVIEW().then(function (_data){
        $scope.featureOverview = _data.DATA;
        $scope.$broadcast('dataloaded');
        // set metatags
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'Features');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Features');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL +"img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'An overview about the unique features of ROA ');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'An overview about the unique features of ROA');
        //
        //console.log("- Features overview");
        //console.log(_data);
    },function(_err){
        //console.log("Feature Overview error");
        //console.log(_err);
    });



  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/



}
