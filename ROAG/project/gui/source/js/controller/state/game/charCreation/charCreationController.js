/**
 *
 * @param {$scope} $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @param {UIControllerData} uiControllerData
 * @class CharCreationController
 * @constructor
 */
function CharCreationController($scope, uiService, uiCommunicate, uiCommunicateModel, helperService, logService, uiControllerData) {

    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;
    $scope.forename = "";
    $scope.surname = "";
    $scope.nickname = "";
    $scope.charOrigin = [];

    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    $scope.init = function (_data) {
        ls = logService;
    };

    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /**
     * Called on ng-init on HTML-Template
     * @event initCtrl
     */
    $scope.initCtrl = function () {
        $scope.charOrigin.push(uiControllerData.dropdownData(1, "Alpha location", true));
        $scope.sld_charSize = 50;
        $scope.sld_charAge = 20;
        $scope.sld_charSizeOptions = uiControllerData.sliderData(1, 100, 1, " ");

        $scope.sld_charAgeOptions = uiControllerData.sliderData(1, 100, 1, " ");
    };

    /**
     * Reset the actual input
     * @event reset
     */
    $scope.reset = function reset() {
        $scope.nickname = "";
        $scope.forename = "";
        $scope.surname = "";
    };

    /**
     * Called on ng-click
     * @event createChar
     */
    $scope.createChar = function createChar() {
        $scope.nickname = $scope.nickname.trim();
        $scope.forename = $scope.forename.trim();
        $scope.surname = $scope.surname.trim();
        if ($scope.nickname !== "" && $scope.forename !== "" && $scope.surname !== "") {
            var createCharacterData = uiCommunicate.createData().CHARACTER_CREATE($scope.nickname, $scope.forename, $scope.surname, 1);

            uiCommunicateModel.CHARACTER_CREATE($scope.nickname, $scope.forename, $scope.surname, 1).then(function (_data) {
                var data = _data;

                var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

                switch (data.CODE) {
                    case code.SUCCESSFULLY:
                        ls.logINFO("Character created" + JSON.stringify(createCharacterData));


                        uiCommunicateModel.CHARACTER_GUI_SELECTION().then(
                            function (_data) {
                            }
                        );
                        if (uiCommunicate.isBrowser() === true) {
                            uiService.showUI(uiService.getUiViews().CHAR_SELECTION);

                        }
                        else {
                            uiService.createUI(uiService.getUiViews().CHAR_SELECTION);
                        }
                        uiService.destroyUI(uiService.getUiViews().CHAR_CREATION);
                        break;
                }


            });

        }
    };

    /**
     * Called on ng-click
     * @event cancel
     */
    $scope.cancel = function cancel() {
        uiCommunicateModel.CHARACTER_GUI_SELECTION().then(
            function (_data) {
            }
        );
        uiService.showUI(uiService.getUiViews().CHAR_SELECTION);
        uiService.destroyUI(uiService.getUiViews().CHAR_CREATION);
    };

    /************************************************************** Public - EVENTS - END ******************************************************************/


}

