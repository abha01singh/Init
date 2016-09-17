'use strict'

// Setting up route
angular.module('mean.initial').config(['$meanStateProvider',
  function ($meanStateProvider) {
    // states for users
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        abstract: true,
        templateUrl: 'initial/views/users/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'initial/views/users/login.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'initial/views/users/register.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'initial/views/users/forgot-password.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'initial/views/users/reset-password.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
  }
])
