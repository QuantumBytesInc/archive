function GatheringMiningController($scope, uiService, uiCommunicate, uiCommunicateModel, helperService, logService) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;

    var myBlock = null;

    var delay = 2;
    var startDate = new Date();

    var length = [];
    var speed = 1;

    var y = -190;
    var intV;
    for (var i = 0; i < 381; i++) {
        length.push(y++);
    }

    /**
     * Anzahl der wiederholungen
     */
    var loops = 0;
    /**
     * das ist der echte speed ohne gekipptes Vorzeichen
     */
    var speedReal;

    /**
     * turn ist zum kippen beim erreichen der äußeren Grenzen des Arrays
     */
    var turn = false;
    /**
     * Zählvariable
     */
    var a = 0;

    var running = false;


    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;


    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE

    /************************************************************** Private - FUNCTIONS - END *************************************************************/

    var run = function () {


        /**
         * Eigentlicher loop
         * Für endlosloop einfach while(true) schreiben
         */

        /**
         * Erster Abschnitt von -50 bis 0
         */
        if (length[a] >= -190 && length[a] < 0) {


            speedUp(a);
            speedReal = Math.abs(speed);
            // console.log(speedReal);

        }

        /**
         * Zweiter Abschnitt von 0 bis 50
         */
        if (length[a] > 0 && length[a] <= 190) {


            speedDown(a);
            speedReal = Math.abs(speed);


        }

        if (speedReal > 11600) {
            speedReal = 11600;
        }
        var jumpPixel = (speedReal * 5) / 11600;
        jumpPixel = Math.ceil(jumpPixel);
        //console.log(jumpPixel)
        if (jumpPixel < 1) {
            jumpPixel = 1;
        }
        // console.log((speedReal * 4) / 19899);

        document.getElementById("myBlock").style.left = a + "px";
        /**
         * PERFEKTER 0 PUNKT
         */
        if (length[a] == 0) {
            //console.log(speedReal);
        }
        /**
         * zum kippen beim erreichen der positiven Grenze
         */
        if (length[a] == 190) {
            turn = true;
            loops++;

        }
        /**
         * zum kippen beim erreichen der negativen Grenze
         */
        if (length[a] == -190) {
            turn = false;

        }
        /**
         * inkrement bzw. dekrement für die polinomielle speed Berechnung
         */
        if (turn) {
            a = a - jumpPixel;
            if (a < 0) {
                a = 0;
            }
            //--a;
        } else {
            a = a + jumpPixel;
            if (a > 380) {
                a = 380;
            }
            //a++;
        }
    };
    var speedUp = function (a) {
        speed += Math.abs(length[a]);
    };

    var speedDown = function (a) {
        speed -= Math.abs(length[a]);

    };
    /**
     * @method
     * @private
     */
    var startInterval = function () {
        running = true;
        intV = setInterval(function () {
            var actualDate = new Date();
            if (actualDate - startDate >= delay) {
                startDate = new Date();
                requestAnimationFrame(run);
            }

        }, delay);
    };

    /**
     * @method
     * @private
     */
    var stopInterval = function () {
        running = false;
        clearInterval(intV);
    };
    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    var actualValue = -1;
    $scope.init = function (_data) {
        ls = logService;
        myBlock = $("#myBlock");
        $(document).click(function () {
            ///Value will be resetted outside of this.
            if (actualValue === -1) {

                var actualPos = myBlock.position().left;
                actualPos = actualPos + (myBlock.width() / 2);


                actualValue = Math.ceil((actualPos / 100) * length.length);
                //SEND RESULT TO CPP


            }
        });

    };

    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/

    /**
     * Attach on ui-destroy.
     * @event $destroy
     */
    $scope.$on("$destroy", function () {
        clearInterval(intV);
        actualValue = -1;
    });

    /**
     * Called from uiCommunicate when the player hit in the minigame, this data will be sended.
     * The value will be replaced with the real UI-Data.
     * @event UI_RESULT
     * @param {number} _miningId
     * @param {number} _itemId
     * @param {number} _layerId
     * @constructor
     */
    $scope.UI_RESULT = function UI_RESULT(_miningId, _itemId, _layerId) {

        uiCommunicateModel.GATHERING_RESULT(_miningId, _itemId, _layerId, actualValue).then(function (_data) {
            var data = _data.DATA;
            for (var i = 0; i < data.length; i++) {
                var storage = data.STORAGE;

                for (var y = 0; y < storage.length; y++) {
                    var storageId = storage[y].ID;
                    var items = storage[y].ITEMS;
                    for (var z = 0; z < items.length; z++) {
                        uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().STORAGE_ADD_ITEM, uiCommunicate.createBroadcastData().STORAGE_ADD_ITEM(storageId, items[z]));

                    }
                }

            }
        });
        //Now we can play again.
        actualValue = -1;
    };


    /**
     * Called from uiCommunicate
     * Start the ball moving
     * @event START_MINING
     */
    $scope.START_MINING = function () {
        startInterval();
    };

    /**
     *  Called from uiCommunicate
     * Stops the ball moving
     * @event STOP_MINING
     */
    $scope.STOP_MINING = function () {
        stopInterval();
    };

    /************************************************************** Public - EVENTS - END ******************************************************************/


}

