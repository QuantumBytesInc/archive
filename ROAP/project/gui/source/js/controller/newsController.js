/**

 * @class NewsController
 * @static
 * @constructor
 */
function NewsController($scope, uiCommunicateModel, $rootScope, $state) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.pageTitle = "News";
    $rootScope.siteTitle = $scope.pageTitle;
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    $scope.init = function () {
        uiCommunicateModel.PORTAL_NEWS().then(function (_data) {
            $scope.news = _data.DATA;
            //console.log(_data);
        }, function (_err) {
            //console.log("news error");
            //console.log(_err);
        });

        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'Relics of Annorath - News');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Relics of Annorath - News');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL +"img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'The latest news of ROA.');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'The latest news of ROA.');
    }

    /************************************************************** Public - FUNCTIONS - START ***********************************************************/
    /*
     @method getPortalNewsEntry
     @param {Number} newsID The News ID
     */
    $scope.getPortalNewsEntry = function (newsID) {
        uiCommunicateModel.PORTAL_NEWS_ENTRY(newsID).then(function (_data) {
            $scope.newsSingleEntry = _data.DATA;
            //console.log("- News " + newsID);
            //console.log(_data);
        }, function (_err) {
            //console.log("newsEntry " + newsID + " error");
            //console.log(_err);
        });
    }

    /************************************************************** Public - FUNCTIONS - END ***********************************************************/

    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
    /************************************************************** Private - FUNCTIONS - END ***********************************************************/
}
