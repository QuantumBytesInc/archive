/**
 *
 * @param {$scope} $scope
 * @param {LogService} logService
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {HelperService} helperService
 * @param {UIControllerData} uiControllerData
 * @param {$translate} $translate
 * @class SettingsController
 * @constructor
 */
function SettingsController($scope, logService, uiService, uiCommunicate, uiCommunicateModel, helperService, uiControllerData, $translate, $q) {
    /************************************************************** Private - Variables - START *****************************************************/

    /**
     * @private
     * @type {LogService}
     */
    var ls;
    /**
     * @private
     * @type {uiService}
     */
    var uiS;
    /**
     * Inherits the changing profiles.
     */
    var profiles;


    /**
     * Inherits all global values which aren't changed by a profile
     */
    var globals;

    /**
     * Inherits all values which can be changed by a profile
     */
    var settings;

    /**
     * Inherits all set able controls (walking, torch lighting etc)
     */
    var controls;

    /**
     * Inherits all registered directive keys to be handled.
     * @private
     * @type {{}}
     */
    var registeredKeys = {};
    /************************************************************** Public - VARIABLES - END **************************************************************/
    /************************************************************** Public - VARIABLES - START ************************************************************/

    /**
     * Inherits the selected value and name for the different profiles.
     * @type {object}
     */
    $scope.profiles = {};
    $scope.profiles.name = "profilesRadio";
    $scope.profiles.selectedValue = "";

    $scope.showCtrl = false;
    $scope.showCustomResolution = false;

    $scope.mouseOptions = {
        from: 0.5,
        to: 2.5,
        round: 1,
        scale: 0.1,
        step: 0.1,
        dimension: " "
    };

    /**
     * Options for view distance, volume etc.
     * @type {{from: number, to: number, step: number, dimension: string}}
     */
    $scope.options = {
        from: 1,
        to: 100,
        step: 1,
        dimension: " %"
    };
    $scope.volumeOptions = {
        from: 0,
        to: 100,
        step: 1,
        dimension: " %"
    };
    $scope.gammaOptions = {
        from: 0.5,
        to: 3.5,
        round: 1,
        scale: 0.5,
        step: 0.5,
        dimension: " "
    };
    $scope.viewDistanceOptions =
        {
            from: 50,
            to: 200,
            step: 1,
            dimension: " "
        };

    /**
     * Disable all checkboxes ifalt profile is not "custom"
     * @type {boolean}
     */
    $scope.profilesDisabled = false;


    /************************************************************** Public - Variables - END **************************************************************/


    /************************************************************** Private - Functions - START *****************************************************/

    /**
     * Called on INIT, after webServer send the actual settings data.
     * Run through each objects, set the $scope data and map needed values.
     * @method
     * @param {object} _data
     */
    var setSettings = function setSettings(_data) {

        var data = _data;
        profiles = data["PROFILES"];
        settings = data["SETTINGS"];
        globals = data["GLOBALS"];
        controls = data["CONTROLS"];
        console.log(data);
        if (profiles && settings && globals && controls) {
            $scope["globals"] = {};
            for (var _key in globals) {
                $scope["globals"][_key] = globals[_key];

            }

            for (var _key in settings) {
                $scope[_key] = settings[_key];
            }

            for (var i = 0; i < $scope.profile.length; i++) {
                //hardmap.
                $scope.profile[i].label = $scope.profile[i].value;
                if ($scope.profile[i].key === $scope["globals"]["profile"]) {
                    $scope.profile[i].selected = true;

                }
                else {
                    $scope.profile[i].selected = false;

                }
            }

            $scope.controls = controls;


            for (var i = 0; i < $scope.resolution.length; i++) {
                $scope.resolution[i].selected = false;
                if ($scope.resolution[i].key === $scope["globals"]["resolution"]) {
                    $scope.resolution[i].selected = true;
                    $scope.resolutionChange($scope.resolution[i].key, $scope.resolution[i].value);
                }
            }
            for (var i = 0; i < $scope.sfx.length; i++) {
                $scope.sfx[i].selected = false;
                if ($scope.sfx[i].key === $scope["globals"]["sfx"]) {
                    $scope.sfx[i].selected = true;
                }
            }

            for (var i = 0; i < $scope.languages.length; i++) {
                $scope.languages[i].selected = false;
                if ($scope.languages[i].key === $scope["globals"]["language"]) {
                    $scope.languages[i].selected = true;
                }
            }

            if ($scope.globals["mouse_sensitivity"] !== null && $scope.globals["mouse_sensitivity"] !== undefined) {
                $scope.globals["mouse_sensitivity"] = $scope.globals["mouse_sensitivity"] / 10;
            }

            //Premap the settings
            $scope.reflection.checked = false;
            $scope.parallax.checked = false;
            $scope.motion_blur.checked = false;
            $scope.refraction.checked = false;
            $scope.volumetric_shadows.checked = false;
            $scope.texture_filtering.checked = false;


            for (var i = 0; i < $scope.anisotropy.length; i++) {
                $scope.anisotropy[i].selected = false;
            }
            for (var i = 0; i < $scope.multisample.length; i++) {
                $scope.multisample[i].selected = false;
            }
            for (var i = 0; i < $scope.occlusion.length; i++) {
                $scope.occlusion[i].selected = false;
            }
            for (var i = 0; i < $scope.shader.length; i++) {
                $scope.shader[i].selected = false;
            }
            for (var i = 0; i < $scope.texture.length; i++) {
                $scope.texture[i].selected = false;
            }

            //Todo set language here.


            for (var i = 0; i < profiles.length; i++) {
                //Find the actual selected profile.
                if (profiles[i].profile_id === $scope["globals"].profile) {
                    //Update the model, after loading, the directive change the model itself
                    $scope.profiles.selectedValue = profiles[i].profile_name;
                    $scope.profilesChange(profiles[i].profile_name);
                    break;
                }
            }

        }
        else {
            ls.logERR("No settings passed for user.");
        }
    };


    var initSettings = function () {
        uiCommunicateModel.ACCOUNT_SETTINGS_GET().then(
            function (_webData) {
                var data = _webData;
                var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
                switch (data.CODE) {
                    case code.SUCCESSFULLY:
                        //SUCCESS
                        if (_webData && _webData.DATA) {
                            setSettings(_webData.DATA);
                        }
                        break;
                }


            },
            function (_webData) {
                //ERROR
            });
    }
    /************************************************************** Private - Functions - End *******************************************************/


    /************************************************************** Public - Functions - START ******************************************************/


    $scope.init = function (_data) {
        ls = logService;
        uiS = uiService;
        initSettings();

    };


    /**
     * Called on profile change event.
     * @property profilesChange
     * @param {string} _profileName - The actual choosen profile value
     */
    $scope.profilesChange = function (_value) {


        var profileName = _value.toLowerCase();
        if (profileName !== "custom") {
            $scope.profilesDisabled = false;
        }
        else {
            $scope.profilesDisabled = false;
        }

        for (var i = 0; i < profiles.length; i++) {
            //Find right setting
            if (profiles[i].profile_name.toLowerCase() === profileName) {
                var changedProfile = profiles[i];
                for (var _key in changedProfile) {

                    switch (_key) {
                        case "motion_blur":
                        case "parallax":
                        case "reflection":
                        case "refraction":
                        case "texture_filtering":
                        case "volumetric_shadows":

                            $scope[_key].checked = changedProfile[_key];
                            break;
                        case "anisotropy":
                        case "multisample":
                        case "occlusion":
                        case "shader":
                        case "texture":

                            for (var x = 0; x < $scope[_key].length; x++) {
                                if ($scope[_key][x].key === changedProfile[_key]) {
                                    $scope[_key][x]["selected"] = true;
                                }
                                else {
                                    $scope[_key][x]["selected"] = false;
                                }
                            }
                            break;
                        default:

                            // $scope[_key] = changedProfile[_key];
                            break;
                    }


                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                //Exit
                break;
            }
        }


    };


    /**
     * Called on registerKey init event.
     * @event registerKeyInit
     * @param {string} _name
     * @param {obj} _instance
     */
    $scope.registerKeyInit = function (_name, _instance) {
        registeredKeys[_name] = _instance;
    };

    /**
     * Called on key click
     * @event keyClick
     * @param _name
     * @param _value
     */
    $scope.keyClick = function (_name, _value) {
        for (key in registeredKeys) {
            if (key !== _name) {
                registeredKeys[key].revert();
            }
        }
    };

    /**
     * Called on keyChange event
     * @event keyChange
     * @param {string} _name - The initisalised name (referenced in registeredKeys)
     * @param {string} _value
     * @returns {boolean} - can the key be changed?
     */
    $scope.keyChange = function (_name, _value) {

        for (key in registeredKeys) {
            if (key !== _name) {
                if (registeredKeys[key].getKey() === _value) {
                    registeredKeys[key].setKey(0);
                    break;
                }
            }
        }


        return true;
    };
    /**
     * Called if dropdown or checkbox is changed from the profiles.
     * @event checkProfile
     */
    $scope.checkProfile = function () {
        if ($scope.profiles.selectedValue.toLowerCase() !== "custom") {
            $scope.profiles.selectedValue = "Custom";
        }

    };

    /**
     * Called onClick - resets the settings to default.
     * @event default
     */
    $scope.default = function () {
        for (var i = 0; i < profiles.length; i++) {
            //Find the actual selected profile.
            if (profiles[i].profile_name.toLowerCase() === "normal") {
                //Update the model, after loading, the directive change the model itself
                $scope.profiles.selectedValue = profiles[i].profile_name;
                $scope.profilesChange(profiles[i].profile_name);
                break;
            }
        }
    };
    /**
     * Called on resolution change event
     * @event resolutionChange
     * @param {string} _key
     * @returns {boolean} - can the key be changed?
     */
    $scope.resolutionChange = function (_key, _value) {
        if (_key === -1) {
            $scope.showCustomResolution = true;
        }
        else {
            $scope.showCustomResolution = false;
        }

    };


    /************************************************************** Public - Functions - End **************************************************************/
    /************************************************************** Public - EVENTS - START ***************************************************************/
    $scope.$on('ctrlShow', function () {
        initSettings();
    });

    /**
     * Called on ng-click - save all data.
     * If we got custom data build them together
     * @event save
     */
    $scope.save = function save() {


        //Change language.

        for (var i = 0; i < $scope.languages.length; i++) {
            var language = $scope.languages[i];
            if (language.selected === true) {
                $scope["globals"]["language"] = language.key;
                if (language.value === "German") {
                    $translate.use("de");
                }
                else if (language.value === "English") {
                    $translate.use("en");
                }
                else if (language.value === "French") {
                    $translate.use("fr");
                }
                else if (language.value === "Greek") {
                    $translate.use("el");
                }
                else if (language.value === "Italian") {
                    $translate.use("it");
                }
                else if (language.value === "Polnish") {
                    $translate.use("pl");
                }
                else if (language.value === "Spanish") {
                    $translate.use("es");
                }
                else if (language.value === "Portuguese") {
                    $translate.use("br");
                }
            }
        }
        var controlsASCII = [];
        var controlsCHAR = [];
        var saveData =
            {
                "GLOBALS": {},
                "CONTROLS": [],
                "PROFILES": []

            };
        //Save key bindings
        for (var i = 0; i < $scope.controls.length; i++) {


            var bindingASCII = {"value": "", "key": 0};
            bindingASCII.value = $scope.controls[i].value;
            bindingASCII.key = $scope.controls[i].key;
            bindingASCII.name = $scope.controls[i].name;


            controlsASCII.push(bindingASCII);
        }

        //Save global variables


        for (var i = 0; i < $scope.resolution.length; i++) {

            if ($scope.resolution[i].selected === true) {
                $scope["globals"]["resolution"] = $scope.resolution[i].key;
                if ($scope.resolution[i].key !== -1) {
                    $scope.globals.width = 0;
                    $scope.globals.height = 0;
                }
            }
        }
        for (var i = 0; i < $scope.sfx.length; i++) {
            if ($scope.sfx[i].selected === true) {
                $scope["globals"]["sfx"] = $scope.sfx[i].key;
            }
        }

        saveData.GLOBALS = $scope["globals"];
        saveData.GLOBALS.volume_master = parseInt(saveData.GLOBALS.volume_master);
        saveData.GLOBALS.view_distance = parseInt(saveData.GLOBALS.view_distance);
        saveData.GLOBALS.gamma = parseFloat(saveData.GLOBALS.gamma);

        //Framework is a bit broken, sometimes we'll get a 0 e.g.
        if (saveData.GLOBALS.gamma < 0.5){
            saveData.GLOBALS.gamma = 0.5;
        }
        if (saveData.GLOBALS.gamma >3.5){
            saveData.GLOBALS.gamma =3.5;
        }
        saveData.GLOBALS.width = parseInt(saveData.GLOBALS.width);
        saveData.GLOBALS.height = parseInt(saveData.GLOBALS.height);
        saveData.GLOBALS.mouse_sensitivity = parseFloat(saveData.GLOBALS.mouse_sensitivity) * 10;

        //Check if we selected custom data, if yes build all data together.
        saveData.PROFILES = profiles;
        for (var i = 0; i < $scope.profile.length; i++) {
            if ($scope.profiles.selectedValue.toLowerCase() === "custom" && $scope.profile[i].value.toLowerCase() === "custom") {
                saveData.GLOBALS["profile"] = $scope.profile[i].key;


                saveData.CUSTOM = {};
                saveData.CUSTOM["motion_blur"] = $scope["motion_blur"].checked;
                saveData.CUSTOM["parallax"] = $scope["parallax"].checked;
                saveData.CUSTOM["reflection"] = $scope["reflection"].checked;
                saveData.CUSTOM["refraction"] = $scope["refraction"].checked;
                saveData.CUSTOM["texture_filtering"] = $scope["texture_filtering"].checked;
                saveData.CUSTOM["volumetric_shadows"] = $scope["volumetric_shadows"].checked;


                for (var i = 0; i < $scope.anisotropy.length; i++) {
                    if ($scope.anisotropy[i].selected === true) {
                        saveData.CUSTOM["anisotropy"] = $scope.anisotropy[i].key;
                    }
                }

                for (var i = 0; i < $scope.multisample.length; i++) {
                    if ($scope.multisample[i].selected === true) {
                        saveData.CUSTOM["multisample"] = $scope.multisample[i].key;
                    }
                }

                for (var i = 0; i < $scope.occlusion.length; i++) {
                    if ($scope.occlusion[i].selected === true) {
                        saveData.CUSTOM["occlusion"] = $scope.occlusion[i].key;
                    }
                }

                for (var i = 0; i < $scope.shader.length; i++) {
                    if ($scope.shader[i].selected === true) {
                        saveData.CUSTOM["shader"] = $scope.shader[i].key;
                    }
                }

                for (var i = 0; i < $scope.texture.length; i++) {
                    if ($scope.texture[i].selected === true) {
                        saveData.CUSTOM["texture"] = $scope.texture[i].key;
                    }
                }
                break;
            }
            else if ($scope.profile[i].value.toLowerCase() === $scope.profiles.selectedValue.toLowerCase()) {
                saveData.GLOBALS["profile"] = $scope.profile[i].key;
                break;
            }

        }


        //save to django
        saveData.CONTROLS = controlsASCII;
        uiCommunicateModel.ACCOUNT_SETTINGS_SET(false, saveData).then(function (_data) {
                var data = _data;
                var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
                switch (data.CODE) {
                    case code.SUCCESSFULLY:

                        /// \todo DIRTY-HACK!!!
                        var state = {STATE: 0};
                        var states = [];

                        if (uiService.isUIHidden(uiService.getUiViews().CHAR_CREATION) === false) {
                            states.push({VIEW: uiService.getUiViews().CHAR_CREATION, ACTION: "show"});
                            state = {STATE: 3};
                        }
                        else if (uiService.isUIHidden(uiService.getUiViews().CHAR_SELECTION) === false) {
                            states.push({VIEW: uiService.getUiViews().CHAR_SELECTION, ACTION: "show"});
                            state = {STATE: 1};
                        }
                        else {


                            states.push({VIEW: uiService.getUiViews().TOPBAR, ACTION: "show"});
                            states.push({VIEW: uiService.getUiViews().CHAT, ACTION: "show"});
                            states.push({VIEW: uiService.getUiViews().TASKBAR, ACTION: "show"});
                            state = {STATE: 2};
                        }
                        states.push({VIEW: uiService.getUiViews().SETTINGS_MENU, ACTION: "show"});
                        //Wait for everything to deattach.
                        uiCommunicate.$onSynchBroadcast("", uiCommunicate.getSyncBroadcastTypes().RELOAD, function () {
                            var deferred = $q.defer();
                            uiCommunicateModel.UNIGINE_SET_STATE("LANGUAGE", $translate.use())
                                .then(function (_data) {
                                        deferred.resolve();
                                    },
                                    function (_data) {
                                        deferred.resolve();
                                    });
                            return deferred.promise;
                        });
                        uiCommunicate.$onSynchBroadcast("", uiCommunicate.getSyncBroadcastTypes().RELOAD, function () {
                            var deferred = $q.defer();
                            //Base64 encoding needed else client cant save data rightly =/
                            uiCommunicateModel.UNIGINE_SET_STATE("STATE", Base64.encode(JSON.stringify(states)))
                                .then(function (_data) {
                                        deferred.resolve();
                                    },
                                    function (_data) {
                                        deferred.resolve();
                                    });
                            return deferred.promise;
                        });
                        uiCommunicate.syncBroadcast(uiCommunicate.getSyncBroadcastTypes().RELOAD).then(function () {
                            uiCommunicateModel.AUTHENTICATION_TOKEN_REFRESH().then(function (_data) {
                                    var token = _data.DATA.TOKEN;
                                    //TOKEN REFRESH.
                                    uiCommunicateModel.UNIGINE_SET_TOKEN(token).then(
                                        function (_data) {
                                            ls.logINFO("Refreshed token for settings save: " + token);
                                            uiCommunicateModel.UNIGINE_SET_GUI_STATE(state).then(
                                                function (_data) {

                                                });

                                            uiCommunicateModel.ACCOUNT_SETTINGS_SET(true, saveData).then(function (_data) {
                                                    //SUCCESS
                                                },
                                                function (_data) {
                                                    //ERROR
                                                });


                                        });
                                },
                                function (_data) {

                                });
                        });

                        break;
                }
            },
            function (_data) {
            });


        $scope.close();

    };

    $scope.apply = function apply() {

    };

    $scope.close = function close() {
        $scope.showCtrl = false;
    };


    /************************************************************** Public - EVENTS - END *****************************************************************/

}
