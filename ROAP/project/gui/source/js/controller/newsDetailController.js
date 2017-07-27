/**

 * @class NewsDetailController
 * @static
 * @constructor
 */
function NewsDetailController($scope, uiCommunicateModel, metatagFormatter, $state, $stateParams, $rootScope) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "News Entry";
  $scope.newsID = $stateParams.newsID;
  $rootScope.siteTitle = $scope.pageTitle;
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    uiCommunicateModel.PORTAL_NEWS_ENTRY($stateParams.newsID).then(function (_data) {
        $scope.newsSingleEntry = _data.DATA;
        // set metatags
        var title = $scope.newsSingleEntry.TITLE;
        $rootScope.siteTitle = title;
        var description = metatagFormatter.format($scope.newsSingleEntry.TEXT);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, title);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, title);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL +"img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, description);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, description);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_URL, window.location.href);
        //
        $scope.pageTitle = "News Entry";
        //console.log("- News "+$stateParams.newsID);
        //console.log(_data);
    },function(_err){
        //console.log("newsEntry "+$stateParams.newsID+" error");
        //console.log(_err);
    });


  }


  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  $scope.navigateBackToList = function(){
    $state.go("news");
  }
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/


  /************************************************************** Private - FUNCTIONS - END ***********************************************************/
}
