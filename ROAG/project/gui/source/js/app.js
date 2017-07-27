//{{ADD_MODULES}} - Will be replaced by gulp task
angular.module('qbApp', ['pascalprecht.translate', 'ui.bootstrap', 'ngSlider', 'App.directives', 'App.controllers', 'App.services', 'App.factories', 'App.models', 'ui.router', 'ngDragDrop', '{{ADD_MODULES}}'])
    .config(['$stateProvider', RouteProvider])
    .config(['$translateProvider', TranslationProvider])
    .config(['$httpProvider', HttpProvider])
    .config(['$controllerProvider', function ($controllerProvider) {
        //http://stackoverflow.com/questions/25111831/controller-not-a-function-got-undefined-while-defining-controllers-globally
        $controllerProvider.allowGlobals();
    }])
    .config(['$qProvider', function ($qProvider) {
        //Handle rejections to not throw errors
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .config(['$sceDelegateProvider', '$compileProvider', '$provide', '$httpProvider', function ($sceDelegateProvider, $compileProvider, $provide, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://d3db97748bnfkn.cloudfront.net/**', 'https://s3.amazonaws.com/qb-roag/**'
        ]);
        $httpProvider.useApplyAsync(true);

        $compileProvider.debugInfoEnabled(true);

        //Added on angular 1.6
        $compileProvider.preAssignBindingsEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        //Don't remove the scope information because of debugInfoEnabled == false.
        $provide.decorator('$compile', ['$delegate', function ($compile) {
            $compile.$$addScopeInfo = function $$addScopeInfo($element, scope, isolated, noTemplate) {
                var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
                $element.data(dataName, scope);
            };
            return $compile;
        }]);
    }]);
angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null
};
jQuery.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
            $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
            $(window).scrollLeft()) + "px");
    return this;
};
