/**
 * @class SliderController
 * @static
 * @constructor
 */
function SliderController($scope, uiCommunicateModel, $state) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Slider";
  $rootScope.siteTitle = $scope.pageTitle;
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    homeSlider();
  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function homeSlider(){
    var swiper = new Swiper(".slider .overflow", {
        effect:"slide",
        nextButton: '.forward.btn',
        prevButton: '.back.btn',
        keyboardControl: true
    });
  }
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/


}
