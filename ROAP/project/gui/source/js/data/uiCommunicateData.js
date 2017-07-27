/**
 * Inherits all DATA which will be send to web or engine to communicate.
 * Use this class to handle your data-object to save the integration
 * @class UICommunicateData
 * @static
 * @constructor
 */
function UICommunicateData() {

    var communicateActions = {};
    communicateActions.PORTAL = {};
    communicateActions.FEATURES = {};
    communicateActions.CONTACT = {};
    communicateActions.CUSTOMER = {};

    /**
     * Portal navigation data
     * @method PORTAL.NAVIGATION
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.NAVIGATION = function () {
        return {}
    };
    /**
     * Portal news data
     * @method PORTAL.NEWS
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.NEWS = function () {
        return {}
    };

    /**
     * Portal news data
     * @method PORTAL.NEWS_ENTRY
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.NEWS_ENTRY = function (_id) {
        return {
            "ID": _id
        }
    };

    /**
     * Portal faqs data
     * @method PORTAL.FAQS
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.FAQS = function () {
        return {}
    };

    /**
     * Portal languages data
     * @method PORTAL.LANGUAGES
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.LANGUAGES = function () {
        return {}
    };

    /**
     * Portal set language
     * @method PORTAL.SET_LANGUAGE
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.SET_LANGUAGE = function (_language) {
        return {
            "LANGUAGE": _language.toLowerCase()
        }
    };

    /**
     * Portal get language
     * @method PORTAL.GET_LANGUAGE
     * @returns {}
     * @constructor
     */
    communicateActions.PORTAL.GET_LANGUAGE = function () {
        return {}
    };


    /**
     * Feature overview data
     * @method PORTAL.OVERVIEW
     * @returns {}
     * @constructor
     */
    communicateActions.FEATURES.OVERVIEW = function () {
        return {}
    };

    /**
     * Feature data
     * @method PORTAL.FEATURE
     * @returns {}
     * @constructor
     */
    communicateActions.FEATURES.FEATURE = function (_featureId, _part) {
        var part = _part;
        if (part == null || part == undefined) {
            part = 1;
        }
        return {
            "ID": _featureId,
            "PART": part,

        }
    };

    /**
     * Feature data
     * @method CONTACT.SEND_MAIL
     * @returns {}
     * @constructor
     */
    communicateActions.CONTACT.SEND_MAIL = function (_name, _subject, _message, _email) {
        return {
            "NAME": _name,
            "SUBJECT": _subject,
            "MESSAGE": _message,
            "EMAIL": _email,

        }
    };


    /**
     * Register user
     * @method CUSTOMER.REGISTER
     * @returns {}
     * @constructor
     */
    communicateActions.CUSTOMER.REGISTER = function (_country, _city, _state, _street, _zipcode, _birthdate, _sex, _language, _username, _firstname, _lastname, _email, _prerequisites, _spamDetection) {
        return {
            "COUNTRY": _country,
            "CITY": _city,
            "STATE": _state,
            "STREET": _street,
            "ZIPCODE": _zipcode,
            "BIRTH_DATE": _birthdate,
            "SEX": _sex,
            "LANGUAGE": _language,
            "USERNAME": _username,
            "FIRST_NAME": _firstname,
            "LAST_NAME": _lastname,
            "EMAIL": _email,
            "PREREQUISITES": _prerequisites,
            "SPAM_DETECTION": _spamDetection
        }
    };

    /**
     * Register user
     * @method CUSTOMER.MODIFY
     * @returns {}
     * @constructor
     */
    communicateActions.CUSTOMER.MODIFY = function (_country, _city, _state, _street, _zipcode, _birthdate, _sex, _language, _username, _firstname, _lastname, _email) {
        return {
            "COUNTRY": _country,
            "CITY": _city,
            "STATE": _state,
            "STREET": _street,
            "ZIPCODE": _zipcode,
            "BIRTH_DATE": _birthdate,
            "SEX": _sex,
            "LANGUAGE": _language,
            "USERNAME": _username,
            "FIRST_NAME": _firstname,
            "LAST_NAME": _lastname,
            "EMAIL": _email,


        }
    };

    communicateActions.CUSTOMER.DATA = function () {
        return {}
    };

    communicateActions.CUSTOMER.ACTIVATE = function (_token, _password) {
        return {
            "TOKEN": _token,
            "PASSWORD": _password,
        }
    };

    communicateActions.CUSTOMER.RECOVER_INIT = function (_username) {
        return {
            "USERNAME": _username,
        }
    };
    communicateActions.CUSTOMER.RECOVER = function (_token, _password) {
        return {
            "TOKEN": _token,
            "PASSWORD": _password,
        }
    };
    communicateActions.CUSTOMER.AUTHENTICATED = function () {
        return {}
    };
    communicateActions.CUSTOMER.LANGUAGES = function () {
        return {}
    };
    communicateActions.CUSTOMER.COUNTRIES = function () {
        return {}
    };


    return {
        PORTAL_NAVIGATION: communicateActions.PORTAL.NAVIGATION,
        PORTAL_NEWS: communicateActions.PORTAL.NEWS,
        PORTAL_FAQS: communicateActions.PORTAL.FAQS,
        PORTAL_LANGUAGES: communicateActions.PORTAL.LANGUAGES,
        PORTAL_SET_LANGUAGE: communicateActions.PORTAL.SET_LANGUAGE,
        PORTAL_GET_LANGUAGE: communicateActions.PORTAL.GET_LANGUAGE,
        PORTAL_NEWS_ENTRY: communicateActions.PORTAL.NEWS_ENTRY,
        FEATURES_OVERVIEW: communicateActions.FEATURES.OVERVIEW,
        FEATURES_FEATURE: communicateActions.FEATURES.FEATURE,
        CONTACT_SEND_MAIL: communicateActions.CONTACT.SEND_MAIL,

        CUSTOMER_REGISTER: communicateActions.CUSTOMER.REGISTER,
        CUSTOMER_MODIFY: communicateActions.CUSTOMER.MODIFY,
        CUSTOMER_DATA: communicateActions.CUSTOMER.DATA,
        CUSTOMER_ACTIVATE: communicateActions.CUSTOMER.ACTIVATE,
        CUSTOMER_RECOVER_INIT: communicateActions.CUSTOMER.RECOVER_INIT,
        CUSTOMER_RECOVER: communicateActions.CUSTOMER.RECOVER,
        CUSTOMER_AUTHENTICATED: communicateActions.CUSTOMER.AUTHENTICATED,
        CUSTOMER_LANGUAGES: communicateActions.CUSTOMER.LANGUAGES,
        CUSTOMER_COUNTRIES: communicateActions.CUSTOMER.COUNTRIES,
    };
}
