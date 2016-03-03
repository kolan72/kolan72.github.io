(function(){

	var app = angular.module("routedTabs", ["ui.router", "ui.bootstrap"]);

	app.config(function ($stateProvider, $urlRouterProvider, $provide) {

	    $urlRouterProvider.otherwise("/main/tmfexplorer");
	    //$urlRouterProvider.otherwise("/screens/tmfexplorer");
	    $stateProvider
			    .state("main", { abtract: true, url:"/main", templateUrl:"main.html" })
				.state("main.tab1", { url: "/tmfexplorer", templateUrl: "tab1.html" })
				.state("main.tab2", { url: "/wordsbrowser", templateUrl: "tab2.html" })
                .state("screens", { abtract: true, url: "/screens", templateUrl: "main.html" })
                .state("screens.tab1", { url: "/tmfexplorer", templateUrl: "tab1screen.html" })
                .state("screens.tab2", { url: "/wordsbrowser", templateUrl: "tab2screen.html" })
	    ;

	    $provide.decorator('$uiViewScroll', function ($delegate) {
	        return function (uiViewElement) {
	            autoscroll = "false";
	        };
	    });
	})


    //.run(['$rootScope', '$state', function ($rootScope, $state) {
    //    //if (toState.url == '/main') {
    //    //    event.preventDefault();
    //    //}
    //}])
    ;
    

	//app.filter('startsWithLetter', function () {
	//    return function (items, letter) {
	//        var filtered = [];

	//        for (var i = 0; i < items.length; i++) {
	//            var item = items[i];
	//            if (item.route.substring(0, 4) == (letter == '' ? 'main' : letter))
	//            {
	//                filtered.push(item);
	//            }
	//        }
	//        return filtered;
	//    };
	//});

	app.controller("mainController", function($rootScope, $scope, $state) {		

	    $scope.letter = $state.$current.name;

	    $scope.go = function (route) {
	        $state.go(route);

		};

		$scope.active = function(route){
			return $state.is(route);
		};

		$scope.tabs = [
			{ heading: "TMFExplorer", route: "main.tab1", active: false, visible: true },
			{ heading: "WordsBrowser", route: "main.tab2", active: false, visible: true },
		    { heading: "TMFExplorer", route: "screens.tab1", active: false, visible: true },
		    { heading: "WordsBrowser", route: "screens.tab2", active: false, visible: true }

			//{ heading: "Tab 3", route:"main.tab3", active:false },
		];

		$scope.$on("$stateChangeSuccess", function () {
			$scope.tabs.forEach(function(tab) {
				tab.active = $scope.active(tab.route);
			});
			var stateRootName = $state.$current.name;
			var dotPos = $state.$current.name.indexOf(".");
			if (dotPos != -1)
			{
			    stateRootName = stateRootName.substring(0, dotPos);
			}
			$scope.tabs.forEach(function (tab) {
			    tab.visible = !(tab.route.indexOf(stateRootName) == -1);
			    //console.log($state.$current.name);
			    //if (!tab.active) {
			    //    tab.visible = false;
			    //}
			});
		});

		$rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams, options)
                        {
                            if (toState.url == '/main' || toState.url == '/screens') {
                                event.preventDefault();
                            }
                            else
                            {
                                ;
                            }
                        })
	});

}());
