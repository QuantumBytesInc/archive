/**
 * Shared Object between FaqController and FaqDetailController
 * which makes it possible to share the selected faq entry title to be displayed in the FaqDetailController.
 * @class FaqProps
 * @static
 * @constructor
 */
function FeatureDetail($state, $stateParams, uiCommunicateModel) {
  return {
    getData: function(){
      uiCommunicateModel.FEATURES_FEATURE($stateParams.featureID,$stateParams.partID).then(function (_data){
          return _data;
      },function(_err){
          return(_err);
      });
    }
  }
}
