/**
 * Inherits all DATA which will be send to web or engine to communicate.
 * Use this class to handle your data-object to save the integration
 * @class UICommunicateData
 * @static
 * @constructor
 */
function UICommunicateData() {

    var communicateActions = {};
    communicateActions.AUTHENTICATION = {};
    communicateActions.ACCOUNT = {};
    communicateActions.CHARACTER = {};
    communicateActions.STORAGE = {};
    communicateActions.GATHERING = {};
    /**
     * Generates the login data
     * @method
     * @param {string} _username
     * @param {string} _password
     * @returns {{username: *, password: *}}
     */
    communicateActions.AUTHENTICATION.LOGIN = function (_username, _password) {
        return {
            USERNAME: _username,
            PASSWORD: _password
        }
    };
    /**
     * Generates the login data by token
     * @method
     * @param _token
     * @returns {{TOKEN: *}}
     * @constructor
     */
    communicateActions.AUTHENTICATION.LOGIN_BY_TOKEN = function (_token) {
        return {
            TOKEN: _token
        }
    };

    /**
     * Refresh the token data
     * @method
     * @returns {}
     */
    communicateActions.AUTHENTICATION.TOKEN_REFRESH = function () {
        return {}
    };


    /**
     * Generates the settingsget data.
     * @method
     * @returns {{}}
     */
    communicateActions.ACCOUNT.SETTINGS_GET = function () {
        return {}
    };

    /**
     * Generates the character getlist data.
     * @method
     * @returns {{}}
     */
    communicateActions.CHARACTER.LIST = function () {
        return {}
    };

    /**
     * Spawns the character with the given id
     * @method
     * @param {number} _id - The character id
     * @param {string} _token
     * @returns {{id: *}}
     * @constructor
     */
    communicateActions.CHARACTER.SPAWN = function (_id, _token) {
        return {
            ID: _id,
            TOKEN: _token
        }
    };

    /**
     * Select the character with the given id
     * @method
     * @param {number} _id - The character id
     * @param {number} _slotId - The position index on the list
     * @returns {{id: *}}
     * @constructor
     */
    communicateActions.CHARACTER.SELECT = function (_id, _slotId) {
        return {
            ID: _id,
            SLOTID: _slotId
        }
    };

    /**
     * Character gui create show data.
     * @method
     * @returns {}
     * @constructor
     */
    communicateActions.CHARACTER.GUI_CREATE = function () {
        return {}
    };
    /**
     * Character gui selection show data.
     * @method
     * @returns {{id: *}}
     * @constructor
     */
    communicateActions.CHARACTER.GUI_SELECTION = function () {
        return {}
    };

    /**
     * Returns the actual slot ids
     * @method
     * @returns {{SLOT_1: number, SLOT_2: number, SLOT_3: number}}
     * @constructor
     */
    communicateActions.CHARACTER.SLOT_STATE = function () {
        return {
            "SLOT_1": 0,
            "SLOT_2": 0,
            "SLOT_3": 0
        };
    };


    /**
     * Deletes the character with the given id
     * @method
     * @param _{number} id - The character id
     * @returns {{id: *}}
     * @constructor
     */
    communicateActions.CHARACTER.DELETE = function (_id) {
        return {
            ID: _id
        }
    };

    /**
     * Equip mainhand
     * 0=nothing
     * 1 = torch
     * 2 = axe
     * @method
     * @param _id
     * @returns {{ID: *}}
     * @constructor
     */
    communicateActions.CHARACTER.EQUIP_MAIN_HAND = function (_id) {
        return {
            ID: _id
        }
    };

    /**
     * Equip mainhand
     * 0=nothing
     * 1 = torch
     * @method
     * @param _id
     * @returns {{ID: *}}
     * @constructor
     */
    communicateActions.CHARACTER.TORCH = function (_state) {
        return {TORCH: _state}
    };


    /**
     * Creates the character with the passed data
     * @method
     * @param {string} _nickname
     * @param {string} _forename
     * @param {string} _surname
     * @param {number} _locationId
     * @returns {{nickname: *, forename: *, surname: *, locationId: *}}
     * @constructor
     */
    communicateActions.CHARACTER.CREATE = function (_nickname, _forename, _surname, _locationId) {
        return {
            NICKNAME: _nickname,
            FORENAME: _forename,
            SURNAME: _surname,
            LOCATIONID: _locationId
        }
    };


    /**
     *
     * @param {number} _minigameId
     * @param {number} _itemId
     * @param {number} _maskId
     * @param {number} _value
     * @returns {{ID: *, ITEMID: *, MASK: *, VALUE: *}}
     * @constructor
     */
    communicateActions.GATHERING.RESULT = function (_minigameId, _itemId, _maskId, _value) {
        return {
            ID: _minigameId,
            ITEMID: _itemId,
            MASK: _maskId,
            VALUE: _value
        };
    };


    return {
        AUTHENTICATION_LOGIN: communicateActions.AUTHENTICATION.LOGIN,
        AUTHENTICATION_LOGIN_BY_TOKEN: communicateActions.AUTHENTICATION.LOGIN_BY_TOKEN,
        AUTHENTICATION_TOKEN_REFRESH: communicateActions.AUTHENTICATION.TOKEN_REFRESH,
        ACCOUNT_SETTINGS_GET: communicateActions.ACCOUNT.SETTINGS_GET,
        CHARACTER_LIST: communicateActions.CHARACTER.LIST,
        CHARACTER_SPAWN: communicateActions.CHARACTER.SPAWN,
        CHARACTER_SELECT: communicateActions.CHARACTER.SELECT,
        CHARACTER_DELETE: communicateActions.CHARACTER.DELETE,
        CHARACTER_CREATE: communicateActions.CHARACTER.CREATE,
        CHARACTER_GUI_CREATE: communicateActions.CHARACTER.GUI_CREATE,
        CHARACTER_GUI_SELECTION: communicateActions.CHARACTER.GUI_SELECTION,
        CHARACTER_SLOT_STATE: communicateActions.CHARACTER.SLOT_STATE,
        EQUIP_MAIN_HAND: communicateActions.CHARACTER.EQUIP_MAIN_HAND,
        CHARACTER_TORCH: communicateActions.CHARACTER.TORCH,


        GATHERING_RESULT: communicateActions.GATHERING.RESULT,


    };
}
