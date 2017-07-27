callers = {
    'USER': 1,
    'GUI': 2,
}

actions = {
    'USER_REGISTER': 0,
    'USER_MODIFY': 1,
    'USER_DATA': 2,
    'USER_BAN': 3,
    'USER_LOCK': 4,
    'USER_ACTIVATE': 5,
    'USER_REACTIVATE': 6,
    'USER_RECOVER_INIT': 7,
    'USER_RECOVER': 8,
    'GUI_VERIFY_CREDENTIALS': 0,
}

result_codes = {
    'USER_REGISTER_SUCCESSFULLY': 0,
    'USER_REGISTER_COUNTRY_NOT_FOUND': 1,
    'USER_REGISTER_CITY_TO_LONG': 2,
    'USER_REGISTER_CITY_EMPTY': 3,
    'USER_REGISTER_CITY_INVALID': 4,
    'USER_REGISTER_STATE_TO_LONG': 5,
    'USER_REGISTER_STATE_EMPTY': 6,
    'USER_REGISTER_STATE_INVALID': 7,
    'USER_REGISTER_STREET_TO_LONG': 8,
    'USER_REGISTER_STREET_EMPTY': 9,
    'USER_REGISTER_STREET_INVALID': 10,
    'USER_REGISTER_ZIPCODE_TO_LONG': 11,
    'USER_REGISTER_ZIPCODE_EMPTY': 12,
    'USER_REGISTER_ZIPCODE_INVALID': 13,
    'USER_REGISTER_BIRTH_DATE_INVALID': 14,
    'USER_REGISTER_SEX_INVALID': 15,
    'USER_REGISTER_LANGUAGE_NOT_FOUND': 16,
    'USER_REGISTER_PREREQUISITES_INVALID': 17,
    'USER_REGISTER_FAILED_CAPTCHA_INVALID': 18,
    'USER_REGISTER_USERNAME_TO_LONG': 19,
    'USER_REGISTER_USERNAME_EMPTY': 20,
    'USER_REGISTER_USERNAME_INVALID': 21,
    'USER_REGISTER_USERNAME_TAKEN': 22,
    'USER_REGISTER_FIRST_NAME_TO_LONG': 23,
    'USER_REGISTER_FIRST_NAME_EMPTY': 24,
    'USER_REGISTER_FIRST_NAME_INVALID': 25,
    'USER_REGISTER_LAST_NAME_TO_LONG': 26,
    'USER_REGISTER_LAST_NAME_EMPTY': 27,
    'USER_REGISTER_LAST_NAME_INVALID': 28,
    'USER_REGISTER_EMAIL_INVALID': 29,
    'USER_REGISTER_EMAIL_TAKEN': 30,
    'USER_REGISTER_FAILED_MISC': 31,
    'USER_MODIFY_SUCCESSFULLY': 0,
    'USER_MODIFY_COUNTRY_NOT_FOUND': 1,
    'USER_MODIFY_CITY_TO_LONG': 2,
    'USER_MODIFY_CITY_EMPTY': 3,
    'USER_MODIFY_CITY_INVALID': 4,
    'USER_MODIFY_STATE_TO_LONG': 5,
    'USER_MODIFY_STATE_EMPTY': 6,
    'USER_MODIFY_STATE_INVALID': 7,
    'USER_MODIFY_STREET_TO_LONG': 8,
    'USER_MODIFY_STREET_EMPTY': 9,
    'USER_MODIFY_STREET_INVALID': 10,
    'USER_MODIFY_ZIPCODE_TO_LONG': 11,
    'USER_MODIFY_ZIPCODE_EMPTY': 12,
    'USER_MODIFY_ZIPCODE_INVALID': 13,
    'USER_MODIFY_BIRTH_DATE_INVALID': 14,
    'USER_MODIFY_SEX_INVALID': 15,
    'USER_MODIFY_LANGUAGE_NOT_FOUND': 16,
    'USER_MODIFY_PREREQUISITES_INVALID': 17,
    'USER_MODIFY_USERNAME_TO_LONG': 18,
    'USER_MODIFY_USERNAME_EMPTY': 19,
    'USER_MODIFY_USERNAME_INVALID': 20,
    'USER_MODIFY_USERNAME_TAKEN': 21,
    'USER_MODIFY_FIRST_NAME_TO_LONG': 22,
    'USER_MODIFY_FIRST_NAME_EMPTY': 23,
    'USER_MODIFY_FIRST_NAME_INVALID': 24,
    'USER_MODIFY_LAST_NAME_TO_LONG': 25,
    'USER_MODIFY_LAST_NAME_EMPTY': 26,
    'USER_MODIFY_LAST_NAME_INVALID': 27,
    'USER_MODIFY_EMAIL_INVALID': 28,
    'USER_MODIFY_EMAIL_TAKEN': 29,
    'USER_MODIFY_FAILED_MISC': 30,
    'USER_MODIFY_USER_NOT_FOUND': 31,
    'USER_MODIFY_NEEDS_REACTIVATION': 32,
    'USER_DATA_SUCCESSFULLY': 0,
    'USER_DATA_USER_NOT_FOUND': 1,
    'USER_DATA_FAILED_MISC': 2,
    'USER_BAN_SUCCESSFULLY': 0,
    'USER_BAN_USER_NOT_FOUND': 1,
    'USER_BAN_FAILED_MISC': 2,
    'USER_LOCK_SUCCESSFULLY': 0,
    'USER_LOCK_USER_NOT_FOUND': 1,
    'USER_LOCK_FAILED_MISC': 2,
    'USER_ACTIVATE_SUCCESSFULLY': 0,
    'USER_ACTIVATE_USER_NOT_FOUND': 1,
    'USER_ACTIVATE_INVALID_TOKEN': 2,
    'USER_ACTIVATE_FAILED_MISC': 3,
    'USER_REACTIVATE_SUCCESSFULLY': 0,
    'USER_REACTIVATE_INVALID_TOKEN': 1,
    'USER_REACTIVATE_FAILED_MISC': 2,
    'USER_RECOVER_INIT_SUCCESSFULLY': 0,
    'USER_RECOVER_INIT_USER_NOT_FOUND': 1,
    'USER_RECOVER_INIT_FAILED_MISC': 2,
    'USER_RECOVER_SUCCESSFULLY': 0,
    'USER_RECOVER_TOKEN_TOO_OLD': 1,
    'USER_RECOVER_INVALID_TOKEN': 2,
    'USER_RECOVER_USER_NOT_FOUND': 3,
    'USER_RECOVER_FAILED_MISC': 4,
    'GUI_VERIFY_CREDENTIALS_SUCCESSFULLY': 0,
    'GUI_VERIFY_CREDENTIALS_UNSUCCESSFULLY': 1,
    'GUI_VERIFY_CREDENTIALS_FAILED_USER_NOT_FOUND': 2,
    'GUI_VERIFY_CREDENTIALS_FAILED_USER_NOT_AUTHENTICATED': 3,
    'GUI_VERIFY_CREDENTIALS_FAILED_USER_NOT_ACTIVATED': 4,
    'GUI_VERIFY_CREDENTIALS_FAILED_USER_NOT_ACTIVE': 5,
    'GUI_VERIFY_CREDENTIALS_FAILED_BRUTE_FORCE_ATTEMPT': 6,
    'GUI_VERIFY_CREDENTIALS_FAILED_WRONG_USER_OR_PASSWORD': 7,
    'GUI_VERIFY_CREDENTIALS_FAILED_MISSING_VALUES': 8,
    'GUI_VERIFY_CREDENTIALS_FAILED_MISC': 9,
}

global_errors = {
    'ERROR_NOT_AUTHENTICATED': 0,
    'ERROR_ACTION_UNKNOWN': 1,
    'ERROR_CALLER_UNKNOWN': 2,
    'ERROR_ONLY_POST_SUPPORTED': 3,
    'ERROR_INVALID_CREDENTIALS': 4,
    'ERROR_OBJECT_LOCKED': 5,
    'ERROR_RATE_LIMIT': 6,
    'ERROR_MISC_ERROR': 7,
}
