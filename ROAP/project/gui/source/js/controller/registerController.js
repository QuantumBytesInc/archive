/**
 * @class RegisterController
 * @param $scope
 * @param {UICommunicateModel} uiCommunicateModel
 * @param $state
 * @param $stateParams
 * @param $window
 * @constructor
 */
function RegisterController($scope, $rootScope, uiCommunicateModel, $state, $stateParams, $window, notificationManager) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.pageTitle = "Registration";
    $rootScope.siteTitle = $scope.pageTitle;
    $scope.model = {
        //Old one on top
        // key: '6LfSmB4TAAAAAHo5g7D4sIj7t00cvwTNBMxRiRYY'
        key: "6LcLph8UAAAAACWDOmxIrDBFXlh31ohQBU_dCrJD",
    };
    $scope.myFields = {};
    $scope.myFields.country = "US";
    $scope.myFields.language = "en";
    $scope.formResponse = {
        "title": "Data has been sent successfully.",
        "subtitle": "Check your emails in order to complete your registration."
    };
    $scope.showFormResponse = false;
    $scope.countries;
    $scope.languages;
    $scope.captchaError = false;
    var captchaInitialized = false;
    var captchaId=-1;
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    $scope.init = function () {
        datepicker();
        getDefaultLanguage();
        getLanguages();
        getCountries();

        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'Register');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Register');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Register');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL + "img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'Fill out a few fields and start playing');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'Fill out a few fields and start playing');


        //Render captcha on load
        initializeRecaptcha();

    };

    var initializeRecaptcha = function () {
        //If the register paged is called directly the response from google isn't there actualy, so we need to wait for it.
        var captchaIntv = setInterval(function () {
            if (typeof(grecaptcha) != "undefined") {
                clearInterval(captchaIntv);
                captchaId = grecaptcha.render($("#id_captcha")[0], {sitekey: $scope.model.key, size: 'invisible'});
                captchaInitialized = true;
                setTimeout(function () {
                    //Execute after render.
                    grecaptcha.execute(captchaId);
                }, 500)
            }
        }, 250);

    };

    $scope.setResponse = function (response) {
        $scope.response = response;
    };

    $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
    };

    /************************************************************** Public - FUNCTIONS - START ***********************************************************/

    /************************************************************** Public - FUNCTIONS - END ***********************************************************/

    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
    function datepicker() {
        $("form .date_input").pickadate({
            format: 'yyyy-mm-dd',
            onSet: function () {
                $('.date_input').trigger("blur");
            },
            selectYears: 190,
            selectMonths: true,
        });
    }

    function validateForm() {
        var lang = $scope.defaultLanguage;
        var customLang = {};
        switch (lang) {
            case "en" :
                customLang = {requiredField: 'This is a required field'};
                break;
            case "pl" :
                customLang = {requiredField: 'To pole jest wymagane'};
                break;
            case "fr" :
                customLang = {requiredField: 'Ce champ est obligatoire'};
                break;
            case "it" :
                customLang = {requiredField: 'Campo obbligatorio'};
                break;
            case "de" :
                customLang = {requiredField: 'Dies ist ein Pflichtfeld'};
                break;
            default   :
                customLang = {requiredField: 'This is a required field'};
                break;
        }
        $.validate({
            "form": '#roa_register_form',
            "lang": lang,
            "language": customLang,
            onSuccess: function ($form) {
                if (captchaInitialized == true) {
                    var captchaSuccess = grecaptcha.getResponse(captchaId) == "" ? false : true;

                    if (captchaSuccess) {
                        submitForm();
                    }
                    else {
                        showServerNotification("Captcha is invalid, please try again", "error");
                        setTimeout(function () {
                            //Execute it again.
                            grecaptcha.reset(captchaId);
                            grecaptcha.execute(captchaId)
                        }, 500);

                    }
                } else {
                    showServerNotification("Captcha is not ready yet, try again in some seconds", "error");
                }

                return false; // Will stop the submission of the form


            }
        });

    }


    /*
     Gets the default language
     @method getDefaultLanguage
     */
    function getDefaultLanguage() {
        uiCommunicateModel.PORTAL_GET_LANGUAGE().then(function (_data) {
            $scope.defaultLanguage = _data.DATA.LANGUAGE;
            validateForm();
            //console.log("Default Language: ", _data)
        }, function (_err) {
            //console.log("Default language error: ", _err);
        });
    }

    /* gets languages from server */
    function getLanguages() {
        uiCommunicateModel.CUSTOMER_LANGUAGES().then(function (_data) {
            $scope.languages = _data.DATA;
        });
    }

    /* gets countries from server */
    function getCountries() {
        uiCommunicateModel.CUSTOMER_COUNTRIES().then(function (_data) {
            $scope.countries = _data.DATA;
        });
    }

    /**
     * Get the key for the object by the passed value
     * @property getKeyByValue
     * @param {element} _obj - The object
     * @param {object} _value - The value to check
     * @type {string/undefined}
     * @returns {string/undefined} - The key else undefined
     */
    function getKeyByValue(_obj, _value) {
        for (var prop in _obj) {
            if (_obj.hasOwnProperty(prop)) {
                if (_obj[prop] === _value)
                    return prop;
                // return prop;
            }
        }
        return undefined;
    };

    function showServerError(input_id, msg) {
        $("input#" + input_id).parents(".block").addClass("has-error");
        $("input#" + input_id).parents(".block").append("<span class='help-block form-error'>" + msg + "</span>");
        $("html, body").animate({scrollTop: 0}, 200);
    }


    function showServerNotification(msg, type) {
        notificationManager.showNotification(msg, type, 2500);
    }


    function submitForm() {
        var f = $scope.myFields;
        var captchaResponse = grecaptcha.getResponse(captchaId);

        //console.log("submit form: ", f);
        uiCommunicateModel.CUSTOMER_REGISTER(
            f.country,
            f.city,
            f.state,
            f.street,
            f.zip,
            f.birthdate,
            f.sex,
            f.language,
            f.username,
            f.firstname,
            f.lastname,
            f.email,
            f.prerequisites,
            captchaResponse
        ).then(function (_data) {
            //console.log("Register server response: ", _data);
            var obj = codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["REGISTER"]];
            var val = _data.CODE;
            var key = getKeyByValue(obj, val);
            //console.log(key);
            //Reset captcha every time, doesn't matter which error occures
            if (key != "SUCCESSFULLY") {
                //Just do it when not successfully, else page redirect and the captcha would popup again.
                setTimeout(function () {
                    //Execute it again.
                    grecaptcha.reset(captchaId);
                    grecaptcha.execute(captchaId)
                }, 500);
            }

            switch (key) {
                case "SUCCESSFULLY"                   :
                    showServerNotification("Form sent successfully.", "success");
                    $scope.showFormResponse = true;
                    break;
                case "FAILED_COUNTRY_NOT_FOUND"       :
                    showServerError("country", "Country not found.");
                    break;
                case "FAILED_CITY_TO_LONG"            :
                    showServerError("city", "City not found.");
                    break;
                case "FAILED_CITY_EMPTY"              :
                    showServerError("country", "City is empty.");
                    break;
                case "FAILED_CITY_INVALID"            :
                    showServerError("country", "City is invalid.");
                    break;
                case "FAILED_STATE_TO_LONG"           :
                    showServerError("state", "State is too long.");
                    break;
                case "FAILED_STATE_EMPTY"             :
                    showServerError("state", "State is empty.");
                    break;
                case "FAILED_STATE_INVALID"           :
                    showServerError("state", "State is invalid.");
                    break;
                case "FAILED_STREET_TO_LONG"          :
                    showServerError("street", "Street too long.");
                    break;
                case "FAILED_STREET_EMPTY"            :
                    showServerError("street", "Street is empty.");
                    break;
                case "FAILED_STREET_INVALID"          :
                    showServerError("street", "Street is invalid");
                    break;
                case "FAILED_ZIPCODE_TO_LONG"         :
                    showServerError("zip", "Zip is too long.");
                    break;
                case "FAILED_ZIPCODE_EMPTY"           :
                    showServerError("zip", "Zip is empty.");
                    break;
                case "FAILED_ZIPCODE_INVALID"         :
                    showServerError("zip", "Zip is invalid.");
                    break;
                case "FAILED_BIRTH_DATE_INVALID"      :
                    showServerError("birthdate", "Birthdate is invalid");
                    break;
                case "FAILED_SEX_INVALID"             :
                    showServerError("sex", "Sex is invalid.");
                    break;
                case "FAILED_LANGUAGE_NOT_FOUND"      :
                    showServerError("language", "Language not found.");
                    break;
                case "FAILED_PREREQUISITES_INVALID"   :
                    showServerError("prerequisites", "Prerequisites are invalid.");
                    break;
                case "FAILED_USERNAME_TO_LONG"        :
                    showServerError("username", "Username too long.");
                    break;
                case "FAILED_USERNAME_EMPTY"          :
                    showServerError("username", "Username is empty.");
                    break;
                case "FAILED_USERNAME_INVALID"        :
                    showServerError("username", "Username is invalid.");
                    break;
                case "FAILED_USERNAME_TAKEN"          :
                    showServerError("username", "Username is taken.");
                    break;
                case "FAILED_FIRST_NAME_TO_LONG"      :
                    showServerError("firstname", "Firstname is too long.");
                    break;
                case "FAILED_FIRST_NAME_EMPTY"        :
                    showServerError("firstname", "Firstname is empty.");
                    break;
                case "FAILED_FIRST_NAME_INVALID"      :
                    showServerError("firstname", "Firsname is invalid.");
                    break;
                case "FAILED_LAST_NAME_TO_LONG"       :
                    showServerError("lastname", "Lastname is too long.");
                    break;
                case "FAILED_LAST_NAME_EMPTY"         :
                    showServerError("lastname", "Lastname is empty.");
                    break;
                case "FAILED_LAST_NAME_INVALID"       :
                    showServerError("lastname", "Lastname invalid.");
                    break;
                case "FAILED_EMAIL_INVALID"           :
                    showServerError("email", "Email invalid.");
                    break;
                case "FAILED_EMAIL_TAKEN"             :
                    showServerError("email", "Email is taken.");
                    break;
                case "FAILED_CAPTCHA_INVALID"             :
                    showServerNotification("Captcha is invalid, please try again", "error");
                    break;
                case "FAILED_MISSING_VALUES"          :
                    showServerNotification("Missing values.", "error");
                    break;
                case "FAILED_BRUTE_FORCE_ATTEMPT"     :
                    showServerNotification("Brute force attempt.", "error");
                    break;
                case "FAILED_SERVER_DOWN"             :
                    showServerNotification("Server down.", "error");
                    break;
                case "FAILED_MAINTENANCE"             :
                    showServerNotification("Server Maintenance.", "error");
                    break;
                case "FAILED_MISC"                    :
                    showServerNotification("Misc error occured.", "error");
                    break;
            }

        }, function (_err) {
            //console.log("register server error: ", _err);
        });

    }

    /************************************************************** Private - FUNCTIONS - END ***********************************************************/

}
