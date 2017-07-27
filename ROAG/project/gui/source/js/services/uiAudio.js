/**

 * @param AudioService
 * @constructor
 */
function AudioService(logService, uiCommunicate) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    var sounds ={
        HOVER_DROPDOWN:"audio_file.mp3",
        CLICK_DROPDOWN:"audio..."

    };
    var audios = {};

    /************************************************************** Private - VARIABLES - END *************************************************************/

    /************************************************************** Public - VARIABLES - START ************************************************************/



    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    var init = function init()
    {
        ls = logService;

    };

   /**
     * Get the key for the object by the passed value
     * @property getKeyByValue
     * @param {element} _obj - The object
     * @param {object} _value - The value to check
     * @type {string/undefined}
     * @returns {string/undefined} - The key else undefined
     */
    var getKeyByValue = function (_obj, _value) {
        for (var prop in _obj) {
            if (_obj.hasOwnProperty(prop)) {
                if (_obj[ prop ] === _value)
                    return prop;
               // return prop;
            }
        }
        return undefined;
    };

    /**
     * Checks if the sound exists / is playable.
     * @param _sound
     * @returns {boolean}
     */
    var soundExists = function soundExists(_sound)
    {
        if (getKeyByValue(audios,sounds) === undefined)
        {
            return false;
        }
        else
        {
            return true;
        }
    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE

    /**
     * @method
     * @param {string|getSounds} _sound - The sound src.
     */
    this.playSound = function playSound(_sound)
    {
        if (soundExists(_sound))
        {


        }
    };




    /************************************************************** Public - FUNCTIONS - END **************************************************************/

    /************************************************************** Public - PROPERTIES - START ***********************************************************/

    /**
     * Returns all existing playable sounds.
     * @property getSounds
     * @returns {{}}
     */
    this.getSounds = function getSounds()
    {
        return sounds;
    };



    /************************************************************** Public - PROPERTIES - END *************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/

    init();

}

