/**
 * Inherits all possible data for our channel-communication
 * @class UIChannelData
 * @static
 * @constructor
 */
function UIChannelData() {

    /**
     * Channel name to get
     * @param _name
     * @returns {{NAME: *}}
     */
    function getChannelName(_name) {
        return {
            NAME: _name
        }
    }

    /**
     * Heartbeat message
     * @property heartbeat
     * @returns {{}}
     */
    function heartbeat()
    {
        return {

        };
    }

    /**
     * @property getList
     * @returns {{}}
     * @constructor
     */
    function getList()
    {
        return {};
    }


    return {
        GET_CHANNEL_NAME: getChannelName,
        GET_LIST: getList,
        HEARTBEAT: heartbeat
    };
}
