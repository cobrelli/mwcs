require('angular');
require('angular-ui-router');
require('angular-resource');
require('lodash');

angular.module('mwcs', ['ui.router', 'ngResource']);

function mwcsCtrl($scope) {
}
angular.module('mwcs').controller('mwcsCtrl', ['$scope', mwcsCtrl]);

angular.module('mwcs').directive('fileReader', [function () {
    return {
        scope: {
            encoding: '='
        },
        template: '<input type="file"></input>',
        link: function (scope, element) {
        }
    }
}]);
