/**
 *
 * @param {LogService} logService
 * @constructor
 */
function UIUser(logService) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    /**
     * Inherits the logged in token
     * @property getToken
     * @type {string}
     * @private
     */
    var token = "";


    /************************************************************** Private - VARIABLES - END *************************************************************/

    /************************************************************** Public - VARIABLES - START ************************************************************/


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    var init = function init() {
        ls = logService;

    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE

    /************************************************************** Public - FUNCTIONS - END **************************************************************/

    /************************************************************** Public - PROPERTIES - START ***********************************************************/


    /**
     * Set the token for the logged in user.
     * @param {string} _token
     *@property
     */
    this.setToken = function setToken(_token) {
        token = _token;
    };
    /**
     * Return the user token
     * @method
     * @returns {string}
     */
    this.getToken = function getToken() {
        return token;
    };
    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/

    init();

}

