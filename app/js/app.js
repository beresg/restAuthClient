'use strict';


// Declare app level module which depends on filters, and services
angular.module('restClient', [
  'ngRoute',
  'restClient.filters',
  'restClient.services',
  'restClient.directives',
  'restClient.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/mainPage', {templateUrl: 'partials/main.html'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'LogoutCtrl'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'});
    $routeProvider.when('/messsages', {templateUrl: 'partials/messages.html', controller: 'MessagesCtrl'});
    $routeProvider.otherwise({redirectTo: '/mainPage'});
}]);
