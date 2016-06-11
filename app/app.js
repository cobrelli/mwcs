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

function SalaryService() {
    var wage = 3.75;
    var eveningWorkCompensation = 1.15;
    var overtimeFirstTwoHours = wage * 1.25;
    var overtimeNextTwoHour = wage * 1.5;
    var overtimeFurther = wage * 2;

    function calculateTotalDailyPay(dailyWage, EveningCompensation, overtimeCompensation) {
        return dailyWage + eveningWorkCompensation + overtimeCompensation;
    }

    function calculateDailyWage(hours) {
        return hours * wage;
    }

    function calculateEveningWorkCompensation(hours) {
        return hours * (wage + eveningWorkCompensation);
    }

    function calculateOvertimeCompensation(hours) {
        var compensation = 0;
        if (hours > 2) {
            compensation += 2 * overtimeFirstTwoHours * wage;
            hours -= 2;
        } else {
            compensation += hours * overtimeFirstTwoHours * wage;
            return compensation
        }
        if (hours > 2) {
            compensation += 2 * overtimeNextTwoHour * wage;
            hours -= 2;
        } else {
            compensation += hours * overtimeNextTwoHour * wage;
            return compensation
        }
        compensation += hours * overtimeFurther * wage;
        return compensation;
    }
    
    return {
        calculateTotalDailyPay: calculateTotalDailyPay,
        calculateDailyWage: calculateDailyWage,
        calculateEveningWorkCompensation: calculateEveningWorkCompensation,
        calculateOvertimeCompensation: calculateOvertimeCompensation
    };
}
angular.module('mwcs').service('SalaryService', SalaryService);

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
