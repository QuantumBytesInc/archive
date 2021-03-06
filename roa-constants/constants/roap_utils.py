callers = {
    'PORTAL': 1,
    'FEATURES': 2,
    'CONTACT': 3,
    'CUSTOMER': 4,
}

actions = {
    'PORTAL_NAVIGATION': 0,
    'PORTAL_NEWS': 1,
    'PORTAL_NEWS_ENTRY': 2,
    'PORTAL_FAQS': 3,
    'PORTAL_LANGUAGES': 4,
    'PORTAL_GET_LANGUAGE': 5,
    'PORTAL_SET_LANGUAGE': 6,
    'FEATURES_OVERVIEW': 0,
    'FEATURES_FEATURE': 1,
    'CONTACT_SEND_MAIL': 0,
    'CUSTOMER_COUNTRIES': 0,
    'CUSTOMER_LANGUAGES': 1,
    'CUSTOMER_REGISTER': 2,
    'CUSTOMER_MODIFY': 3,
    'CUSTOMER_DATA': 4,
    'CUSTOMER_AUTHENTICATED': 5,
}

result_codes = {
    'PORTAL_NAVIGATION_SUCCESSFULLY': 0,
    'PORTAL_NAVIGATION_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'PORTAL_NAVIGATION_FAILED_SERVER_DOWN': 2,
    'PORTAL_NAVIGATION_FAILED_MAINTENANCE': 3,
    'PORTAL_NAVIGATION_FAILED_MISC': 4,
    'PORTAL_NEWS_SUCCESSFULLY': 0,
    'PORTAL_NEWS_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'PORTAL_NEWS_FAILED_SERVER_DOWN': 2,
    'PORTAL_NEWS_FAILED_MAINTENANCE': 3,
    'PORTAL_NEWS_FAILED_MISC': 4,
    'PORTAL_NEWS_ENTRY_SUCCESSFULLY': 0,
    'PORTAL_NEWS_ENTRY_NOT_FOUND': 1,
    'PORTAL_NEWS_ENTRY_MISSING_DATA': 2,
    'PORTAL_NEWS_ENTRY_FAILED_BRUTE_FORCE_ATTEMPT': 3,
    'PORTAL_NEWS_ENTRY_FAILED_SERVER_DOWN': 4,
    'PORTAL_NEWS_ENTRY_FAILED_MAINTENANCE': 5,
    'PORTAL_NEWS_ENTRY_FAILED_MISC': 6,
    'PORTAL_FAQS_SUCCESSFULLY': 0,
    'PORTAL_FAQS_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'PORTAL_FAQS_FAILED_SERVER_DOWN': 2,
    'PORTAL_FAQS_FAILED_MAINTENANCE': 3,
    'PORTAL_FAQS_FAILED_MISC': 4,
    'PORTAL_LANGUAGES_SUCCESSFULLY': 0,
    'PORTAL_LANGUAGES_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'PORTAL_LANGUAGES_FAILED_SERVER_DOWN': 2,
    'PORTAL_LANGUAGES_FAILED_MAINTENANCE': 3,
    'PORTAL_LANGUAGES_FAILED_MISC': 4,
    'PORTAL_GET_LANGUAGE_SUCCESSFULLY': 0,
    'PORTAL_GET_LANGUAGE_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'PORTAL_GET_LANGUAGE_FAILED_SERVER_DOWN': 2,
    'PORTAL_GET_LANGUAGE_FAILED_MAINTENANCE': 3,
    'PORTAL_GET_LANGUAGE_FAILED_MISC': 4,
    'PORTAL_SET_LANGUAGE_SUCCESSFULLY': 0,
    'PORTAL_SET_LANGUAGE_NOT_SUPPORTED': 1,
    'PORTAL_SET_LANGUAGE_FAILED_BRUTE_FORCE_ATTEMPT': 2,
    'PORTAL_SET_LANGUAGE_FAILED_SERVER_DOWN': 3,
    'PORTAL_SET_LANGUAGE_FAILED_MAINTENANCE': 4,
    'PORTAL_SET_LANGUAGE_FAILED_MISC': 5,
    'FEATURES_OVERVIEW_SUCCESSFULLY': 0,
    'FEATURES_OVERVIEW_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'FEATURES_OVERVIEW_FAILED_SERVER_DOWN': 2,
    'FEATURES_OVERVIEW_FAILED_MAINTENANCE': 3,
    'FEATURES_OVERVIEW_FAILED_MISC': 4,
    'FEATURES_FEATURE_SUCCESSFULLY': 0,
    'FEATURES_FEATURE_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'FEATURES_FEATURE_FAILED_SERVER_DOWN': 2,
    'FEATURES_FEATURE_FAILED_MAINTENANCE': 3,
    'FEATURES_FEATURE_FAILED_MISC': 4,
    'CONTACT_SEND_MAIL_SUCCESSFULLY': 0,
    'CONTACT_SEND_MAIL_FAILED_MISSING_VALUES': 1,
    'CONTACT_SEND_MAIL_FAILED_BRUTE_FORCE_ATTEMPT': 2,
    'CONTACT_SEND_MAIL_FAILED_SERVER_DOWN': 3,
    'CONTACT_SEND_MAIL_FAILED_MAINTENANCE': 4,
    'CONTACT_SEND_MAIL_FAILED_MISC': 5,
    'CUSTOMER_COUNTRIES_SUCCESSFULLY': 0,
    'CUSTOMER_COUNTRIES_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'CUSTOMER_COUNTRIES_FAILED_SERVER_DOWN': 2,
    'CUSTOMER_COUNTRIES_FAILED_MAINTENANCE': 3,
    'CUSTOMER_COUNTRIES_FAILED_MISC': 4,
    'CUSTOMER_LANGUAGES_SUCCESSFULLY': 0,
    'CUSTOMER_LANGUAGES_FAILED_BRUTE_FORCE_ATTEMPT': 1,
    'CUSTOMER_LANGUAGES_FAILED_SERVER_DOWN': 2,
    'CUSTOMER_LANGUAGES_FAILED_MAINTENANCE': 3,
    'CUSTOMER_LANGUAGES_FAILED_MISC': 4,
    'CUSTOMER_REGISTER_SUCCESSFULLY': 0,
    'CUSTOMER_REGISTER_FAILED_COUNTRY_NOT_FOUND': 1,
    'CUSTOMER_REGISTER_FAILED_CITY_TO_LONG': 2,
    'CUSTOMER_REGISTER_FAILED_CITY_EMPTY': 3,
    'CUSTOMER_REGISTER_FAILED_CITY_INVALID': 4,
    'CUSTOMER_REGISTER_FAILED_STATE_TO_LONG': 5,
    'CUSTOMER_REGISTER_FAILED_STATE_EMPTY': 6,
    'CUSTOMER_REGISTER_FAILED_STATE_INVALID': 7,
    'CUSTOMER_REGISTER_FAILED_STREET_TO_LONG': 8,
    'CUSTOMER_REGISTER_FAILED_STREET_EMPTY': 9,
    'CUSTOMER_REGISTER_FAILED_STREET_INVALID': 10,
    'CUSTOMER_REGISTER_FAILED_ZIPCODE_TO_LONG': 11,
    'CUSTOMER_REGISTER_FAILED_ZIPCODE_EMPTY': 12,
    'CUSTOMER_REGISTER_FAILED_ZIPCODE_INVALID': 13,
    'CUSTOMER_REGISTER_FAILED_BIRTH_DATE_INVALID': 14,
    'CUSTOMER_REGISTER_FAILED_SEX_INVALID': 15,
    'CUSTOMER_REGISTER_FAILED_LANGUAGE_NOT_FOUND': 16,
    'CUSTOMER_REGISTER_FAILED_PREREQUISITES_INVALID': 17,
    'CUSTOMER_REGISTER_FAILED_CAPTCHA_INVALID': 18,
    'CUSTOMER_REGISTER_FAILED_USERNAME_TO_LONG': 19,
    'CUSTOMER_REGISTER_FAILED_USERNAME_EMPTY': 20,
    'CUSTOMER_REGISTER_FAILED_USERNAME_INVALID': 21,
    'CUSTOMER_REGISTER_FAILED_USERNAME_TAKEN': 22,
    'CUSTOMER_REGISTER_FAILED_FIRST_NAME_TO_LONG': 23,
    'CUSTOMER_REGISTER_FAILED_FIRST_NAME_EMPTY': 24,
    'CUSTOMER_REGISTER_FAILED_FIRST_NAME_INVALID': 25,
    'CUSTOMER_REGISTER_FAILED_LAST_NAME_TO_LONG': 26,
    'CUSTOMER_REGISTER_FAILED_LAST_NAME_EMPTY': 27,
    'CUSTOMER_REGISTER_FAILED_LAST_NAME_INVALID': 28,
    'CUSTOMER_REGISTER_FAILED_EMAIL_INVALID': 29,
    'CUSTOMER_REGISTER_FAILED_EMAIL_TAKEN': 30,
    'CUSTOMER_REGISTER_FAILED_MISSING_VALUES': 31,
    'CUSTOMER_REGISTER_FAILED_BRUTE_FORCE_ATTEMPT': 32,
    'CUSTOMER_REGISTER_FAILED_SERVER_DOWN': 33,
    'CUSTOMER_REGISTER_FAILED_MAINTENANCE': 34,
    'CUSTOMER_REGISTER_FAILED_MISC': 35,
    'CUSTOMER_MODIFY_SUCCESSFULLY': 0,
    'CUSTOMER_MODIFY_COUNTRY_NOT_FOUND': 1,
    'CUSTOMER_MODIFY_CITY_TO_LONG': 2,
    'CUSTOMER_MODIFY_CITY_EMPTY': 3,
    'CUSTOMER_MODIFY_CITY_INVALID': 4,
    'CUSTOMER_MODIFY_STATE_TO_LONG': 5,
    'CUSTOMER_MODIFY_STATE_EMPTY': 6,
    'CUSTOMER_MODIFY_STATE_INVALID': 7,
    'CUSTOMER_MODIFY_STREET_TO_LONG': 8,
    'CUSTOMER_MODIFY_STREET_EMPTY': 9,
    'CUSTOMER_MODIFY_STREET_INVALID': 10,
    'CUSTOMER_MODIFY_ZIPCODE_TO_LONG': 11,
    'CUSTOMER_MODIFY_ZIPCODE_EMPTY': 12,
    'CUSTOMER_MODIFY_ZIPCODE_INVALID': 13,
    'CUSTOMER_MODIFY_BIRTH_DATE_INVALID': 14,
    'CUSTOMER_MODIFY_SEX_INVALID': 15,
    'CUSTOMER_MODIFY_LANGUAGE_NOT_FOUND': 16,
    'CUSTOMER_MODIFY_PREREQUISITES_INVALID': 17,
    'CUSTOMER_MODIFY_USERNAME_TO_LONG': 18,
    'CUSTOMER_MODIFY_USERNAME_EMPTY': 19,
    'CUSTOMER_MODIFY_USERNAME_INVALID': 20,
    'CUSTOMER_MODIFY_USERNAME_TAKEN': 21,
    'CUSTOMER_MODIFY_FIRST_NAME_TO_LONG': 22,
    'CUSTOMER_MODIFY_FIRST_NAME_EMPTY': 23,
    'CUSTOMER_MODIFY_FIRST_NAME_INVALID': 24,
    'CUSTOMER_MODIFY_LAST_NAME_TO_LONG': 25,
    'CUSTOMER_MODIFY_LAST_NAME_EMPTY': 26,
    'CUSTOMER_MODIFY_LAST_NAME_INVALID': 27,
    'CUSTOMER_MODIFY_EMAIL_INVALID': 28,
    'CUSTOMER_MODIFY_EMAIL_TAKEN': 29,
    'CUSTOMER_MODIFY_FAILED_MISC': 30,
    'CUSTOMER_MODIFY_USER_NOT_FOUND': 31,
    'CUSTOMER_MODIFY_NEEDS_REACTIVATION': 32,
    'CUSTOMER_MODIFY_FAILED_NOT_LOGGED_IN': 33,
    'CUSTOMER_DATA_SUCCESSFULLY': 0,
    'CUSTOMER_DATA_FAILED_USER_NOT_FOUND': 1,
    'CUSTOMER_DATA_FAILED_NOT_LOGGED_IN': 2,
    'CUSTOMER_DATA_FAILED_BRUTE_FORCE_ATTEMPT': 3,
    'CUSTOMER_DATA_FAILED_SERVER_DOWN': 4,
    'CUSTOMER_DATA_FAILED_MAINTENANCE': 5,
    'CUSTOMER_DATA_FAILED_MISC': 6,
    'CUSTOMER_AUTHENTICATED_SUCCESSFULLY': 0,
    'CUSTOMER_AUTHENTICATED_FAILED_MISSING_VALUES': 1,
    'CUSTOMER_AUTHENTICATED_FAILED_BRUTE_FORCE_ATTEMPT': 2,
    'CUSTOMER_AUTHENTICATED_FAILED_SERVER_DOWN': 3,
    'CUSTOMER_AUTHENTICATED_FAILED_MAINTENANCE': 4,
    'CUSTOMER_AUTHENTICATED_FAILED_MISC': 5,
}

global_errors = {
    'ERROR_NOT_AUTHENTICATED': 0,
    'ERROR_ACTION_UNKNOWN': 1,
    'ERROR_CALLER_UNKNOWN': 2,
    'ERROR_OBJECT_LOCKED': 3,
    'ERROR_RATE_LIMIT': 4,
    'ERROR_MISC_ERROR': 5,
    'ERROR_SERVER_OFFLINE': 6,
}
