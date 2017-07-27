/**
 * Inherits all possible data for our ui controls which needs more complex logic.
 * @class UIControllerData
 * @static
 * @constructor
 */
function UIControllerData() {

    /**
     * Generates the dropdowndata and returns them
     * @method
     * @param {int/float} _from
     * @param {int/float} _to
     * @param {int/float} _step
     * @param {string} _dimension
     * @returns {{from: *, to: *, step: *, dimension: *}}
     */
    function sliderData(_from, _to, _step, _dimension) {
        return {
            from: _from,
            to: _to,
            step: _step,
            dimension: _dimension
        }
    }

    /**
     * Generates the dropdowndata and returns them
     * @method
     * @param {string} _key
     * @param {string} _value
     * @param {boolean} _selected
     * @returns {{key: *, value: *, selected: *}}
     */
    function dropdownData(_key, _value, _selected) {
        return {
            key: _key,
            value: _value,
            selected: _selected
        }
    }


    return {
        sliderData: sliderData,
        dropdownData: dropdownData
    };
}
