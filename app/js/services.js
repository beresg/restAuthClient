'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

function calculateHashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

angular.module('restClient.services', [])
    .factory('ServiceUrlProvider',[function() {
        var baseUrl = 'http://localhost:3000';
        return {
            registerUrl: baseUrl + '/register',
            loginUrl: baseUrl + '/login',
            logoutUrl: baseUrl + '/logout',
            sendMessageUrl: baseUrl + '/sendMessage',
            getMessagesUrl: baseUrl + '/getMessages'
        };
    }])
    .factory('RegisterService', ['$http', 'ServiceUrlProvider', function($http, ServiceUrlProvider) {
        return {
            register: function(userName, pwd) {
                var pwdHash = calculateHashCode(pwd);
                var payload = {
                    userName: userName,
                    pwd: pwdHash
                };
                return $http.post(ServiceUrlProvider.registerUrl, payload);
            }
        };
    }])
    .factory('UserSession', ['$http', 'ServiceUrlProvider', '$q', function($http, ServiceUrlProvider, $q) {
        var userAuthKey = '';

        return {
            login: function(userName, pwd) {
                var pwdHash = calculateHashCode(pwd);
                var payload = {
                    userName: userName,
                    pwd: pwdHash
                };
                var deferred = $q.defer();

                var httpPromise = $http.post(ServiceUrlProvider.loginUrl, payload);

                httpPromise.success(function(data) {
                    if (data.status === 'OK') {
                        userAuthKey = data.authKey;
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }
                });

                httpPromise.error(function() {
                    deferred.reject();
                });


                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();
                var payload = { authKey: userAuthKey };

                var httpPromise = $http.post(ServiceUrlProvider.logoutUrl, payload);

                httpPromise.success(function(data) {
                    if (data.status === 'OK') {
                        userAuthKey = '';
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }
                });

                httpPromise.error(function() {
                    deferred.reject();
                });

                return deferred.promise;
            },
            isAuthenticated: function() {
                return userAuthKey !== '';
            },
            sendMessage: function(msg) {
                var payload = {
                    authKey: userAuthKey,
                    message : msg
                };

                return $http.post(ServiceUrlProvider.sendMessageUrl, payload);
            },
            getMessages: function(from) {
                    var payload = {
                    from: from,
                    authKey: userAuthKey
                };

                return $http.post(ServiceUrlProvider.getMessagesUrl, payload);
            }
        };
    }])
    .value('version', '0.3');
