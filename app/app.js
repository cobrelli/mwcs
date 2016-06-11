require('angular');
require('angular-ui-router');
require('angular-resource');
require('lodash');

angular.module('mwcs', ['ui.router', 'ngResource']);

function mwcsCtrl($scope) {
    $scope.encoding = 'ISO-8859-1';
    $scope.results = '';
    
    $scope.$watch('results', function (content) {
        console.log('file changed', content);
    });
}
angular.module('mwcs').controller('mwcsCtrl', ['$scope', mwcsCtrl]);

angular.module('mwcs').directive('fileReader', [function () {
    return {
        scope: {
            encoding: '=?',
            results: '=?'
        },
        template: '<input type="file"></input>',
        link: function (scope, element) {
            element.on('change', function (event) {
                console.log('element changed');
                var fileReader = new FileReader();
                fileReader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        var content = onLoadEvent.target.result.replace(/\r\n|\r/g, '\n');
                        var lines = content.split('\n');
                        var header = lines.splice(0, 1);
                        scope.results = {
                            header: header[0].split(','),
                            content: lines
                        }
                    });
                };
                fileReader.readAsText((event.srcElement || event.target).files[0], scope.encoding);
            });
        }
    }
}]);
