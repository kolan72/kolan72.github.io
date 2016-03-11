(function(){

	var app = angular.module("routedTabs", ["ui.router", "ui.bootstrap"]);


	app.config(function ($stateProvider, $urlRouterProvider, $provide) {

	    $urlRouterProvider.otherwise("/main/tmfexplorer");
	    $stateProvider
			    .state("main", {
			        abtract: true,
			        url: "/main",
			        templateUrl: 'main.html',


			    })
				.state("main.tab1", {
				    url: "/tmfexplorer"

				    
				    ,templateUrl: "tab1.html"

				})
				.state("main.tab2", { url: "/wordsbrowser", templateUrl: "tab2.html" })
                .state("screens", {
                    abtract: true, url: "/screens",
                    templateUrl: "main.html"

                })
                .state("screens.tab1", { url: "/tmfexplorer", templateUrl: "tab1screen.html" })
                .state("screens.tab2", { url: "/wordsbrowser", templateUrl: "tab2screen.html" })
	    ;

	    $provide.decorator('$uiViewScroll', function ($delegate) {
	        return function (uiViewElement) {
	            autoscroll = "false";
	        };
	    });
	})

	app.factory('UtilFactory', function () {
	    return {
	        getStateName: function (name) {
	        var stateRootName = name;
	        var dotPos = stateRootName.indexOf(".");
	        if (dotPos != -1) {
	            stateRootName = stateRootName.substring(0, dotPos);
	        }
	        return stateRootName;
	        },
	        displayElementByCssNone: function (element)
	        {
	            angular.element(element).css('display', 'none');
	        },
	        displayElementByCssBlock: function (element)
	        {
	            angular.element(element).css('display', 'block');
	        }

	  };
	}
	);

	app.controller("mainController", ['$rootScope', '$scope', '$state', '$timeout', 'UtilFactory', function ($rootScope, $scope, $state, $timeout, UtilFactory) {

	    $scope.isParentStateChanged = true;

	    $scope.go = function (route) {
	        $state.go(route);
	        //////$timeout(
            //////    function () {
            //////        angular.element('#content').css('display', 'block');
            //////    }, 10);

	    };

	    $scope.active = function (route) {
	        return $state.is(route);
	    };

	    $scope.tabs = [
			{ heading: "TMFExplorer", route: "main.tab1", active: false, visible: true },
			{ heading: "WordsBrowser", route: "main.tab2", active: false, visible: true },
		    { heading: "TMFExplorer", route: "screens.tab1", active: false, visible: true },
		    { heading: "WordsBrowser", route: "screens.tab2", active: false, visible: true }

	    ];

	    $scope.$on("$stateChangeSuccess", function () {
	        $scope.tabs.forEach(function (tab) {
	            tab.active = $scope.active(tab.route);
	        });
	        var stateRootName = UtilFactory.getStateName($state.$current.name);

	        $scope.tabs.forEach(function (tab) {
	            tab.visible = !(tab.route.indexOf(stateRootName) == -1);

	        });

	        if ($scope.isParentStateChanged)
	        {
	            UtilFactory.displayElementByCssNone('#tab-container');
	            UtilFactory.displayElementByCssNone('#leftColumn');
	            UtilFactory.displayElementByCssNone('#footer_wrap');
	            $timeout(
                                    function () {
                                        UtilFactory.displayElementByCssBlock('#leftColumn');
                                        UtilFactory.displayElementByCssBlock('#tab-container');
                                        UtilFactory.displayElementByCssBlock('#footer_wrap');
                                    }, 10);
	        }

	    });
	    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
	        console.log(unfoundState.to);
	    }
        );

	    $rootScope.$on('$viewContentLoaded',
        function (event) {
            //console.log(event);
            // Access to all the view config properties.
            // and one special property 'targetView'
            // viewConfig.targetView 
        }
        );

	    $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log(toState.url);
            }
    );

	    $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams, options) {
                            if (toState.url == '/main' || toState.url == '/screens') {
                                event.preventDefault();
                            }
                            else {
                                if (!(UtilFactory.getStateName(fromState.name) == UtilFactory.getStateName(toState.name))) {
                                    if (fromState.name == '') {
                                        UtilFactory.displayElementByCssNone('#tab-container');
                                        UtilFactory.displayElementByCssNone('#leftColumn');
                                        UtilFactory.displayElementByCssNone('#footer_wrap');

                                        //////angular.element('#content').css('display', 'none');

                                        //////$timeout(
                                        //////                    function () {
                                        //////                        angular.element('#content').css('display', 'block');
                                        //////                    }, 100);
                                    }

                                    $scope.isParentStateChanged = true;
                                }
                                else
                                {

                                    $scope.isParentStateChanged = false;                                    
                                }
                                //          Не рано ли здесь делать невидимым класс #content?
                                //////if (!(UtilFactory.getStateName(fromState.name) == UtilFactory.getStateName(toState.name)))
                                //////{
                                //////    angular.element('#content').css('display', 'none');
                                //////}
                            }
                        })
	}]);

}());
