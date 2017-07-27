/**
 *
 * @param $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {LogService} logService
 * @param OverlayController
 * @constructor
 */
function OverlayController($scope, uiService, uiCommunicate, helperService, logService, $timeout, uiDB) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    /************************************************************** Public - VARIABLES - END **************************************************************/

    $scope.headline = "";
    $scope.subline = "";
    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE

    var showOverlay = function (_id) {
        uiService.showUI(uiService.getUiViews().OVERLAY);
        var location = uiDB.getLocation(_id);
        $scope.headline = location.NAME;
        $scope.subline = location.AREA;
        $scope.logo = window.amazonMediaURL + location.LOGO;
    };
    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    $scope.init = function (_data) {
        ls = logService;
    };


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    $scope.$on(uiCommunicate.getBroadcastTypes().ENTERED_AREA, function (_evt, _data) {
        if (_data.DATA.ID) {
            showOverlay(_data.DATA.ID);
        }

    });

    /**
     * Called if the window is called up again (if it was not destroyed);
     * Get the characterList again / refresh
     * @event ctrlShow
     */
    $scope.$on("ctrlShow", function (_evt, _data) {
        $timeout(function () {
            uiService.hideUI(uiService.getUiViews().OVERLAY);
        }, 10000)
    });
    /************************************************************** Public - EVENTS - END ******************************************************************/


}

