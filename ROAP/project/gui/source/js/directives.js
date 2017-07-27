angular.module('App.directives', []).directive('slider', function() {
  return {
    restrict: 'E',
    templateUrl: amazonURL + 'gui/partials/slider.html'
  };
}).directive('navigation', function() {
  return {
    restrict: 'E',
    templateUrl: amazonURL + 'gui/partials/navigation.html'
  };
}).directive('sidebar', function() {
  return {
    restrict: 'E',
    templateUrl: amazonURL + 'gui/partials/sidebar.html'
  };
}).directive('languages', function() {
  return {
    restrict: 'E',
    templateUrl: amazonURL + 'gui/partials/languages.html'
  };
}).directive('socialshare', function() {
  return {
    restrict: 'E',
    templateUrl: amazonURL + 'gui/partials/socialshare.html'
  };
}).directive('languageFunctions', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
      link: function ($scope, element, attrs) {
            $scope.$on('languageReady', function () {
              $timeout(function () {
                mobileLanguages();
                languageBoard();
                //
                function mobileLanguages(){
                    $(".allLangs").unbind("click").bind("click", function() {
                        $(".navi div.mobile_lang .txt:gt(0),.navi div.mobile_lang .txt:first ").slideToggle()
                    });
                }
                function languageBoard(){
                  $(".site_header .btn.language").unbind("mouseenter").unbind("mouseleave").bind({
                    mouseenter: function(){
                      $(this).find(".languageBoard").stop(1,0).slideDown(300);
                      $(this).addClass("act");
                  }, mouseleave: function(){
                      $(this).find(".languageBoard").stop(0,1).slideUp(300);
                      $(this).removeClass("act");
                  }});
                  $(".languageBoard .language").click(function(){
                    $(this).parents(".languageBoard").stop(0,1).slideUp(300, function(){
                      $rootScope.$broadcast("close-navigation");
                      $(".site_header .btn.language").removeClass("act");
                    });
                  });
                  $(".site_header .btn.language .mobileTouchArea").unbind("click").bind("click", function(){
                    $(this).parents(".btn.language").find(".languageBoard").stop(1,0).slideDown(300);
                    $(this).parents(".btn.language").find(".languageBoard").addClass("act");
                  });
                }

              }, 0, false);
          })
      }
  };
}]).directive('featureBoxes', ['$timeout', function ($timeout) {
    return {
      link: function ($scope, element, attrs) {
            $scope.$on('dataloaded', function () {
              $timeout(function () {
                //
                featureBoxHover();
                featureBoxClick();
                featureMobBoxClick();
                //
                function featureBoxHover(){
                  $(".feature_list .box").unbind("mouseenter").unbind("mouseleave").bind({ mouseenter: function(){
                      $(this).addClass("hover");
                      $(this).find(".overlay").stop(0,1).animate({bottom: 0}, 300, function(){});
                      //
                      $(this).find(".overlay .siblings > a").css("opacity",0).css("left","-80px");
                      $(this).find(".overlay .siblings > a").each(function(i){
                          $(this).delay(100+80*i).animate({left: "0", opacity:1}, {duration: 500}, function(){});
                      });
                  }, mouseleave: function(){
                      $(this).removeClass("hover");
                      $(this).find(".overlay").stop(0,1).animate({bottom: "-125px"}, 300, function(){});
                  }});
                }

                function featureBoxClick(){
                  $(".feature_list .box .opener").click(function(event) {
                  if (windowsize >= 780)  {$(this).find(".overlay").stop(0,1).animate({bottom: 0}, 300, function(){})}
                  });
                }

                function featureMobBoxClick(){
                  $(".feature_list .mobile_overlay").click(function(event) {
                   if (windowsize <= 780) {
                      $(this).parents(".box").find(".overlay .standardLinkWrap").show();
                      $(this).hide();
                      $(this).find(".overlay").stop(0,1).animate({top: 30}, 300, function(){})
                      $(".feature_list .box .opener").removeClass('open');
                      $(this).toggleClass('open');
                    }
                  });
                }


              var windowsize = $(window).width();
              $(window).resize(function() {
                windowsize = $(window).width();
                if (windowsize <= 780) {
                  $(".feature_list .mobile_overlay").show();
                }
                else {
                  $(".feature_list .mobile_overlay").hide();
                }
              });

              }, 0, false);
          })
      }
  };
}]).directive('featureDetailSlider', ['$timeout', function ($timeout) {
    return {
      link: function ($scope, element, attrs) {
            $scope.$on('dataloaded', function () {
              $timeout(function () {
                sliderClick();
                //
                function sliderClick(){
                  $(".feature_detail .slides .slide").unbind("click").bind("click", function(e){
                      $(this).toggleClass("clicked");
                  });
                }
              }, 0, false);
          })
      }
  };
}]).directive('qbBackgroundSrc', function () {
  var qbBackgroundSrc = {
    link: function postLink(scope, element, attrs) {
        if (!scope.$root.isMobile())
        {
            angular.element(element).attr("src", attrs.qbBackgroundSrc);
        }

    }
   };
   return qbBackgroundSrc;
});
;
