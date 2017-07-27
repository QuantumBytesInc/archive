/**
 * Inherits all possible data for our broadcastdata
 * @class UIBroadcastData
 * @static
 * @constructor
 */
function UIBroadcastData() {

    /**
     * Generates the taskbar_toggleTorch informations.
     * @param {string} _id
     * @param {boolean} _visible
     * @returns {{STORAGEID: *, VISIBLE: *}}
     */
    function taskbar_toggleStorage(_id,_visible) {
        return {
            STORAGEID:_id,
            VISIBLE: _visible
        }
    }
    function ui_bring_to_front(_uniqueId)
    {
        return {
           UNIQUE_ID:_uniqueId
        }
    }

    /**
     *
     * @param _visible
     * @param _id
     * @returns {{STORAGEID: *, VISIBLE: *}}
     */
    function storage_toggle(_id,_visible) {
        return {
            STORAGEID:_id,
            VISIBLE: _visible
        }
    }

    /**
     *
     * @param _storageId
     * @returns {{STORAGEID: *}}
     */
    function taskbar_registerStorage(_storageId)
    {
          return {
            STORAGEID: _storageId
        }
    }

    /**
     *
     * @param _storageId
     * @returns {{STORAGEID: *}}
     */
    function openBank(_storageId)
    {
        return {
            STORAGEID:_storageId
        }
    }

    /**
     *
     * @param _id
     * @returns {{ID: *}}
     */
    function enteredArea(_id)
    {
        return {
            ID: _id
        }
    }

    /**
     *
     * @param {number} _storageId
     * @param {*} _item
     * @returns {{STORAGEID: *, ITEM: *}}
     */
    function storage_add_item(_storageId,_item)
    {
        return {
            STORAGEID: _storageId,
            ITEM:_item
        }
    }

    return {
        TASKBAR_TOGGLE_STORAGE: taskbar_toggleStorage,
        STORAGE_TOGGLE: storage_toggle,
        TASKBAR_REGISTER_STORAGE: taskbar_registerStorage,
        UI_BRING_TO_FRONT: ui_bring_to_front,
        ENTERED_AREA: enteredArea,
        OPEN_BANK: openBank,
        STORAGE_ADD_ITEM: storage_add_item
    };
}
