/**

 * @class FaqDetailController
 * @static
 * @constructor
 */
function FaqDetailController($scope, uiCommunicateModel, $state, $stateParams, faqProps, metatagFormatter, $rootScope,$timeout) {
    /************************************************************** Public - VARIABLES - START ***********************************************************/
    $scope.guiURL = amazonURL + "gui/";
    $scope.faqTitle = faqProps.currentFaqTitle;
    $rootScope.siteTitle = "FAQ";
    $scope.faqs = {};

    var loadedFAQData = undefined;
    //debugger
    /************************************************************** Public - VARIABLES - END ***********************************************************/

    function setHeader(_data,_id) {

        $scope.faqs = _data.DATA;
        $scope.$broadcast('dataloaded');
        $scope.faqTitle = getCategoryTitle($stateParams.faqCategory);

        // set metatags
        var title = "";
        var description = "";
        if (_id != undefined && parseInt(_id) != 0) {
            title = "FAQ" + " - " + $scope.faqTitle + " - " + getFaqEntryByID(_id).TITLE;
        }
        else {
            title = "FAQ" + " - " + $scope.faqTitle
        }
        if (_id != undefined && parseInt(_id) != 0) {
            description = metatagFormatter.format(getFaqEntryByID(_id).TEXT);
        }
        else {
            description = title + " - Overview";
        }

        $scope.$root.setMetaTag($scope.$root.metaTagTypes.TITLE, title);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TITLE, title);
        $rootScope.siteTitle = title;
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_TYPE, 'Article');
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_DESCRIPTION, description);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.DESCRIPTION, description);
        $scope.$root.setMetaTag($scope.$root.metaTagTypes.OG_URL, window.location.href);
        //
        //console.log("- Faqs 0.2");
        //console.log(_data);

    }

    $scope.init = function () {


        uiCommunicateModel.PORTAL_FAQS().then(function (_data) {
            loadedFAQData = _data;
            setHeader(loadedFAQData,$stateParams.faqID);
            for (var i = 0; i < $scope.faqs.FAQS.length; i++) {
                $scope.faqs.FAQS[i].active = false;
                $scope.faqs.FAQS[i].answerActive = false;
                if ($scope.faqs.FAQS[i].CATEGORY == $stateParams.faqCategory) {
                    $scope.faqs.FAQS[i].active = true;
                }
                if ($scope.faqs.FAQS[i].ID == $stateParams.faqID) {
                    $scope.faqs.FAQS[i].answerActive = true;
                }
            }


        }, function (_err) {
            //console.log("faq error");
            //console.log(_err);
        });
    }

    /************************************************************** Public - FUNCTIONS - START ***********************************************************/
    $scope.toggleFaqAnswer = function (faqEntry) {
        for (var i = 0; i < $scope.faqs.FAQS.length; i++) {
            $scope.faqs.FAQS[i].answerActive = false;
        }

        faqEntry.answerActive = !faqEntry.answerActive;
        $timeout(function ()
        {
             setHeader(loadedFAQData,faqEntry.ID);
        },50);

    };
    $scope.navigateBackToList = function () {
        $state.go("faq");
    };
    $scope.navigateToSubFaq = function (stateParams) {
        $state.transitionTo("faqDetail", stateParams, {
            'location': true,
            'inherit': true,
            "relative": $state.$current,
            'reload': false,
            'notify': false
        });
        //window.location.pathname = $state.href("faqDetail", stateParams);
    };
    /************************************************************** Public - FUNCTIONS - END ***********************************************************/
    /************************************************************** Private - FUNCTIONS - START ***********************************************************/
    /*
     @method getFaqEntryByID
     @param {String} id FAQ ID
     @return {Object} Returns the corresponding FAQ Entry.
     */
    function getFaqEntryByID(faqID) {
        for (var i = 0; i < $scope.faqs.FAQS.length; i++) {
            if ($scope.faqs.FAQS[i].ID == parseInt(faqID) + 1) return $scope.faqs.FAQS[i - 1];
        }
    }

    /*
     @method getCategoryTitle
     @param {String} categoryKey e.g. "GA", "SYS"
     @return {String} Returns the category TITLE based on the category KEY
     */
    function getCategoryTitle(categoryKey) {
        var returnTitle = "";
        angular.forEach($scope.faqs.CATEGORIES, function (category, key) {
            if (category.KEY == categoryKey) {
                returnTitle = category.VALUE;
            }
        });
        return returnTitle;
    }

    /************************************************************** Private - FUNCTIONS - END *************************************************************/
}
