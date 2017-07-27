/**
 * @class ProfileController
 * @static
 * @constructor
 */
function ProfileController($scope, $rootScope, uiCommunicateModel, $state, $window, notificationManager) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Profile";
  $rootScope.siteTitle = $scope.pageTitle;
  $scope.myFields;
  $scope.countries;
  $scope.languages;
  $scope.showFormResponse = false;
  $scope.formResponse = {
      "title": "You have edited your profile.",
      "subtitle": "Data has been sent successfully."
  };
  $scope.noAccess;
  $scope.noAcessResponse = {
    title : "No access granted.",
    subtitle : "Please log in to modify your profile."
  }
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    datepicker();
    getDefaultLanguage();
    getLanguages();
    getCountries();
    getUserData();

        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, 'Profile');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, 'Profile');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Profile');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, $scope.guiURL +"img/bg_burg.jpg");
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, 'Change your contact information and other info');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, 'Change your contact information and other info');

  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/

  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function datepicker() {
      $("form .date_input").pickadate({
        format: 'yyyy-mm-dd',
        onSet : function(){ $('.date_input').trigger("blur"); },
        selectYears: 190,
        selectMonths: true
      });
  }

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
        "form": '#roa_profile_form',
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
  function getDefaultLanguage(){
    uiCommunicateModel.PORTAL_GET_LANGUAGE().then(function (_data) {
        $scope.defaultLanguage = _data.DATA.LANGUAGE;
        validateForm(_data.DATA.LANGUAGE);
        //console.log("Default Language: ", _data)
    },function(_err){
        //console.log("default language error: ", _err);
    });
  }

  function getUserData(){
    uiCommunicateModel.CUSTOMER_DATA().then(function(_data){
        //console.log("customer data..",_data);
        var obj = codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["DATA"]];
        var val = _data.CODE;
        var action = getKeyByValue(obj, val);
        switch(action){
          case "SUCCESSFULLY" : displayUserData(_data.DATA); break;
          case "FAILED_NOT_LOGGED_IN" : $state.go("game"); $scope.noAccess = true; break;
          case "FAILED_USER_NOT_FOUND" : $state.go("game"); $scope.noAccess = true; break;
        }
    }, function(_err){
      //console.log("customer data err..", _err);
    })
  }

  function displayUserData(userData){
    $scope.myFields = {
      firstname     : userData.FIRST_NAME,
      lastname      : userData.LAST_NAME,
      username      : userData.USERNAME,
      email         : userData.EMAIL,
      street        : userData.STREET,
      city          : userData.CITY,
      zip           : userData.ZIPCODE,
      state         : userData.STATE,
      sex           : userData.SEX,
      language      : userData.LANGUAGE,
      country       : userData.COUNTRY,
      birthdate     : userData.BIRTH_DATE
    };
  }

  /**
   * Get the key for the object by the passed value
   * @property getKeyByValue
   * @param {element} _obj - The object
   * @param {object} _value - The value to check
   * @type {string/undefined}
   * @returns {string/undefined} - The key else undefined
   */
  function getKeyByValue(_obj, _value) {
      for (var prop in _obj) {
          if (_obj.hasOwnProperty(prop)) {
              if (_obj[prop] === _value)
                  return prop;
              // return prop;
          }
      }
      return undefined;
  };

  /* gets languages from server */
  function getLanguages(){
    uiCommunicateModel.CUSTOMER_LANGUAGES().then(function (_data) {
        $scope.languages = _data.DATA;
    });
  }

  /* gets countries from server */
  function getCountries(){
    uiCommunicateModel.CUSTOMER_COUNTRIES().then(function (_data) {
      $scope.countries = _data.DATA;
   });
 }


 function showServerError(input_id, msg){
   $("input#"+input_id).parents(".block").addClass("has-error");
   $("input#"+input_id).parents(".block").append("<span class='help-block form-error'>"+msg+"</span>");
   $("html, body").animate({ scrollTop: 0 }, 200);
 }

 function showServerNotification(msg, type){
   notificationManager.showNotification(msg, type, 2500);
 }

  function submitForm() {
      var f = $scope.myFields;
      //console.log("submit form: ", f);
      uiCommunicateModel.CUSTOMER_MODIFY(
          f.country,
          f.city,
          f.state,
          f.street,
          f.zip,
          f.birthdate,
          f.sex,
          f.language,
          f.username,
          f.firstname,
          f.lastname,
          f.email
      ).then(function (_data) {
            //console.log(_data);
            var obj = codeMap[caller["CUSTOMER"]][actionMap[caller["CUSTOMER"]]["MODIFY"]];
            var val = _data.CODE;
            var key = getKeyByValue(obj,val);
            //console.log(key);
            //
            switch(key){
               case "SUCCESSFULLY"                  : showServerNotification("Profile successfully edited!", "success");  $scope.showFormResponse = true; break;
               case "COUNTRY_NOT_FOUND"             : showServerError("country", "Country not found."); break;
               case "CITY_TO_LONG"                  : showServerError("city", "City too long."); break;
               case "CITY_EMPTY"                    : showServerError("city", "City is empty."); break;
               case "CITY_INVALID"                  : showServerError("city", "City is invalid."); break;
               case "STATE_TO_LONG"                 : showServerError("state", "State is too long."); break;
               case "STATE_EMPTY"                   : showServerError("state", "State is empty."); break;
               case "STATE_INVALID"                 : showServerError("state", "State is invalid."); break;
               case "STREET_TO_LONG"                : showServerError("street", "Street is too long."); break;
               case "STREET_EMPTY"                  : showServerError("street", "Street is empty."); break;
               case "STREET_INVALID"                : showServerError("street", "Street is invalid."); break;
               case "ZIPCODE_TO_LONG"               : showServerError("zip", "Zip is too long"); break;
               case "ZIPCODE_EMPTY"                 : showServerError("zip", "Zip is empty."); break;
               case "ZIPCODE_INVALID"               : showServerError("zip", "Zip is invalid."); break;
               case "BIRTH_DATE_INVALID"            : showServerError("birthdate", "Birthdate is invalid."); break;
               case "SEX_INVALID"                   : showServerError("sex", "Sex is invalid."); break;
               case "LANGUAGE_NOT_FOUND"            : showServerError("langugage", "Language not found."); break;
               //case "PREREQUISITES_INVALID"
               case "USERNAME_TO_LONG"              : showServerError("username", "Username is too long."); break;
               case "USERNAME_EMPTY"                : showServerError("username", "Username is empty."); break;
               case "USERNAME_INVALID"              : showServerError("username", "Username is invalid."); break;
               case "USERNAME_TAKEN"                : showServerError("username", "Username is taken."); break;
               case "FIRST_NAME_TO_LONG"            : showServerError("firstname", "Firstname is too long"); break;
               case "FIRST_NAME_EMPTY"              : showServerError("firstname", "Firstname is empty."); break;
               case "FIRST_NAME_INVALID"            : showServerError("firstname", "Firstname is invalid."); break;
               case "LAST_NAME_TO_LONG"             : showServerError("lastname", "Lastname is too long."); break;
               case "LAST_NAME_EMPTY"               : showServerError("lastname", "Lastname is empty."); break;
               case "LAST_NAME_INVALID"             : showServerError("lastname", "Lastname is invalid."); break;
               case "EMAIL_INVALID"                 : showServerError("email", "Email is invalid."); break;
               case "EMAIL_TAKEN"                   : showServerError("email", "Email is taken"); break;
               case "FAILED_MISC"                   : showServerNotification("Misc error occured."); break;
               case "USER_NOT_FOUND"                : showServerNotification("User not found."); break;
               case "NEEDS_REACTIVATION":
                   showServerNotification("Needs reactivation, you'll be logged out now", "success");
                   setTimeout(function ()
                   {
                       window.location.href = "/accounts/logout/";
                   },2000);

                   break;
            }

          }, function (_err) {
              //console.log(_err);
          });

  }
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/
}
