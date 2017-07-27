var caller =
{
	"GLOBAL": 0,
	"PORTAL" : 1,
	"FEATURES" : 2,
	"CONTACT" : 3,
	"CUSTOMER" : 4
};

var actionMap ={};
actionMap[caller["GLOBAL"]] = { "GLOBAL" : 0 };
actionMap[caller["PORTAL"]] = { "NAVIGATION" : 0, "NEWS" : 1, "NEWS_ENTRY" : 2, "FAQS" : 3, "LANGUAGES" : 4, "GET_LANGUAGE" : 5, "SET_LANGUAGE" : 6 };
actionMap[caller["FEATURES"]] = { "OVERVIEW" : 0, "FEATURE" : 1 };
actionMap[caller["CONTACT"]] = { "SEND_MAIL" : 0 };
actionMap[caller["CUSTOMER"]] = { "COUNTRIES" : 0, "LANGUAGES" : 1, "REGISTER" : 2, "MODIFY" : 3, "DATA" : 4, "AUTHENTICATED" : 5 };


var codeMap = {};
codeMap[caller["GLOBAL"]] = {};
codeMap[caller["GLOBAL"]][actionMap[caller["GLOBAL"]]["GLOBAL"]]  =  {"ERROR_NOT_AUTHENTICATED": 0, "ERROR_ACTION_UNKNOWN": 1, "ERROR_CALLER_UNKNOWN": 2, "ERROR_OBJECT_LOCKED": 3, "ERROR_RATE_LIMIT": 4, "ERROR_MISC_ERROR": 5, "ERROR_SERVER_OFFLINE": 6};
codeMap[caller["PORTAL"]] = {};
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["NAVIGATION"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["NEWS"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["NEWS_ENTRY"]] = {"SUCCESSFULLY" : 0, "NOT_FOUND" : 1, "MISSING_DATA" : 2, "FAILED_BRUTE_FORCE_ATTEMPT" : 3, "FAILED_SERVER_DOWN" : 4, "FAILED_MAINTENANCE" : 5, "FAILED_MISC" : 6 };
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["FAQS"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["LANGUAGES"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["GET_LANGUAGE"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["PORTAL"]][actionMap[caller["PORTAL"]]["SET_LANGUAGE"]] = {"SUCCESSFULLY" : 0, "NOT_SUPPORTED" : 1, "FAILED_BRUTE_FORCE_ATTEMPT" : 2, "FAILED_SERVER_DOWN" : 3, "FAILED_MAINTENANCE" : 4, "FAILED_MISC" : 5 };
codeMap[caller["FEATURES"]] = {};
codeMap[caller["FEATURES"]][actionMap[caller["FEATURES"]]["OVERVIEW"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["FEATURES"]][actionMap[caller["FEATURES"]]["FEATURE"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["CONTACT"]] = {};
codeMap[caller["CONTACT"]][actionMap[caller["CONTACT"]]["SEND_MAIL"]] = {"SUCCESSFULLY" : 0, "FAILED_MISSING_VALUES" : 1, "FAILED_BRUTE_FORCE_ATTEMPT" : 2, "FAILED_SERVER_DOWN" : 3, "FAILED_MAINTENANCE" : 4, "FAILED_MISC" : 5 };
codeMap[caller["CUSTOMER"]] = {};
codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["COUNTRIES"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["LANGUAGES"]] = {"SUCCESSFULLY" : 0, "FAILED_BRUTE_FORCE_ATTEMPT" : 1, "FAILED_SERVER_DOWN" : 2, "FAILED_MAINTENANCE" : 3, "FAILED_MISC" : 4 };
codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["REGISTER"]] = {"SUCCESSFULLY" : 0, "FAILED_COUNTRY_NOT_FOUND" : 1, "FAILED_CITY_TO_LONG" : 2, "FAILED_CITY_EMPTY" : 3, "FAILED_CITY_INVALID" : 4, "FAILED_STATE_TO_LONG" : 5, "FAILED_STATE_EMPTY" : 6, "FAILED_STATE_INVALID" : 7, "FAILED_STREET_TO_LONG" : 8, "FAILED_STREET_EMPTY" : 9, "FAILED_STREET_INVALID" : 10, "FAILED_ZIPCODE_TO_LONG" : 11, "FAILED_ZIPCODE_EMPTY" : 12, "FAILED_ZIPCODE_INVALID" : 13, "FAILED_BIRTH_DATE_INVALID" : 14, "FAILED_SEX_INVALID" : 15, "FAILED_LANGUAGE_NOT_FOUND" : 16, "FAILED_PREREQUISITES_INVALID" : 17, "FAILED_CAPTCHA_INVALID" : 18, "FAILED_USERNAME_TO_LONG" : 19, "FAILED_USERNAME_EMPTY" : 20, "FAILED_USERNAME_INVALID" : 21, "FAILED_USERNAME_TAKEN" : 22, "FAILED_FIRST_NAME_TO_LONG" : 23, "FAILED_FIRST_NAME_EMPTY" : 24, "FAILED_FIRST_NAME_INVALID" : 25, "FAILED_LAST_NAME_TO_LONG" : 26, "FAILED_LAST_NAME_EMPTY" : 27, "FAILED_LAST_NAME_INVALID" : 28, "FAILED_EMAIL_INVALID" : 29, "FAILED_EMAIL_TAKEN" : 30, "FAILED_MISSING_VALUES" : 31, "FAILED_BRUTE_FORCE_ATTEMPT" : 32, "FAILED_SERVER_DOWN" : 33, "FAILED_MAINTENANCE" : 34, "FAILED_MISC" : 35 };
codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["MODIFY"]] = {"SUCCESSFULLY" : 0, "COUNTRY_NOT_FOUND" : 1, "CITY_TO_LONG" : 2, "CITY_EMPTY" : 3, "CITY_INVALID" : 4, "STATE_TO_LONG" : 5, "STATE_EMPTY" : 6, "STATE_INVALID" : 7, "STREET_TO_LONG" : 8, "STREET_EMPTY" : 9, "STREET_INVALID" : 10, "ZIPCODE_TO_LONG" : 11, "ZIPCODE_EMPTY" : 12, "ZIPCODE_INVALID" : 13, "BIRTH_DATE_INVALID" : 14, "SEX_INVALID" : 15, "LANGUAGE_NOT_FOUND" : 16, "PREREQUISITES_INVALID" : 17, "USERNAME_TO_LONG" : 18, "USERNAME_EMPTY" : 19, "USERNAME_INVALID" : 20, "USERNAME_TAKEN" : 21, "FIRST_NAME_TO_LONG" : 22, "FIRST_NAME_EMPTY" : 23, "FIRST_NAME_INVALID" : 24, "LAST_NAME_TO_LONG" : 25, "LAST_NAME_EMPTY" : 26, "LAST_NAME_INVALID" : 27, "EMAIL_INVALID" : 28, "EMAIL_TAKEN" : 29, "FAILED_MISC" : 30, "USER_NOT_FOUND" : 31, "NEEDS_REACTIVATION" : 32, "FAILED_NOT_LOGGED_IN" : 33 };
codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["DATA"]] = {"SUCCESSFULLY" : 0, "FAILED_USER_NOT_FOUND" : 1, "FAILED_NOT_LOGGED_IN" : 2, "FAILED_BRUTE_FORCE_ATTEMPT" : 3, "FAILED_SERVER_DOWN" : 4, "FAILED_MAINTENANCE" : 5, "FAILED_MISC" : 6 };
codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["AUTHENTICATED"]] = {"SUCCESSFULLY" : 0, "FAILED_MISSING_VALUES" : 1, "FAILED_BRUTE_FORCE_ATTEMPT" : 2, "FAILED_SERVER_DOWN" : 3, "FAILED_MAINTENANCE" : 4, "FAILED_MISC" : 5 };