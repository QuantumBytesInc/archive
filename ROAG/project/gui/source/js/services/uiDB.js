/**
 *
 * @param logService
 * @param uiCommunicate
 * @constructor
 */
function UIDB($http, logService) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    /**
     * Inherits the SQLite path
     * @private
     * @type {string}
     */
    var sqlitePath = window.amazonURL + 'gui/sqlite/exports.sqlite';

    var db = null;

    var storageTemplates = [];

    var itemTemplates = [];

    /**
     * Inherits all possible overlay locations
     * @private
     * @type {Array}
     */
    var locations = [];


    /************************************************************** Private - VARIABLES - END *************************************************************/

    /************************************************************** Public - VARIABLES - START ************************************************************/


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    var init = function init() {
        ls = logService;
        instanceDB();
    };

    var instanceDB = function () {
        $http.get(sqlitePath, {responseType: 'arraybuffer'}).then(function (_data) {
            var uInt8Array = new Uint8Array(_data.data);
            db = new SQL.Database(uInt8Array);

            try {
                var contentsItem = db.exec("SELECT * FROM ItemTemplate");
                itemTemplates = mapDB(contentsItem);
                var contentsStorage = db.exec("SELECT * FROM StorageTemplate");
                storageTemplates = mapDB(contentsStorage);

                var locationItems = db.exec("SELECT * FROM Location");
                locations = mapDB(locationItems);

                if (itemTemplates.length <= 0) {
                    ls.logErr("UIDB - instanceDB - ItemTemplates are empty");
                }
                if (storageTemplates.length <= 0) {
                    ls.logErr("UIDB - instanceDB - StorageTemplates are empty");
                }
                if (locations.length <= 0) {
                    ls.logErr("UIDB - instanceDB - Locations are empty");
                }
            }
            catch (ex){
                //Catch exception, something went realy bad with DB
            }

        }, function (_data, _status) {
            ls.logEXCP("UIDB - instanceDB - Can't connect to database");
        });
    };

    /**
     * Mapping DB
     * @method
     * @param {{VALUES,COLUMNS}}_content
     * @returns {Array}
     */
    var mapDB = function (_content) {
        var rows = [];
        if (_content.length > 0) {
            var values = _content[0].values;
            var columns = _content[0].columns;

            for (var i = 0; i < values.length; i++) {
                var rowObj = {};
                for (var z = 0; z < values[i].length; z++) {

                    rowObj[columns[z].toUpperCase()] = values[i][z];

                }
                rows.push(rowObj)
            }
        }
        return rows;
    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE

    /************************************************************** Public - FUNCTIONS - END **************************************************************/

    /**
     * Returns all locations
     * @property getLocations
     * @returns {Array}
     */
    this.getLocations = function getLocations() {
        return locations;
    };
    /**
     * Return all item templates
     * @property getItems
     * @returns {Array}
     */
    this.getItems = function getItems() {
        return itemTemplates;
    };

    /**
     * Returns all storage templates
     * @property getStorage
     * @returns {Array}
     */
    this.getStorages = function getStorages() {
        return storageTemplates;
    };

    /**
     *
     * @param _id
     * @returns {*}
     * @example
     * {
     * height: 1,
     * icon: "image/items/roa.png",
     * icon_taskbar: "image/items/Screenshot_from_2014-10-25_194247.png",
     * id: 2,
     * is_stackable: 0,
     * name: "Bag",
     * stack_size: null,
     * weight: 5,
     * width: 1
     * }
     */
    this.getItem = function getItem(_id) {
        for (var i = 0; i < itemTemplates.length; i++) {
            if (itemTemplates[i].ID === _id) {
                return itemTemplates[i];
            }
        }
    };

    /**
     *
     * @param _id
     * @returns {*}
     * @example {
     * height: 10,
     * id: 1,
     * image: "image/storage/changelog.png",
     * start_x: 0,
     * start_y: 0,
     * weight: 5,
     * width: 10
     * }
     */
    this.getStorage = function getStorage(_id) {
        for (var i = 0; i < storageTemplates.length; i++) {
            if (storageTemplates[i].ID === _id) {
                return storageTemplates[i];
            }
        }
    };


    /**
     *
     * @param {number} _id
     * @property getLocation
     * @returns {*}
     * @example {
           "ID":3,
           "NAME":"Castle Wyriel",
           "AREA":"Weruna",
           "LOGO": "image/locations/faction_holy.png"                                          
        }                                                                                       
     */
    this.getLocation = function getLocation(_id) {

        for (var i = 0; i < locations.length; i++) {
            if (locations[i].ID === _id) {
                return locations[i];
            }
        }
    };
    this.execSQL = function execSQL() {

    };
    /************************************************************** Public - PROPERTIES - START ***********************************************************/


    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/

    init();

}

