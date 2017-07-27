/**
 *
 * @param $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {HelperService} helperService
 * @param {UIUser} uiUser
 * @class EscController
 * @constructor
 */
function EscController($scope, uiService, uiCommunicate,uiCommunicateModel, helperService, uiUser) {

    $scope.showCtrl = false;

    $scope.init = function (_data) {

    };


    /**
     * Triggerd on ng-click.
     * Brings up the settings window.
     * @event settings
     */
    $scope.settings = function () {

        if (uiService.isUIHidden(uiService.getUiViews().TASKBAR)) {
            uiService.showUI(uiService.getUiViews().SETTINGS_MENU);
        }
        else {
            uiCommunicate.broadcast("toggleSettings", {});
        }

        $scope.close();
    };

    /**
     * Triggerd on ng-click.
     * Brings up the help window.
     * @event help
     */
    $scope.help = function () {
        uiService.showUI(uiService.getUiViews().HELP_VIEW);
        $scope.close();
    };

    /**
     * Triggerd on ng-click.
     * Hides the esc-menu
     * @event help
     */
    $scope.close = function () {
        $scope.showCtrl = false;
    };

    /**
     * Triggerd on ng-click.
     * Brings up the log window.
     * @event log
     */
    $scope.log = function () {
        uiService.showUI(uiService.getUiViews().LOG_VIEW);
        $scope.close();
    };
    /**
     * Trigger on ng-click.
     * Quits the game.
     * @event quit
     */
    $scope.quit = function () {

        //Wait for everything to deattach.
        uiCommunicate.syncBroadcast(uiCommunicate.getSyncBroadcastTypes().QUIT).then(function () {


            uiCommunicateModel.AUTHENTICATION_LOGOUT(uiUser.getToken()).then(
                function (_webData) {

                    uiCommunicateModel.UNIGINE_CLOSE().then(
                        function (_engineData) {

                        });

                });
        });


    };

}
