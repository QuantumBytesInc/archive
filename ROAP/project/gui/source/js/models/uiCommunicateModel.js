/**
 *
 * @param {UICommunicate} uiCommunicate
 * @param {$q} $q
 * @class UICommunicateModel
 * @constructor
 */
function UICommunicateModel(uiCommunicate, $q) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    /**
     * Own instance
     * @type {LoginModel}
     */
    var me = null;

    /************************************************************** Private - VARIABLES - END *************************************************************/

    /************************************************************** Public - VARIABLES - START ************************************************************/


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/

    var init = function init() {


    };

    var getGlobalCodeMap = function getGlobalCodeMap() {
        return uiCommunicate.getCodeMap(0, 0);
    };


    /**
     *
     * @param _data
     * @returns {number} -2 Global Error, -1 normal global error, 0 no global error
     */
    var checkErrors = function checkErrors(_data) {
        var data = _data;

        if (data && data.ERROR !== -1) {

            var code = getGlobalCodeMap();
            switch (data.ERROR) {
                case code.ERROR_NOT_AUTHENTICATED:
                case code.ERROR_MISC_ERROR:
                    //QUIT CLIENT

                    return -2;
                    break;
                case code.ERROR_SERVER_OFFLINE:

                    return -2;
                    break;

                default:
                    //Show error
                    return -1;
                    break;
            }

        }

        return 0;

    };


    var check_PORTAL_NAVIGATION = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_PORTAL_NEWS = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_PORTAL_FAQS = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_PORTAL_LANGUAGES = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_PORTAL_SET_LANGUAGE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_PORTAL_GET_LANGUAGE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_PORTAL_NEWS_ENTRY = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };


    var check_FEATURES_OVERVIEW = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };
    var check_FEATURES_FEATURE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_CONTACT_SEND_MAIL = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_CUSTOMER_REGISTER = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_CUSTOMER_LANGUAGES = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_CUSTOMER_COUNTRIES = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };
    var check_CUSTOMER_MODIFY = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_CUSTOMER_DATA = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };


    var check_CUSTOMER_ACTIVATE = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };

    var check_CUSTOMER_RECOVER_INIT = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };


    var check_CUSTOMER_RECOVER = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };
    var check_CUSTOMER_AUTHENTICATED = function (_data) {
        var data = _data;
        if (data && data.hasOwnProperty("CALLER") && data.hasOwnProperty("ACTION")) {


            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.FAILED_MISC:

                    break;
                default:
                    break;
            }
        }
    };


    /************************************************************* Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/


    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    this.PORTAL_NAVIGATION = function () {
        var navigationData = uiCommunicate.createData().PORTAL_NAVIGATION();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).NAVIGATION, navigationData).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_NAVIGATION(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    this.PORTAL_NEWS = function () {
        var newsData = uiCommunicate.createData().PORTAL_NEWS();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).NEWS, newsData).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_NEWS(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.PORTAL_FAQS = function () {
        var newsData = uiCommunicate.createData().PORTAL_FAQS();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).FAQS, newsData).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_FAQS(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.PORTAL_LANGUAGES = function () {
        var langData = uiCommunicate.createData().PORTAL_LANGUAGES();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).LANGUAGES, langData).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_LANGUAGES(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.PORTAL_SET_LANGUAGE = function (_language) {
        var langData = uiCommunicate.createData().PORTAL_SET_LANGUAGE(_language);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).SET_LANGUAGE, langData).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_SET_LANGUAGE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    this.PORTAL_GET_LANGUAGE = function () {
        var langData = uiCommunicate.createData().PORTAL_GET_LANGUAGE();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).GET_LANGUAGE, langData).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_GET_LANGUAGE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.PORTAL_NEWS_ENTRY = function (_id) {
        var newsEntry = uiCommunicate.createData().PORTAL_NEWS_ENTRY(_id);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().PORTAL, uiCommunicate.getActions(uiCommunicate.getCaller().PORTAL).NEWS_ENTRY, newsEntry).then(function (_data) {
                checkErrors(_data);
                check_PORTAL_NEWS_ENTRY(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.FEATURES_OVERVIEW = function () {
        var overviewData = uiCommunicate.createData().FEATURES_OVERVIEW();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().FEATURES, uiCommunicate.getActions(uiCommunicate.getCaller().FEATURES).OVERVIEW, overviewData).then(function (_data) {
                checkErrors(_data);
                check_FEATURES_OVERVIEW(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.FEATURES_FEATURE = function (_featureId, _part) {
        var featureData = uiCommunicate.createData().FEATURES_FEATURE(_featureId, _part);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().FEATURES, uiCommunicate.getActions(uiCommunicate.getCaller().FEATURES).FEATURE, featureData).then(function (_data) {
                checkErrors(_data);
                check_FEATURES_FEATURE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.CONTACT_SEND_MAIL = function (_name, _subject, _message, _email) {
        var mailData = uiCommunicate.createData().CONTACT_SEND_MAIL(_name, _subject, _message, _email);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CONTACT, uiCommunicate.getActions(uiCommunicate.getCaller().CONTACT).SEND_MAIL, mailData).then(function (_data) {
                checkErrors(_data);
                check_CONTACT_SEND_MAIL(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.CUSTOMER_REGISTER = function (_country, _city, _state, _street, _zipcode, _birthdate, _sex, _language, _username, _firstname, _lastname, _email, _prerequisites, _spamDetection) {
        var registerData = uiCommunicate.createData().CUSTOMER_REGISTER(_country, _city, _state, _street, _zipcode, _birthdate, _sex, _language, _username, _firstname, _lastname, _email, _prerequisites, _spamDetection);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).REGISTER, registerData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_REGISTER(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );


        return deferred.promise;
    };


    this.CUSTOMER_LANGUAGES = function () {
        var languageData = uiCommunicate.createData().CUSTOMER_LANGUAGES();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).LANGUAGES, languageData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_LANGUAGES(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );


        return deferred.promise;
    };

    this.CUSTOMER_COUNTRIES = function () {
        var countriesData = uiCommunicate.createData().CUSTOMER_COUNTRIES();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).COUNTRIES, countriesData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_COUNTRIES(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );


        return deferred.promise;
    };

    this.CUSTOMER_MODIFY = function (_country, _city, _state, _street, _zipcode, _birthdate, _sex, _language, _username, _firstname, _lastname, _email) {
        var modifyData = uiCommunicate.createData().CUSTOMER_MODIFY(_country, _city, _state, _street, _zipcode, _birthdate, _sex, _language, _username, _firstname, _lastname, _email);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).MODIFY, modifyData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_MODIFY(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.CUSTOMER_DATA = function () {
        var customerData = uiCommunicate.createData().CUSTOMER_DATA();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).DATA, customerData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_DATA(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    this.CUSTOMER_ACTIVATE = function (_token, _password) {
        var activateData = uiCommunicate.createData().CUSTOMER_ACTIVATE(_token, _password);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).ACTIVATE, activateData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_ACTIVATE(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.CUSTOMER_RECOVER_INIT = function (_username) {
        var recoverInitData = uiCommunicate.createData().CUSTOMER_RECOVER_INIT(_username);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).RECOVER_INIT, recoverInitData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_RECOVER_INIT(_data);
                //console.log(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };

    this.CUSTOMER_RECOVER = function (_token, _password) {
        var recoverInitData = uiCommunicate.createData().CUSTOMER_RECOVER(_token, _password);
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).RECOVER_INIT, recoverInitData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_RECOVER(_data);
                //console.log(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };
    this.CUSTOMER_AUTHENTICATED = function () {
        var recoverInitData = uiCommunicate.createData().CUSTOMER_AUTHENTICATED();
        var deferred = $q.defer();
        uiCommunicate.callWeb(uiCommunicate.getCaller().CUSTOMER, uiCommunicate.getActions(uiCommunicate.getCaller().CUSTOMER).AUTHENTICATED, recoverInitData).then(function (_data) {
                checkErrors(_data);
                check_CUSTOMER_AUTHENTICATED(_data);
                //console.log(_data);
                deferred.resolve(_data);
            },
            function (_data) {
                deferred.reject(_data);
            }
        );
        return deferred.promise;
    };


    /************************************************************** Public - PROPERTIES - START ***********************************************************/


    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/
    me = this;
    init();

}
