/**

 * @class LanguageController
 * @static
 * @constructor
 */
function LanguageController($scope, $rootScope, uiCommunicateModel, $state) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    /*uiCommunicateModel.PORTAL_SET_LANGUAGE("de").then(function (_data) {
        //console.log("- French Language")
        //console.log(_data);
    },function(_err){
        //console.log("navigation error");
        //console.log(_err);
    });*/
    uiCommunicateModel.PORTAL_LANGUAGES().then(function (_data){
        $scope.languages = _data.DATA;
        $scope.$broadcast('languageReady');
        getDefaultLanguage();
        //console.log("- Language");
        //console.log(_data);
    },function(_err){
        //console.log("lang error");
        //console.log(_err);
    });
  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /*
    Sets the desired language
    @method setLanguage
    @param {String} languageKey The language key e.g. "de", "en"
  */
  $scope.setLanguage = function(languageKey){
      uiCommunicateModel.PORTAL_SET_LANGUAGE(languageKey).then(function (_data) {
      $scope.defaultLanguage = languageKey;
      angular.forEach($scope.languages, function(value, key) {
        value.active = false;
        if(value.KEY == languageKey) value.active = true;
      });
      $state.go($state.current, {}, {reload: true});
      //console.log("sets language "+languageKey);
      //console.log(_data);
    },function(_err){
      //console.log("language error");
      //console.log(_err);
    });
  }


  /************************************************************** Public - FUNCTIONS - END ***********************************************************/


  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  /*
    Gets the default language
    @method getDefaultLanguage
  */
  function getDefaultLanguage(){
    uiCommunicateModel.PORTAL_GET_LANGUAGE().then(function (_data) {
        $scope.defaultLanguage = _data.DATA.LANGUAGE;
        $scope.$broadcast('dataloaded');
        angular.forEach($scope.languages, function(value, key) {
          value.active = false;
          if(value.KEY == $scope.defaultLanguage) value.active = true;
        });
        //console.log("- Default Language")
        //console.log(_data);
    },function(_err){
        //console.log("default language error");
        //console.log(_err);
    });
  }
  /************************************************************** Private - FUNCTIONS - END *************************************************************/
}
