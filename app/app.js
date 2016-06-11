require('angular');
require('angular-ui-router');
require('angular-resource');
require('lodash');

angular.module('mwcs', ['ui.router', 'ngResource']);

require('./directives/directives');
require('./services/salaryservice');
require('./controllers/mwcscontroller');
