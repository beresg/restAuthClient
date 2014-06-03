'use strict';

/* Controllers */

angular.module('restClient.controllers', [])
    .controller('LoginCtrl', ['$scope', 'UserSession', function($scope, UserSession) {
        $scope.userName = '';
        $scope.password = '';

        $scope.message = '';

        $scope.isAuthenticated = UserSession.isAuthenticated();

        $scope.login = function() {
            if ($scope.userName.length < 3 || $scope.password.length < 6) {
                $scope.messageType = 'warning';
                $scope.message = 'Username should contain at least 3 characters, and the password should contain at least 6!';
            }
            else {
                var promise = UserSession.login($scope.userName, $scope.password);
                promise.then(function() {
                    $scope.messageType = 'success';
                    $scope.message = 'Authentication succeeded';
                    $scope.isAuthenticated = UserSession.isAuthenticated();
                }, function() {
                    $scope.messageType = 'warning';
                    $scope.message = 'Authentication failed!';
                    $scope.isAuthenticated = UserSession.isAuthenticated();
                });
            }
        };

    }])
    .controller('LogoutCtrl', ['$scope', 'UserSession', function($scope, UserSession) {
        $scope.isAuthenticated = UserSession.isAuthenticated();

        $scope.logout = function() {
            var promise = UserSession.logout();

            promise.then(function() {
                $scope.isAuthenticated = UserSession.isAuthenticated();
            }, function() {
                $scope.isAuthenticated = UserSession.isAuthenticated();
            });
        };
    }])
    .controller('MessagesCtrl', ['$scope', function($scope) {

    }])
    .controller('RegisterCtrl', ['$scope', 'RegisterService', function($scope, RegisterService) {
        $scope.userName = '';
        $scope.password = '';

        $scope.message = '';

        $scope.register = function() {
            if ($scope.userName.length < 3 || $scope.password.length < 6) {
                $scope.messageType = 'warning';
                $scope.message = 'Username should contain at least 3 characters, and the password should contain at least 6!';
            }
            else {
                var promise = RegisterService.register($scope.userName, $scope.password);

                promise.success(function(data) {
                    if (data.status === "OK") {
                        $scope.messageType = 'success';
                        $scope.message = 'Registration successful!!';
                    }
                    else {
                        $scope.messageType = 'warning';
                        $scope.message = 'Registration failed, username already taken!';
                    }
                });
            }
        };
    }])
    .controller('MessagesCtrl', ['$scope', 'UserSession', function($scope, UserSession) {
        $scope.isAuthenticated = UserSession.isAuthenticated();
        $scope.msg = '';

        $scope.messages = [];

        var httpPromise = UserSession.getMessages(0);

        httpPromise.success(function(data) {
            $scope.messages = $scope.messages.concat(data.messages);
        });

        $scope.refresh = function() {
            var promise = UserSession.getMessages($scope.messages.length);
            promise.success(function(data) {
                $scope.messages = $scope.messages.concat(data.messages);
            });
        };

        $scope.send = function() {
            var promise = UserSession.sendMessage($scope.msg);

            promise
                .then(function() {
                    return UserSession.getMessages($scope.messages.length);
                })
                .then(function(data) {
                    $scope.messages = $scope.messages.concat(data.data.messages);
                });
        };
    }]);
