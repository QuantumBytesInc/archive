function TemporaryController($scope, $state, $translate, uiService, uiCommunicate, helperService) {


    $scope.init = function () {

    };

    //LANGUAGE SETTINGS
    $scope.ddlValues_settings_Language = [{key: "english", value: "English", selected: false}, {
        key: "german",
        value: "german",
        selected: false
    }, {key: "french", value: "french", selected: true}];

    $scope.textbla = "asdasd";
    $scope.textValue = "asdasd";
    $scope.ddlValues = [{key: "low", value: "low", selected: false}, {
        key: "medium",
        value: "medium",
        selected: false
    }, {key: "high", value: "high", selected: false}];
    $scope.ddlValues2 = [{key: "low", value: "low", selected: false}, {
        key: "medium",
        value: "medium",
        selected: false
    }, {key: "high", value: "high", selected: false}];
    $scope.bla = function () {
        //alert('hello');
    };

    $scope.slideValue = 1;

    $scope.dynamic = 75;


    $scope.checkBoxChecked1 = false;
    $scope.checkBoxChecked2 = false;
    $scope.checkBoxChecked3 = true;
    $scope.changed = function (value) {
        //console.log($scope.checkBoxChecked1);

        console.log(value);

    }

    $scope.value = "100";
    $scope.options = {
        from: 1,
        to: 100,
        step: 1,
        dimension: " %"
    };
    $scope.value2 = "100";
    $scope.options2 = {
        from: 1,
        to: 100,
        step: 1,
        dimension: " %"
    };

}
