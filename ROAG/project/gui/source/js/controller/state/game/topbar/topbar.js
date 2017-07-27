/**
 * Choose your character or create a new one.
 * @param {$scope} $scope
 * @param {$interval} $interval
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateModel} uiCommunicateModel
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @param {UISocket} uiSocket
 * @param {UICommunicateSocketModel} uiCommunicateSocketModel
 * @param CharSelectionController
 * @constructor
 */
function TopbarController($scope, $interval, uiService, uiCommunicate, uiCommunicateModel, helperService, logService, uiSocket, uiCommunicateSocketModel) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;
    $scope.date = "";
    $scope.time = "";
    $scope.weather = "";

    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    var intervalPromise;
    /**
     * Called every 15 seconds.
     * @event calculateIngameTime
     */
    var calculateIngameTime = function calculateIngameTime() {
        var time = $scope.time;
        var splittedTime = time.split(":");
        var hours = parseInt(splittedTime[0]);
        //Count minute + 1 after 15 seconds
        var minutes = parseInt(splittedTime[1]);
        if ((minutes + 1) >= 60) {
            if ((hours + 1) >= 24) {
                hours = "00";
            }
            else {
                if ((parseInt(hours) + 1) < 10) {
                    hours = "0" + (parseInt(hours) + 1);
                }
                else {
                    hours += 1;
                }
            }
            minutes = "00";
        }
        else {


            if (parseInt(hours) < 10) {
                hours = "0" + parseInt(hours);
            }


            if ((parseInt(minutes) + 1 ) < 10) {
                minutes = "0" + (parseInt(minutes) + 1);
            }
            else {
                minutes += 1;
            }
        }
        $scope.time = hours + ":" + minutes;
    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    $scope.init = function (_data) {
        ls = logService;
        uiCommunicateModel.SYNC_TIME_WEATHER(false, {}).then(function (_data) {
            //Just once on startup;
            var data = _data;
            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    $scope.date = data.DATA.date;
                    $scope.time = data.DATA.time;

                    $scope.weather = data.DATA.name;
                    intervalPromise = $interval(calculateIngameTime, 15000);
                    uiCommunicateModel.SYNC_TIME_WEATHER(true, data).then(function (_data) {
                        ls.logTRC("Weather send to unigine - initial");
                    });
                    break;
            }


        });

        uiCommunicateModel.CHANNEL_GET_BY_NAME(uiCommunicateSocketModel.getChannelNames().SYNC).then(function (_data) {

            var data = _data;
            var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);

            switch (data.CODE) {
                case code.SUCCESSFULLY:
                    var channelId = data.DATA.id;
                    uiSocket.createChannel(channelId).then(function (_url) {
                            uiSocket.listen(_url, function (_message) {
                                var data = _message;
                                $scope.$apply(function () {
                                    var code = uiCommunicate.getCodeMap(data.CALLER, data.ACTION);
                                    switch (data.CALLER) {
                                        case uiCommunicate.getCaller().SYNC:

                                            var jsonAction = actionMap[data.CALLER];
                                            switch (data.ACTION) {
                                                case jsonAction.TIME_WEATHER:
                                                    switch (data.CODE) {
                                                        case code.SUCCESSFULLY:
                                                            $interval.cancel(intervalPromise);
                                                            $scope.date = data.DATA.date;
                                                            $scope.time = data.DATA.time;
                                                            $scope.weather = data.DATA.name;
                                                            intervalPromise = $interval(calculateIngameTime, 15000);

                                                            uiCommunicateModel.SYNC_TIME_WEATHER(true, _message).then(function (_data) {
                                                                ls.logTRC("Weather send to unigine - Websocket");
                                                            });
                                                            break;

                                                    }
                                                    break;
                                                case jsonAction.SPAWN_RESOURCES:
                                                    switch (data.CODE) {
                                                        case code.SUCCESSFULLY:
                                                            uiCommunicateModel.SPAWN_RESOURCES(_message).then(function (_data) {
                                                                ls.logTRC("Sync spawn_resources send to unigine - Websocket");
                                                            });
                                                            break;

                                                    }
                                                    break;

                                                case jsonAction.DESPAWN_RESOURCES:
                                                    switch (data.CODE) {
                                                        case code.SUCCESSFULLY:
                                                            uiCommunicateModel.DESPAWN_RESOURCES(_message).then(function (_data) {
                                                                ls.logTRC("Sync despawn resources send to unigine - Websocket");
                                                            });
                                                            break;

                                                    }
                                                    break;
                                            }
                                    }

                                })

                            });
                        },
                        function (_error) {
                            ls.logERR("Channel couldn't be initialzed.");
                        });
                    break;

            }


        });


    };

    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/


    /************************************************************** Public - EVENTS - END ******************************************************************/


}

