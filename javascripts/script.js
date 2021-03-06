﻿(function(){

	var app = angular.module("routedTabs", ["ui.router", "ui.bootstrap"]);


	app.config(function ($stateProvider, $urlRouterProvider, $provide, $locationProvider) {

	    $urlRouterProvider.otherwise("/main/home");
	    $stateProvider
			    .state("main", {
			        abtract: true,
			        url: "/main",
			        templateUrl: 'main.html',


			    })
                .state("main.tab1", {
                    url: "/home"
				    , templateUrl: "tab0.html"
                })
				.state("main.tab3", {
				    url: "/tmfexplorer"	    
				    ,templateUrl: "tab1.html"

				})
				.state("main.tab2", { url: "/wordsbrowser", templateUrl: "tab2.html" })
                .state("main.tab4", { url: "/planefiledistributor", templateUrl: "tab4.html" })
                
                .state("main.tab5", { url: "/projecttasktree", templateUrl: "tab5.html" })

                .state("screens", {
                    abtract: true,
                    url: "/screens",
                    templateUrl: "main.html"
                })
                .state("screens.tab2", { url: "/tmfexplorer",  templateUrl: "tab1screen.html" })
                .state("screens.tab1", { url: "/wordsbrowser", templateUrl: "tab2screen.html" })
	            .state("screens.tab4", { url: "/planefiledistributor", templateUrl: "tab4screen.html" })
                .state("screens.tab5", { url: "/projecttasktree", templateUrl: "tab5screen.html" })


               .state("history", {
                 abtract: true,
                 url: "/history",
                 templateUrl: "main.html"
               })
               
               .state("history.tab1", { url: "/wordsbrowser", templateUrl: "tab1history.html" })
               .state("history.tab2", { url: "/tmfexplorer", templateUrl: "tab2history.html" })
               .state("history.tab4", { url: "/planefiledistributor", templateUrl: "tab4history.html" })
               .state("history.tab5", { url: "/projecttasktree", templateUrl: "tab5history.html" })

	    ;

	    $locationProvider.hashPrefix('');

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
	        },

	        displayClassElementByCssNone: function (className)
	        {
	            angular.element(document.querySelector(className)).css('display', 'none');
	        },
	        displayClassElementByCssBlock: function (className)
	        {
	            angular.element(document.querySelector(className)).css('display', 'block');
	        }

	  };
	}
	);

	app.controller("mainController", ['$rootScope', '$scope', '$state', '$timeout', 'UtilFactory', function ($rootScope, $scope, $state, $timeout, UtilFactory) {

	    $scope.isParentStateChanged = true;
	    $scope.IsLoading = false;

	    var myMap = new Map();

	    $scope.go = function (route) {
	        $state.go(route);
	    };

	    $scope.active = function (route) {
	        return $state.is(route);
	    };

	    $scope.tabs = [
            { heading: "Главная", route: "main.tab1", active: false, visible: true },
            { heading: "WordsBrowser", route: "main.tab2", active: false, visible: true },
            { heading: "TMFExplorer", route: "main.tab3", active: false, visible: true },

            { heading: "ProjectTaskTree", route: "main.tab5", active: false, visible: true },

            { heading: "PlaneFileDistributor", route: "main.tab4", active: false, visible: true },
            { heading: "WordsBrowser", route: "screens.tab1", active: false, visible: true },
		    { heading: "TMFExplorer", route: "screens.tab2", active: false, visible: true },
            { heading: "PlaneFileDistributor", route: "screens.tab4", active: false, visible: true },

            { heading: "ProjectTaskTree", route: "screens.tab5", active: false, visible: true },

		    { heading: "WordsBrowser", route: "history.tab1", active: false, visible: true },
            { heading: "TMFExplorer", route: "history.tab2", active: false, visible: true },
            { heading: "PlaneFileDistributor", route: "history.tab4", active: false, visible: true },

            { heading: "ProjectTaskTree", route: "history.tab5", active: false, visible: true }
	    ];

	    $scope.tabs.forEach(function (tab) {
	        myMap.set(tab.route, 0);
	    });

	    $scope.$on("$stateChangeSuccess", function () {

	        if ($scope.isParentStateChanged) {
	            UtilFactory.displayClassElementByCssBlock('.spinner');
	            UtilFactory.displayElementByCssNone('#tab-container');
	            UtilFactory.displayElementByCssNone('#leftColumn');
	            UtilFactory.displayElementByCssNone('#footer_wrap');
	            $timeout(
                                    function () {
                                        UtilFactory.displayClassElementByCssNone('.spinner');

                                        UtilFactory.displayElementByCssBlock('#leftColumn');
                                        UtilFactory.displayElementByCssBlock('#tab-container');
                                        UtilFactory.displayElementByCssBlock('#footer_wrap');
                                    }, 200);
	        }

	        $scope.tabs.forEach(function (tab) {
	            tab.active = $scope.active(tab.route);
	        });
	        var stateRootName = UtilFactory.getStateName($state.$current.name);


	        $scope.tabs.forEach(function (tab) {
	           tab.visible = !(tab.route.indexOf(stateRootName) == -1);
	        });

	        if ($scope.IsLoading) {
	            myMap.set($state.$current.name, 1);
	            $timeout(function () {
	                $scope.IsLoading = false;
	            }, 100);

	        }

	    });
	    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
	        console.log(unfoundState.to);
	    }
        );

	    $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log(toState.url);
            }
        );

	    $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams, options) {
                            if (toState.url == '/main' || toState.url == '/screens' || toState.url == '/history') {
                                event.preventDefault();
                            }
                            else {
                                if (!(UtilFactory.getStateName(fromState.name) == UtilFactory.getStateName(toState.name))) {
                                    if (fromState.name == '') {
                                        UtilFactory.displayClassElementByCssBlock('.spinner');
                                        UtilFactory.displayElementByCssNone('#tab-container');
                                        UtilFactory.displayElementByCssNone('#leftColumn');
                                        UtilFactory.displayElementByCssNone('#footer_wrap');
                                    }

                                    console.log(toState.name);
                                    myMap.set(toState.name, 1);
                                    $scope.isParentStateChanged = true;
                                }
                                else
                                {
                                    ////console.log(toState.name);
                                    if (myMap.get(toState.name) == 0) {
                                        $scope.IsLoading = true;
                                    }
                                    else {
                                        $scope.IsLoading = false;
                                    }
                                    $scope.isParentStateChanged = false;
                                }
                            }
                        })
	}]);

}());
