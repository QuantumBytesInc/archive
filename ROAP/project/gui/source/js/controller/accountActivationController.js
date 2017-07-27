/**
 * @class AccountActivationController
 * @static
 * @constructor
 */
function AccountActivationController($scope, uiCommunicateModel, $rootScope, $state) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Account Activation";
  $rootScope.siteTitle = $scope.pageTitle;
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    getDefaultLanguage();
  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function validateForm(lang){
    $.validate({
      "form" : '#roa_account_activation_form',
      "lang" : lang
    });
  }

  /*
    Gets the default language
    @method getDefaultLanguage
  */
  function getDefaultLanguage(){
    uiCommunicateModel.PORTAL_GET_LANGUAGE().then(function (_data) {
        $scope.defaultLanguage = _data.DATA.LANGUAGE;
        validateForm(_data.DATA.LANGUAGE);
        //
        //console.log("- Default Language")
        //console.log(_data);
    },function(_err){
        //console.log("default language error");
        //console.log(_err);
    });
  }
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/
}
