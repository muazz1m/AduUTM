// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','starter.services','firebase','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})

.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('menu', {
      url:'/menu',
      templateUrl: 'templates/menu.html',
      abstract:true,
      controller:'AduCtrl'

    })

    .state('menu.home', {
      url: '/home',
      views:{
        'menuContent':{
          templateUrl: 'templates/home.html',
          controller:'AduCtrl'
        
        }
      }
    }) 

    .state('menu.list', {
      url: '/list',
      views:{
        'menuContent':{
          templateUrl: 'templates/list.html',
          controller:'AduCtrl'
        
        }
      }
    })

    .state('menu.settings', {
      url: '/settings',
      views:{
        'menuContent':{
          templateUrl: 'templates/settings.html'
        
        }
      }
    })

    .state('menu.help', {
      url: '/help',
      views:{
        'menuContent':{
          templateUrl: 'templates/help.html'
        
        }
      }
    })

  $urlRouterProvider.otherwise('/login');
})

//double back key to exit
.run(function($rootScope, $ionicPlatform, $ionicHistory){

  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }
    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101);

})