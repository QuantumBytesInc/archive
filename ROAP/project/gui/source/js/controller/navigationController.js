/**
 * @class NavigationController
 * @static
 * @constructor
 */
function NavigationController($scope, uiCommunicateModel, $state, $location) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Navigation";
  $scope.navigationEntries = [
    {name:"Game"},
    {name:"News"},
    {name:"Features"},
    {name:"Lore"},
    {name:"Dev"},
    {name:"Forum"},
    {name:"Status"},
    {name:"About",
    subnav: [
      {name:"FAQ"},
      {name:"Support"},
      {name:"Information"},
      {name:"Media"},
      {name:"Press"},
      {name:"Profile"},
      {name:"Hub"}
    ]}
  ];
  /************************************************************** Public - VARIABLES - END ***********************************************************/

  $scope.init = function () {
    navigationActives();
    navigationEffects();
    mobileNavigation();
    logo();
  }


  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  $scope.$on("close-navigation", function(event, data){
    closeMobileNavigation();
  });
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function logo(){
    $(".main .navi .logo").click(function(){
      closeMobileNavigation();
    });
  }
  function navigationActives(){
        /*var currentStateName = $state.current.name;
        $(".main .navi ul > li").each(function(i, elem) {
          $(elem).closest("li[name*='"+currentStateName+"']").addClass("act");
        });*/
        /*$(".main .navi ul > li > a").unbind("click").bind("click", function(){
            $(".main .navi ul > li").removeClass("act");
            $(this).parents("li").addClass("act");
        });*/
    }
  function navigationEffects(){
      $(".main .navi .destkopNav > ul.desktop > li").hover(function(){
          $(this).find(">ul").stop(1,0).slideDown(300);
      }, function(){
          $(this).find(">ul").stop(1,0).slideUp(300);
      });
  }
  function mobileNavigation(){
      $(".main .navi .mobile_burger").unbind("click").bind("click", function(){
          $(".main .navi .mobile_nav").stop(0,1).slideToggle(500);
          $(this).toggleClass("active");
          //
          if ($(this).hasClass("active")) $(".mobile_share").hide();
          else $(".mobile_share").show();
          //
          $(".main .mobile_nav li").each(function(){
            if($(this).hasClass("open")) $(this).find(">ul").stop(0,1).slideDown(10);
          });
      });
      $(".main .mobile_nav li > .arrow").unbind("click").bind("click", function(){
         $(this).parents("li").toggleClass("open");
         $(this).parents("li").find("ul").stop(0,1).slideToggle(300);
      });
      $(".main .navi .mobile_nav li a").unbind("click").bind("click", function(){
          $(".main .navi .mobile_nav").stop(0,1).slideToggle(500);
          $("html, body").stop(0,1).animate({ scrollTop: 0 }, 500);
      });
  }
  function closeMobileNavigation(){
    // close nav
    $(".main .navi .mobile_nav").stop(0,1).slideUp(500);
    $(".main .navi .mobile_burger").removeClass("active");
    // close subnav
    $(".main .mobile_nav li").removeClass("open");
    $(".main .mobile_nav li ul").stop(0,1).slideUp(300);
  }
  /************************************************************** Private - FUNCTIONS - END ***********************************************************/

}
