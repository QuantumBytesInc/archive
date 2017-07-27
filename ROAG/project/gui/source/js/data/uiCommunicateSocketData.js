/**
 * Inherits all DATA which will be send to the websockets on django side.
 * Use this class to handle your data-object to save the integration
 * @class UICommunicateSocketData
 * @static
 * @constructor
 */
function UICommunicateSocketData() {

    var communicateActions = {};
    communicateActions.STORAGE = {};
    communicateActions.CHANNEL = {};

    /**
     * Generates the channel send data
     * @method
     * @param {string} _message
     * @returns {{_message: string}}
     */
    communicateActions.CHANNEL.SEND = function (_message) {
        return {
            MESSAGE: _message
        }
    };


    /**
     *
     * @param {number} _itemId
     * @param {number} _storageId
     * @param {number} _sourceSlot
     * @param {number} _targetSlot
     * @returns {{ITEM: *, STORAGE: *, SLOT_SOURCE: *, SLOT_TARGET: *}}
     * @constructor
     */
    communicateActions.STORAGE.SWAP_ITEM = function (_itemId, _storageId, _sourceSlot, _targetSlot) {
        return {
            ITEM: _itemId,
            STORAGE: _storageId,
            SLOT_SOURCE: _sourceSlot,
            SLOT_TARGET: _targetSlot
        }

    };
    /**
     *
     * @param {number[]} _itemIds
     * @param {number} _sourceStorage
     * @param {number} _targetStorage
     * @param {number} _sourceSlot
     * @param {number} _targetSlot
     * @returns {{ITEM_IDS: *, STORAGE_SOURCE: *, STORAGE_TARGET: *, SLOT_SOURCE: *, SLOT_TARGET: *}}
     * @constructor
     */
    communicateActions.STORAGE.STACK_ITEM = function (_itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
        return {
            ITEM_IDS: _itemIds,
            STORAGE_SOURCE: _sourceStorage,
            STORAGE_TARGET: _targetStorage,
            SLOT_SOURCE: _sourceSlot,
            SLOT_TARGET: _targetSlot
        }

    };

    /**
     *
     * @param {number[]} _itemIds
     * @param {number} _sourceStorage
     * @param {number} _targetStorage
     * @param {number} _sourceSlot
     * @param {number} _targetSlot
     * @returns {{ITEM_IDS: *, STORAGE_SOURCE: *, STORAGE_TARGET: *, SLOT_SOURCE: *, SLOT_TARGET: *}}
     * @constructor
     */
    communicateActions.STORAGE.UNSTACK_ITEM = function (_itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
        return {
            ITEM_IDS: _itemIds,
            STORAGE_SOURCE: _sourceStorage,
            STORAGE_TARGET: _targetStorage,
            SLOT_SOURCE: _sourceSlot,
            SLOT_TARGET: _targetSlot
        }

    };


    /**
     *
     * @param {number} _itemId
     * @param {number} _sourceStorage
     * @param {number} _targetStorage
     * @param {number} _sourceSlot
     * @param {number} _targetSlot
     * @returns {{ITEM: *, STORAGE_SOURCE: *, STORAGE_TARGET: *, SLOT_SOURCE: *, SLOT_TARGET: *}}
     * @constructor
     */
    communicateActions.STORAGE.MOVE = function (_itemId, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
        return {
            ITEM: _itemId,
            STORAGE_SOURCE: _sourceStorage,
            STORAGE_TARGET: _targetStorage,
            SLOT_SOURCE: _sourceSlot,
            SLOT_TARGET: _targetSlot
        }

    };


    /**
     * Creates the storage GET_EQUIPPED_BAGS with the passed data
     * @method
     * @returns {}}
     * @constructor
     */
    communicateActions.STORAGE.GET_EQUIPPED_BAGS = function () {
        return {};
    };

    /**
     * Creates the storage GET_DETAILS data
     * @method
     * @param _id
     * @returns {{ID: *}}
     * @constructor
     */
    communicateActions.STORAGE.GET_DETAILS = function (_id) {
        return {
            ID: _id
        };
    };


    /**
     *
     * @return {{CHANNEL_SEND: (*)}}
     */
    var returns = {
        CHANNEL_SEND: communicateActions.CHANNEL.SEND,
        STORAGE_SWAP_ITEM: communicateActions.STORAGE.SWAP_ITEM,
        STORAGE_MOVE: communicateActions.STORAGE.MOVE,
        STORAGE_STACK_ITEM: communicateActions.STORAGE.STACK_ITEM,
        STORAGE_UNSTACK_ITEM: communicateActions.STORAGE.UNSTACK_ITEM,
        STORAGE_GET_EQUIPPED_BAGS: communicateActions.STORAGE.GET_EQUIPPED_BAGS,

        STORAGE_GET_DETAILS: communicateActions.STORAGE.GET_DETAILS,
    };

    return returns;
}
