/**
 * @class PasswordRecoveryController
 * @static
 * @constructor
 */
function PasswordRecoveryController($scope, uiCommunicateModel, $state, $rootScope) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Request Your Password";
  $rootScope.siteTitle = $scope.pageTitle;
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    getDefaultLanguage();
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'Password recovery');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Password recovery');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Password recovery');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL +"img/bg_burg.jpg");
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'Request a change of your password, in case you forgot it or want a new one');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'Request a change of your password, in case you forgot it or want a new one');

  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/

  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function validateForm(lang){
    $.validate({
      "form" : '#roa_password_recovery_form',
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
