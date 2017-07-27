var caller =
{
	"GLOBAL": 0,
	"AUTHENTICATION" : 1,
	"ACCOUNT" : 2,
	"CHARACTER" : 3,
	"UNIGINE" : 4,
	"LAUNCHER" : 5,
	"CHANNEL" : 6,
	"SYNC" : 7,
	"STORAGE" : 8,
	"WORLD" : 9,
	"GATHERING" : 10,
	"GATHERING_3D" : 11
};

var actionMap ={};
actionMap[caller["GLOBAL"]] = { "GLOBAL" : 0 };
actionMap[caller["AUTHENTICATION"]] = { "LOGIN" : 0, "LOGOUT" : 1, "TOKEN_REFRESH" : 2, "LOGIN_BY_TOKEN" : 3, "GET_TOKEN" : 4, "HEART_BEAT" : 5 };
actionMap[caller["ACCOUNT"]] = { "SETTINGS_SET" : 0, "SETTINGS_GET" : 1 };
actionMap[caller["CHARACTER"]] = { "LIST" : 0, "SPAWN" : 1, "DELETE" : 2, "CREATE" : 3, "SELECT" : 4, "GUI_CREATE" : 5, "GUI_SELECTION" : 6, "SLOT_STATE" : 7, "TORCH" : 8, "EQUIP_MAIN_HAND" : 9, "SET_POSITION" : 10, "UNSTUCK" : 11 };
actionMap[caller["UNIGINE"]] = { "CLOSE" : 0, "UI_ENTER" : 1, "UI_LEAVE" : 2, "DESTROY_GUI" : 3, "CREATE_GUI" : 4, "GET_TOKEN" : 5, "SET_TOKEN" : 6, "SET_GUI_STATE" : 7, "GET_GUI_STATE" : 8, "LOG_TO_ENGINE" : 9, "JSON_EVENT" : 10, "AJS_READY" : 11, "GET_STATE" : 12, "SET_STATE" : 13 };
actionMap[caller["LAUNCHER"]] = { "VERSION_CHECK" : 0 };
actionMap[caller["CHANNEL"]] = { "GET_BY_NAME" : 0, "GET_LIST" : 1, "GET_USER_LIST" : 2, "JOIN" : 3, "LEAVE" : 4, "SEND" : 5, "RECEIVE" : 6, "HEARTBEAT" : 7 };
actionMap[caller["SYNC"]] = { "TIME_WEATHER" : 0, "SET_TIME" : 1, "GET_TIME" : 2, "SPAWN_RESOURCES" : 3, "DESPAWN_RESOURCES" : 4, "SPAWN_RESOURCES_INIT" : 5 };
actionMap[caller["STORAGE"]] = { "GET_DETAILS" : 0, "SWAP_ITEM" : 1, "DESTROY_ITEM" : 2, "STACK" : 3, "UNSTACK" : 4, "ADD" : 5, "MOVE" : 6, "GET_EQUIPPED_BAGS" : 7, "OPEN_BANK" : 8 };
actionMap[caller["WORLD"]] = { "NEW_LOCATION" : 0 };
actionMap[caller["GATHERING"]] = { "UI_RESULT" : 0, "RESULT" : 1 };
actionMap[caller["GATHERING_3D"]] = { "MINING_START" : 0, "MINING_STOP" : 1, "CREATE_GUI" : 2, "DESTROY_GUI" : 3 };


var codeMap = {};
codeMap[caller["GLOBAL"]] = {};
codeMap[caller["GLOBAL"]][actionMap[caller["GLOBAL"]]["GLOBAL"]]  =  {"ERROR_NOT_AUTHENTICATED": 0, "ERROR_ACTION_UNKNOWN": 1, "ERROR_CALLER_UNKNOWN": 2, "ERROR_OBJECT_LOCKED": 3, "ERROR_RATE_LIMIT": 4, "ERROR_MISC_ERROR": 5, "ERROR_SERVER_OFFLINE": 6, "ERROR_USER_NOT_AUTHENTICATED": 7};
codeMap[caller["AUTHENTICATION"]] = {};
codeMap[caller["AUTHENTICATION"]][actionMap[caller["AUTHENTICATION"]]["LOGIN"]] = {"SUCCESSFULLY" : 0, "UNSUCCESSFULLY" : 1, "FAILED_USER_NOT_FOUND" : 2, "FAILED_USER_NOT_AUTHENTICATED" : 3, "FAILED_USER_NOT_ACTIVATED" : 4, "FAILED_USER_NOT_ACTIVE" : 5, "FAILED_BRUTE_FORCE_ATTEMPT" : 6, "FAILED_WRONG_USER_OR_PASSWORD" : 7, "FAILED_MISSING_VALUES" : 8, "FAILED_MISC" : 9 };
codeMap[caller["AUTHENTICATION"]][actionMap[caller["AUTHENTICATION"]]["LOGOUT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["AUTHENTICATION"]][actionMap[caller["AUTHENTICATION"]]["TOKEN_REFRESH"]] = {"SUCCESSFULLY" : 0, "FAILED_TO_OLD" : 1, "FAILED_MISC" : 2 };
codeMap[caller["AUTHENTICATION"]][actionMap[caller["AUTHENTICATION"]]["LOGIN_BY_TOKEN"]] = {"SUCCESSFULLY" : 0, "UNSUCCESSFULLY" : 1, "FAILED_TO_OLD" : 2, "FAILED_MISC" : 3 };
codeMap[caller["AUTHENTICATION"]][actionMap[caller["AUTHENTICATION"]]["GET_TOKEN"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["AUTHENTICATION"]][actionMap[caller["AUTHENTICATION"]]["HEART_BEAT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["ACCOUNT"]] = {};
codeMap[caller["ACCOUNT"]][actionMap[caller["ACCOUNT"]]["SETTINGS_SET"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["ACCOUNT"]][actionMap[caller["ACCOUNT"]]["SETTINGS_GET"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]] = {};
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["LIST"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["SPAWN"]] = {"SUCCESSFULLY" : 0, "INVALID_CHARACTER" : 1, "INVALID_TOKEN" : 2, "FAILED_MISC" : 3 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["DELETE"]] = {"SUCCESSFULLY" : 0, "INVALID_CHARACTER" : 1, "FAILED_MISC" : 2 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["CREATE"]] = {"SUCCESSFULLY" : 0, "ALREADY_USED" : 1, "LIMIT_REACHED" : 2, "FAILED_MISC" : 3 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["SELECT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["GUI_CREATE"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["GUI_SELECTION"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["SLOT_STATE"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["TORCH"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["EQUIP_MAIN_HAND"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["SET_POSITION"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHARACTER"]][actionMap[caller["CHARACTER"]]["UNSTUCK"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["UNIGINE"]] = {};
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["CLOSE"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["UI_ENTER"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["UI_LEAVE"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["DESTROY_GUI"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["CREATE_GUI"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["GET_TOKEN"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["SET_TOKEN"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["SET_GUI_STATE"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["GET_GUI_STATE"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["LOG_TO_ENGINE"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["JSON_EVENT"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["AJS_READY"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["GET_STATE"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["UNIGINE"]][actionMap[caller["UNIGINE"]]["SET_STATE"]] = {"SUCCESSFULLY" : 0 };
codeMap[caller["LAUNCHER"]] = {};
codeMap[caller["LAUNCHER"]][actionMap[caller["LAUNCHER"]]["VERSION_CHECK"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]] = {};
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["GET_BY_NAME"]] = {"SUCCESSFULLY" : 0, "NOT_FOUND" : 1, "FAILED_MISC" : 2 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["GET_LIST"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["GET_USER_LIST"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["JOIN"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["LEAVE"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["SEND"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["RECEIVE"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["CHANNEL"]][actionMap[caller["CHANNEL"]]["HEARTBEAT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["SYNC"]] = {};
codeMap[caller["SYNC"]][actionMap[caller["SYNC"]]["TIME_WEATHER"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["SYNC"]][actionMap[caller["SYNC"]]["SET_TIME"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["SYNC"]][actionMap[caller["SYNC"]]["GET_TIME"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["SYNC"]][actionMap[caller["SYNC"]]["SPAWN_RESOURCES"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["SYNC"]][actionMap[caller["SYNC"]]["DESPAWN_RESOURCES"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["SYNC"]][actionMap[caller["SYNC"]]["SPAWN_RESOURCES_INIT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]] = {};
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["GET_DETAILS"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["SWAP_ITEM"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["DESTROY_ITEM"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["STACK"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["UNSTACK"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["ADD"]] = {"SUCCESSFULLY" : 0, "FAILED_SLOT_NOT_FREE" : 1, "FAILED_INVALID_STORAGE" : 2, "FAILED_MISC" : 3 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["MOVE"]] = {"SUCCESSFULLY" : 0, "FAILED_SLOT_NOT_FREE" : 1, "FAILED_INVALID_STORAGE" : 2, "FAILED_MISC" : 3 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["GET_EQUIPPED_BAGS"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["STORAGE"]][actionMap[caller["STORAGE"]]["OPEN_BANK"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["WORLD"]] = {};
codeMap[caller["WORLD"]][actionMap[caller["WORLD"]]["NEW_LOCATION"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["GATHERING"]] = {};
codeMap[caller["GATHERING"]][actionMap[caller["GATHERING"]]["UI_RESULT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["GATHERING"]][actionMap[caller["GATHERING"]]["RESULT"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["GATHERING_3D"]] = {};
codeMap[caller["GATHERING_3D"]][actionMap[caller["GATHERING_3D"]]["MINING_START"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["GATHERING_3D"]][actionMap[caller["GATHERING_3D"]]["MINING_STOP"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["GATHERING_3D"]][actionMap[caller["GATHERING_3D"]]["CREATE_GUI"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };
codeMap[caller["GATHERING_3D"]][actionMap[caller["GATHERING_3D"]]["DESTROY_GUI"]] = {"SUCCESSFULLY" : 0, "FAILED_MISC" : 1 };