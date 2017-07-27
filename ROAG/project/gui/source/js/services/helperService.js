/**
 * Inherits...
 * @class HelperService
 * @static
 * @constructor
 */
function HelperService($translate) {

    /** Private Variable **/

    /**
     * @type HelperService
     * @private
     */
    var me;

    var popupBox;
    /** Private Properties Start **/
    var init = function () {
        me = this;
        popupBox = $("#popupBox");
    };

    /** Private Properties End **/

    /**
     /** Public Properties **/

    /***
     * Checks if we're currently on web-development or on live (code handling)
     * @property isWebDevelopment
     * @readOnly
     * @returns {boolean}
     */
    this.isWeb = function () {

        if (engine.call("ShareJson").result !== null) {
            return false;
        }
        return true;
    };


    /**
     * Checks if we're actual on the DEV-UI or not.
     * @returns {boolean}
     */
    this.isDevUI = function isDevUI() {
        return (window.location.hostname != "gui.annorath-game.com");
    };

    /**
     * Returns all possible Popuptypes
     * @property getPopupTypes
     * @type {element}
     * @returns {{WAIT: string, WARN: string}}
     */
    this.getPopupTypes = function () {
        return {
            "WAIT": "WAIT",
            "WARN": "WARN"
        };
    };

    /**
     * Translate the passed key
     * @method
     * @param {string} _key - The key
     * @returns {string}
     */
    this.translate = function (_key) {
        return $translate.instant(_key);
    };

    /**
     * Brings up the popup
     * @method
     * @param {{type: string, title: string, message: string, button: string, translate: boolean, callback: callback}} _options
     */
    this.showPopup = function (_options) {

        var base = this;
        var options = _options;

        var popupType = options.type || base.getPopupTypes().WAIT;
        var title = options.title || "";
        var message = options.message || "";
        var buttonText = options.button || "";
        var translate = options.translate || true;
        var callback = options.callback || function () {
            };

        var symbolEle = popupBox.find("[data-roa-id='symbol']");
        var titleEle = popupBox.find("[data-roa-id='title']");
        var messageEle = popupBox.find("[data-roa-id='message']");
        var buttonEle = popupBox.find("[data-roa-id='button']");

        if (translate === true) {
            title = base.translate(title);
            message = base.translate(message);
            buttonText = base.translate(buttonText);
        }

        symbolEle.attr("css", "symbol").addClass(popupType);
        titleEle.html(title);
        messageEle.html(message);

        if (buttonText !== "") {
            buttonEle.show();

            buttonEle.val(buttonText);

            buttonEle.off("click").click(
                function () {
                    popupBox.hide();
                    callback();
                });
        }
        else {
            buttonEle.hide();
        }

        popupBox.show();


    };

    /**
     * Hides the Popup
     * @method
     */
    this.hidePopup = function () {
        popupBox.hide();
    };


    /** Public Properties End **/

    init();
}