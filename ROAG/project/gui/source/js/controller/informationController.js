/**
 * Choose your character or create a new one.
 * @param $scope
 * @param {UIService} uiService
 * @param {UICommunicate} uiCommunicate
 * @param {HelperService} helperService
 * @param {LogService} logService
 * @param InformationController
 * @constructor
 */
function InformationController($scope, uiService, uiCommunicate, helperService, logService, $timeout) {
    /************************************************************** Private - VARIABLES - START ***********************************************************/

    //CODE
    /**
     * Instance of the logService
     * @type {LogService}
     */
    var ls = null;
    var anim = null;
    var pfx = ["webkit", "moz", "MS", "o", ""];
    /************************************************************** Private - VARIABLES - END *************************************************************/


    /************************************************************** Public - VARIABLES - START ************************************************************/

    $scope.showCtrl = false;
    $scope.text = "";

    /************************************************************** Public - VARIABLES - END **************************************************************/


    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
//CODE
    var addAnimEvents = function (element, type, callback) {
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.addEventListener(pfx[p] + type, callback, false);
        }
    };

    var animationListener = function (_e) {
        if (_e.type.toLowerCase().indexOf("animationend") >= 0 && _e.animationName ==="error"){
            //Check if we're in a loop

            if (triggerIds>actualTriggeredId)
            {
                //We got some triggers outsanding
                actualTriggeredId +=1;

                $scope.text = animationCallbacks[actualTriggeredId];
                $(".information").css("display","none");
                $timeout(function(){
                     $(".information").css("display","inline");
                },50,false);


                 // uiService.hideUI(uiService.getUiViews().INFORMATION);
                 // uiService.showUI(uiService.getUiViews().INFORMATION);

            }
            else
            {
                animationIsTriggering=false;
                uiService.hideUI(uiService.getUiViews().INFORMATION);
            }

        }
    };

    var addAnimation=function(_text)
    {

        triggerIds +=1;
        animationCallbacks[triggerIds] =_text;
        if (animationIsTriggering ===false)
        {
            uiService.showUI(uiService.getUiViews().INFORMATION);
            animationIsTriggering=true;
            actualTriggeredId = triggerIds;
            $scope.text = _text;
        }

    };

    /************************************************************** Private - FUNCTIONS - END *************************************************************/


    /************************************************************** Public - FUNCTIONS - START ************************************************************/
//CODE
    $scope.init = function (_data) {
        ls = logService;
        anim = $(".information")[0];


        // animation listener events
        //addAnimEvents(anim, "AnimationStart", AnimationListener);
        //addAnimEvents(anim, "AnimationIteration", AnimationListener);
        addAnimEvents(anim, "AnimationEnd", animationListener);
    };

    /************************************************************** Public - FUNCTIONS - END **************************************************************/


    /************************************************************** Public - EVENTS - START ***************************************************************/

    var actualTriggeredId = 0;
    var triggerIds=0;
    var animationCallbacks={};
    var animationIsTriggering = false;

    /**
     * Called if the window is called up again (if it was not destroyed);
     * Get the characterList again / refresh
     * @event ctrlShow
     */
    $scope.$on("ctrlShow", function (_evt, _data) {

        if (_data && _data.DATA) {
            var data = _data.DATA;
            if (data && data.DATA) {
                addAnimation(data.DATA);
            }
            else {
                addAnimation("Message missing");
            }

        }

    });
    /************************************************************** Public - EVENTS - END ******************************************************************/


}

