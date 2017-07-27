/**
 * @class FeatureDetailController
 * @static
 * @constructor
 */
function FeatureDetailController($scope, $rootScope, uiCommunicateModel, metatagFormatter, $location, $state, $stateParams) {
  /************************************************************** Public - VARIABLES - START ***********************************************************/
  $scope.guiURL = amazonURL + "gui/";
  $scope.pageTitle = "Features";
  $scope.dataLoaded = false;
  $scope.swiper = null;
  $scope.swipped = false;
  $scope.showDownloadOverlay = false;
  $scope.tutorialOverlay = false;
  /************************************************************** Public - VARIABLES - END ***********************************************************/



  $scope.init = function () {

    if(localStorage.getItem("roap_tutorial_overlay")){
        $scope.tutorialOverlay = false;
    }
    else{
      $scope.tutorialOverlay = true;
      localStorage.setItem("roap_tutorial_overlay", 1);
    }
    $scope.swipped = false;

    uiCommunicateModel.FEATURES_FEATURE($stateParams.featureID,$stateParams.partID).then(function (_data){
        $scope.featureDetail = _data.DATA;
        $scope.$broadcast('dataloaded');
        $scope.dataLoaded = true;
        //
        setMetatags($scope.featureDetail.FEATURE_ID, $scope.featureDetail.PART);
        //
        //console.log("- Features feature "+$stateParams.featureID+" "+$stateParams.partID);
        //console.log(_data);
    },function(_err){
        //console.log("feature error");
        //console.log(_err);
    });
  }

  $scope.initSlider = function () {
    initSlider();
    if(!$scope.swipped){
      var partID = parseInt($stateParams.partID);
      $scope.mySwiper.slideTo(partID-1, 1, false);
    }
  }

  /*
    @method getFeatureObject
    @param {String} mode Either "exact", "next" or "prev"
    @return {Object} Returns the corresponding Feature Object.
  */
  $scope.getFeatureObject = function(mode){
    if(!$scope.featureDetail) return;
    var index;
    for(var i = 0; i < $scope.featureDetail.PARENT_FEATURES.length; i++){
      if($scope.featureDetail.PARENT_FEATURES[i].ID == $scope.featureDetail.SIBLINGS[0].PARENT_ID) {index = i; break;}
    }
    if(mode == "exact") return $scope.featureDetail.PARENT_FEATURES[index];
    //
    var maxLength = $scope.featureDetail.PARENT_FEATURES.length-1;
    if(index == 0 && mode == "prev") return $scope.featureDetail.PARENT_FEATURES[maxLength];
    else if(index == maxLength && mode == "next") return $scope.featureDetail.PARENT_FEATURES[0];
    else{
      if(mode=="next") return $scope.featureDetail.PARENT_FEATURES[++index];
      if(mode=="prev") return $scope.featureDetail.PARENT_FEATURES[--index];
    }
  }


  /*
    @method getPartID
    @param {String} mode Either "exact", "next" or "prev"
    @return {Number} Returns the corresponding Feature ID.
  */
  $scope.getPartID = function(mode){
    if(!$scope.featureDetail) return;
    var part = parseInt($scope.featureDetail.PART);
    if(mode == "exact") return part;
    var maxLength = $scope.featureDetail.PARTS;
    if(part == 1 && mode == "prev") return maxLength;
    else if(part == maxLength && mode == "next") return 1;
    else{
      if(mode == "next") return ++part;
      if(mode == "prev") return --part;
    }
  }

  $scope.navigateTo = function(params){
    $state.go("featureDetail", params, {reload:false, inherit:false });
  }

  /*
    Fires an AJAX call and gets the relevant data from the server.
    @method getFeatureDetail
  */
  $scope.getFeatureDetail = function(){
    //console.log("getFeatureDetail");
    //console.log($stateParams.featureID);
    //console.log($stateParams.partID);
    uiCommunicateModel.FEATURES_FEATURE($stateParams.featureID,$stateParams.partID).then(function (_data){
        $scope.featureDetail = _data.DATA;
        $scope.$broadcast('dataloaded');
        //console.log("- Features feature "+$stateParams.featureID+" "+$stateParams.partID);
        //console.log(_data);
    },function(_err){
        //console.log("feature error");
        //console.log(_err);
    });
  }

    /*
    Gets a feature sibling by feature ID
    @method getFeatureById
    @param {String} featureID The feature ID
    @return {Object} Returns feature sibling
  */
  $scope.getFeatureById = function(featureID){
    for(var i = 0; i < $scope.featureDetail.SIBLINGS.length; i++){
      if($scope.featureDetail.SIBLINGS[i].ID == featureID) return $scope.featureDetail.SIBLINGS[i];
    }
  }

  /*
    Checks if the feature id matches the current active feature.
    @method isActiveFeature
    @param {String} featureID The feature ID
    @return {Boolean} Returns true on success
  */
  $scope.isActiveFeature = function(featureID){
    var returnBool = false;
    if(featureID == $scope.featureDetail.FEATURE_ID) returnBool = true;
    return returnBool;
  }

   $scope.navigateToSubFeature = function(featureID, partID) {
    var stateParams = {"featureID": featureID, "partID": partID};
    $state.transitionTo("featureDetail", stateParams, {'location':true, 'inherit':true, "relative": $state.$current, 'reload': false, 'notify':false }).then(function(){
      $scope.init();
    });
  }

  $scope.clickSlide = function(){
    if($scope.tutorialOverlay)  $(".feature_detail .slides .slide").removeClass("clicked");
    $scope.tutorialOverlay = false;
  }
  $scope.clickArrow = function(){
    $scope.tutorialOverlay = false;
  }


  /************************************************************** Public - FUNCTIONS - START ***********************************************************/
  /************************************************************** Public - FUNCTIONS - END ***********************************************************/

  /************************************************************** Private - FUNCTIONS - START ***********************************************************/
  function initSlider(){
    if($scope.mySwiper) $scope.mySwiper.destroy(false, true);
    $scope.mySwiper = swiper = new Swiper(".feature_detail .slides", {
        effect:"slide",
        nextButton: '.forward.btn',
        prevButton: '.back.btn',
        keyboardControl: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        onSlideChangeEnd : function(swiper){
          $scope.swipped = true;
          $scope.tutorialOverlay = false;
          var newPartID = (swiper.activeIndex+1).toString();
          //$rootScope.siteTitle = "Relics of Annorath - " + $scope.pageTitle +" - "+$scope.getFeatureById(newPartID).TITLE
          var params = {"featureID":$stateParams.featureID, "partID":newPartID};
          $state.transitionTo("featureDetail", params, {'location':true, 'inherit':true, "relative": $state.$current, 'reload': false, 'notify':false }).then(function(params){
            setMetatags($stateParams.featureID, newPartID);
          });
        }
    });
    // makes text selection possible
    $(".feature_detail .slide_text").mousedown(function(e){
      e.stopPropagation();
    });
    // stops the overlay trigger
    $(".feature_detail .slide_text").click(function(e){
      e.stopPropagation();
      e.preventDefault();
    });

  }

  function setMetatags(featureID, partID){
    // set metatags
    var part = parseInt(partID);
    var category_title = $scope.getFeatureObject("exact").TITLE.trim();
    var part_title = $scope.featureDetail.PART_SLIDES[part-1].TITLE.trim();
    var final_title = category_title+" - "+part_title;
    var final_description = $scope.featureDetail.PART_SLIDES[part-1].TEXT;
    var image = $scope.featureDetail.PART_SLIDES[part-1].IMAGE;
    final_description = metatagFormatter.format(final_description);
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, final_description);
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, final_description);
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, final_title);
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, final_title);
    $rootScope.siteTitle = $scope.pageTitle +"  "+final_title;
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_IMAGE, image);
    $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_URL, window.location.origin+"/features/"+featureID+"/"+partID);
  }



  /************************************************************** Private - FUNCTIONS - END ***********************************************************/

}
