/**
 * Choose your character or create a new one.
 * @param $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicate
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @param {UIUser} uiUser
 * @param CharSelectionController
 * @constructor
 */
function CharSelectionController($scope, uiService, uiCommunicate, uiCommunicateModel, helperService, logService,uiUser) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/


    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = true;
    $scope.characters = [];
    $scope.selectedCharacterId = 0;

    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/

    /**
     * Call server, receive characterlist and set up the list.
     * @method
     */
    var getCharacterList = function getCharacterList() {
        uiCommunicateModel.CHARACTER_LIST().then(
            function (_data) {
                //Reset the charId
                $scope.selectedCharacterId = 0;
                //SUCCESS
                var data = _data;
                if (data.ERROR === -1) {
                    Error
                    //NO error
                    ls.logTRC("CharacterList - got");
                    if (data.DATA && data.DATA.CHARACTERS) {
                        $scope.characters = data.DATA.CHARACTERS;
                        sendSlotIds();
                    }
                }
                else {
                    //Error.
                    ls.logERR("No character list returned of server");
                }

            },
            function (_data) {
                //ERROR
            });

    };


    /**
     * Return the slotId for the actual selected char id
     * @method
     * @private
     * @param {number} _charId
     * @returns {number} The slot id, if not found -1
     */
    var getSlotId = function getSlotId(_charId) {
        for (var i = 0; i < $scope.characters.length; i++) {
            if (_charId === $scope.characters[i].character) {
                return $scope.characters[i].slot;
            }
        }
        return -1;
    };

    /**
     * Send the actual character-slotId's to engine.
     * @method
     */
    var sendSlotIds = function sendSlotIds() {

        var slotData = uiCommunicate.createData().CHARACTER_SLOT_STATE();
        for (var i = 0; i < $scope.characters.length; i++) {
            slotData["SLOT_" + $scope.characters[i].slot] = 1;
        }

        uiCommunicateModel.CHARACTER_SLOT_STATE(slotData).then(
            function (_data) {
            }
        );


    };
    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/

    /**
     * Called on init
     * @event init
     * @param {object} _data
     */
    $scope.init = function init(_data) {

        // temp();
        ls = logService;
        getCharacterList();


    };


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /**
     * Called if the window is called up again (if it was not destroyed);
     * Get the characterList again / refresh
     * @event ctrlShow
     */
    $scope.$on("ctrlShow", function () {
        getCharacterList();
    });
    /**+
     * Brings up the other window
     * Called on click
     * @event createChar
     */
    $scope.createChar = function () {
        if (uiCommunicate.isBrowser() === true) {
            uiService.showUI(uiService.getUiViews().CHAR_CREATION);
        }
        else {
            uiService.createUI(uiService.getUiViews().CHAR_CREATION);
        }
        uiService.hideUI(uiService.getUiViews().CHAR_SELECTION);
        uiCommunicateModel.CHARACTER_GUI_CREATE();


    };

    /**
     * Fires the event to our engine
     * Called on click
     * @event spawnChar
     */
    $scope.spawnChar = function () {

        if ($scope.selectedCharacterId !== 0) {

            uiCommunicateModel.AUTHENTICATION_TOKEN_REFRESH().then(function (_data) {

                    //TOKEN REFRESH.

                    if (uiCommunicate.isBrowser() === true) {


                        uiCommunicateModel.CHARACTER_SPAWN(false, $scope.selectedCharacterId, uiUser.getToken()).then(
                            function (_data) {
                                uiCommunicateModel.SPAWN_RESOURCES_INIT(false, {}).then(function (_data) {
                                    var data = _data;
                                    uiCommunicateModel.SPAWN_RESOURCES_INIT(true, data);
                                });

                                var data = _data;
                                //console.log(data.DATA.TOKEN);
                                var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

                                switch (data.CODE) {
                                    case code.SUCCESSFULLY:
                                        ls.logINFO("Character spawned DEV: " + $scope.selectedCharacterId);

                                        uiService.destroyUI(uiService.getUiViews().CHAR_SELECTION);
                                        uiService.createUI(uiService.getUiViews().OVERLAY).then(function () {
                                        });
                                        // uiService.destroyUI(uiService.getUiViews().SETTINGS_MENU);
                                        uiService.showUI(uiService.getUiViews().TOPBAR);
                                        uiService.showUI(uiService.getUiViews().CHAT);
                                        uiService.showUI(uiService.getUiViews().TASKBAR);
                                        break;
                                }


                            });

                    }
                    else {
                        uiService.createUI(uiService.getUiViews().OVERLAY).then(function () {
                            uiCommunicateModel.CHARACTER_SPAWN(true, $scope.selectedCharacterId, uiUser.getToken()).then(
                                function (_data) {
                                    ls.logINFO("Character spawned: " + $scope.selectedCharacterId);
                                    uiService.destroyUI(uiService.getUiViews().CHAR_SELECTION);

                                    //uiService.destroyUI(uiService.getUiViews().SETTINGS_MENU);
                                    uiService.showUI(uiService.getUiViews().TOPBAR);
                                    //Rest of the UI'S will be shown if the engine is ready.
                                });
                        });

                    }


                },
                function (_data) {
                    ls.logINFO("Character couldn't be deleted: " + $scope.selectedCharacterId);
                });


        }
    };

    /**
     * Triggered on character click event
     * @event characterSelected
     */
    $scope.characterSelected = function characterSelected() {
        uiCommunicateModel.CHARACTER_SELECT($scope.selectedCharacterId, getSlotId($scope.selectedCharacterId)).then(function (_data) {
                ls.logINFO("Character spawned: " + $scope.selectedCharacterId);
            },
            function (_error) {
                $scope.selectedCharacterId = 0;
            });
    };
    /**
     * Delete event of selected character
     * Called on click
     * @event deleteChar
     */
    $scope.deleteChar = function deleteChar() {
        if ($scope.selectedCharacterId !== 0) {
            uiCommunicateModel.CHARACTER_DELETE(false, $scope.selectedCharacterId).then(function (_data) {
                    var data = _data;
                    //console.log(data.DATA.TOKEN);
                    var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

                    switch (data.CODE) {
                        case code.SUCCESSFULLY:
                            ls.logINFO("Character deleted: " + $scope.selectedCharacterId);
                            uiCommunicateModel.CHARACTER_DELETE(true, $scope.selectedCharacterId).then(function (_data) {
                                },
                                function (_data) {
                                });
                            $scope.selectedCharacterId = 0;
                            break;
                    }

                    getCharacterList();


                },
                function (_data) {
                    ls.logINFO("Character couldn't be deleted: " + $scope.selectedCharacterId);
                });

        }
    };

    /**
     * Trigger on ng-click.
     * Quits the game.
     * @event quit
     */
    $scope.quit = function () {

        uiCommunicateModel.AUTHENTICATION_LOGOUT().then(
            function (_webData) {

                uiCommunicateModel.UNIGINE_CLOSE().then(
                    function (_engineData) {

                    });

            });


    };

    /************************************************************** Public - EVENTS - END ******************************************************************/


}

