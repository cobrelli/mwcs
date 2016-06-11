require('angular');
require('angular-ui-router');
require('angular-resource');
require('lodash');
var moment = require('moment');

angular.module('mwcs', ['ui.router', 'ngResource']);

require('./directives/directives');
require('./services/salaryservice');
require('./controllers/mwcscontroller');
