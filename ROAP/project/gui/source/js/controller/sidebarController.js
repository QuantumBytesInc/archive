/**
 * @class SidebarController
 * @static
 * @constructor
 */
function SidebarController($scope, uiCommunicateModel, $state) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Sidebar";
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    scrollingSidebar();
  }

  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function scrollingSidebar(){
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        var sidebarOffset = 135;
        var headerHeight = 185;
        var sliderHeight = $(".slide-wrapper .slider").length ? $(".slide-wrapper .slider").height() + 20 : 0;
        var contentHeight = $(".main .content").height();
        var limit = headerHeight + sliderHeight;
        var limit2 = limit + contentHeight - 120;
        //
        var sidebar = $(".main .content .left");
        if(scroll > limit) {
            sidebar.css("top",scroll - limit - sidebarOffset+"px");
            sidebar.removeClass("normal");
            /*if(scroll > limit2){
                sidebar.css("top",limit2 - 580+"px");
            }*/
        }
        else {
             sidebar.addClass("normal");
        }
    });
  }
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/

}
