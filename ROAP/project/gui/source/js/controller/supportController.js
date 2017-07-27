/**
 * @class SupportController
 * @static
 * @constructor
 */
function SupportController($scope, uiCommunicateModel, $rootScope, $state, notificationManager) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Support";
$rootScope.siteTitle = $scope.pageTitle;
  $scope.myFields;
  $scope.formResponse = {
      "title": "Data has been sent successfully.",
      "subtitle": "You have received an email."
  };
  $scope.showFormResponse = false;
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    $scope.$broadcast('dataloaded');
    getDefaultLanguage();
  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function validateForm() {
    var lang = $scope.defaultLanguage;
    var customLang = {};
    switch(lang) {
      case "en" : customLang = { requiredField: 'This is a required field'  }; break;
      case "pl" : customLang = { requiredField: 'To pole jest wymagane'  }; break;
      case "fr" : customLang = { requiredField: 'Ce champ est obligatoire'  }; break;
      case "it" : customLang = { requiredField: 'Campo obbligatorio'  }; break;
      case "de" : customLang = { requiredField: 'Dies ist ein Pflichtfeld'  }; break;
      default   : customLang = { requiredField: 'This is a required field'  }; break;
    }
    $.validate({
        "form": '#roa_support_form',
        "lang" : lang,
        "language" : customLang,
        onSuccess: function ($form) {
            submitForm();
            return false; // Will stop the submission of the form
        }
    });
  }

  /*
   Gets the default language
   @method getDefaultLanguage
   */
  function getDefaultLanguage() {
      uiCommunicateModel.PORTAL_GET_LANGUAGE().then(function (_data) {
          $scope.defaultLanguage = _data.DATA.LANGUAGE;
          validateForm();
          //console.log("Default Language: ", _data)
      }, function (_err) {
          //console.log("Default language error: ", _err);
      });
  }

  function showServerNotification(msg, type){
    notificationManager.showNotification(msg, type, 2500);
  }

  function submitForm() {
      var f = $scope.myFields;
      //console.log("submit form: ", f);
      uiCommunicateModel.CONTACT_SEND_MAIL(
          f.name,
          f.email,
          f.subject,
          f.message
      ).then(function (_data) {
            //console.log("Register server response: ", _data);
            var obj = codeMap[caller["CONTACT"]][actionMap[caller["CONTACT"]]["SEND_MAIL"]];
            var val = _data.CODE;
            var key = getKeyByValue(obj,val);
            //console.log(key);
            //
            switch(key){
              case "SUCCESSFULLY"                   : $scope.showFormResponse = true; break;
              case "FAILED_BRUTE_FORCE_ATTEMPT"     : showServerNotification("Brute force attempt."); break;
              case "FAILED_SERVER_DOWN"             : showServerNotification("Server down."); break;
              case "FAILED_MAINTENANCE"             : showServerNotification("Server Maintenance."); break;
              case "FAILED_MISC"                    : showServerNotification("Misc error occured."); break;
            }
          }, function (_err) {
              //console.log("register server error: ", _err);
          });

  }
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/



}
