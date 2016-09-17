'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module
var path = require('path')
var Initial = new Module('initial')

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Initial.register(function (app, users, system) {
  // Set views path, template engine and default layout
  app.set('views', path.join(__dirname, '/server/views'))

  Initial.angularDependencies(['mean.system', 'mean.users'])

  return Initial
})
