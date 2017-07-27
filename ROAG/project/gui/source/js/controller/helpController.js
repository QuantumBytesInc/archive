/**
 *
 * @param {$scope} $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {HelperService} helperService
 * @class HelpController
 * @constructor
 */
function HelpController($scope,uiService,uiCommunicate,helperService)
{

    $scope.showCtrl = false;


    $scope.dontShowAgain = true;

    $scope.init = function(_viewName)
    {

    };

    /**
     * Triggerd on ng-click.
     * Hides the esc-menu
     * @event help
     */
    $scope.close = function()
    {
        $scope.showCtrl = false;
        //alert("Dont show me again?:" +  $scope.dontShowAgain);

    };

}
