//{{ADD_MODULES}} - Will be replaced by gulp task
angular.module('relicsPortalApp', ['App.controllers', 'App.services', 'App.factories', 'App.models', 'App.directives', 'ngSanitize', 'ui.router', 'ngTouch','{{ADD_MODULES}}'])
//.config(['$routeProvider',RouteProvider])
    .config(['$httpProvider', HttpProvider])
    .config(['$stateProvider', '$urlRouterProvider', StateProvider])
    .config([VersionProvider])
    .config(['$controllerProvider', function ($controllerProvider) {
        //http://stackoverflow.com/questions/25111831/controller-not-a-function-got-undefined-while-defining-controllers-globally
        $controllerProvider.allowGlobals();
    }])
    .config(['$sceDelegateProvider', '$locationProvider', '$touchProvider', '$compileProvider','$httpProvider', function ($sceDelegateProvider, $locationProvider, $touchProvider, $compileProvider,$httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://dhlufim0x8urs.cloudfront.net/**', 'https://s3.amazonaws.com/qb-roap/**'

        ]);
        $httpProvider.useApplyAsync(true);
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.preAssignBindingsEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);

        $locationProvider.html5Mode(true);
        $touchProvider.ngClickOverrideEnabled(true);

    }]).run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.loggedIn = false;

        }
    ]);

angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null
};
