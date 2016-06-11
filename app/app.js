require('angular');
require('angular-ui-router');
require('angular-resource');
require('lodash');
var moment = require('moment');

angular.module('mwcs', ['ui.router', 'ngResource']);

function mwcsCtrl($scope, SalaryService) {
    var salaries = {};

    $scope.encoding = 'ISO-8859-1';
    $scope.results = '';

    $scope.$watch('results', function (content) {
        console.log('file changed', content);
        if (content) {
            parseResults(content);
        }
    });

    function parseResults(data) {
        var lines = data.content;
        var header = data.header;

        lines.forEach(function (line) {
            var properties = line.split(',');
            if (properties.length === header.length) {
                var date = properties[2].split('.');
                var startTime = properties[3].split(':');
                var finishTime = properties[4].split(':');
                var year = parseInt(date[2]);
                var month = parseInt(date[1]);
                var day = parseInt(date[0]);
                var startHours = parseInt(startTime[0]);
                var startMinutes = parseInt(startTime[1]);
                var finishHours = parseInt(finishTime[0]);
                var finishMinutes = parseInt(finishTime[1]);
                var dayLength = 8 * 60; // Day length in minutes

                var startDateTime = moment(new Date(year, month - 1, day, startHours, startMinutes));
                var finishDateTime = moment(new Date(year, month - 1, day, finishHours, finishMinutes));

                var shiftContinuesNextDay = false;
                var totalLength;
                var dailyWage = 0;
                var overtimeCompensation = 0;
                var eveningWorkCompensation = 0;

                if (finishHours < startHours) { // Shift continues to next day
                    console.log('shiftContinuesNextDay');
                    finishDateTime.add(1, 'days');
                    shiftContinuesNextDay = true;
                }

                console.log('startDateTime', startDateTime.toString());
                console.log('finishDateTime', finishDateTime.toString());

                totalLength = finishDateTime.diff(startDateTime, 'minutes');
                var lengthLeft = totalLength;
                console.log('totalLength', totalLength);

                // Calculate overtimeCompensation
                if (totalLength > dayLength) {
                    overtimeCompensation = SalaryService.calculateOvertimeCompensation((totalLength - dayLength) / 60);
                }

                if (startHours < 6) {
                    var morningWorkTime = finishHours < 6 ? finishDateTime : moment(startDateTime).hours(6).minutes(0);
                    var diff = morningWorkTime.diff(startDateTime, 'minutes');
                    lengthLeft -= diff;
                    eveningWorkCompensation += SalaryService.calculateEveningWorkCompensation(diff / 60);
                }

                if (finishHours > 18 || (finishHours === 18 && finishMinutes > 0) || shiftContinuesNextDay) {
                    var eveningWorkTimeStart = startHours >= 18 ? startDateTime : moment(startDateTime).hours(18).minutes(0);
                    var eveningWorkTimeEnd = shiftContinuesNextDay ? moment(finishDateTime).hours(0).minutes(0) : finishDateTime;
                    var diff = eveningWorkTimeEnd.diff(eveningWorkTimeStart, 'minutes');
                    lengthLeft -= diff;
                    eveningWorkCompensation += SalaryService.calculateEveningWorkCompensation(diff / 60);
                }

                if (shiftContinuesNextDay) {
                    var nextDayMorningWorkEnd = finishHours >= 6 ? moment(finishDateTime).hours(6).minutes(0) : finishDateTime;
                    var diff = nextDayMorningWorkEnd.diff(moment(finishDateTime).hours(0).minutes(0), 'minutes');
                    lengthLeft -= diff;
                    eveningWorkCompensation += SalaryService.calculateEveningWorkCompensation(diff / 60);

                    if (finishHours > 18 || (finishHours === 18 && finishMinutes > 0)) {
                        diff = finishDateTime.diff(moment(finishDateTime).hours(16).minutes(0), 'minutes');
                        lengthLeft -= diff;
                        eveningWorkCompensation += SalaryService.calculateEveningWorkCompensation(diff / 60);
                    }
                }

                dailyWage += SalaryService.calculateDailyWage(lengthLeft / 60);

                console.log('dailyWage', dailyWage);
                console.log('overtimeCompensation', overtimeCompensation);
                console.log('eveningWorkCompensation', eveningWorkCompensation);
                console.log('total', SalaryService.calculateTotalDailyPay(dailyWage, eveningWorkCompensation, overtimeCompensation));
            }
        });
    }
}
angular.module('mwcs').controller('mwcsCtrl', ['$scope', 'SalaryService', mwcsCtrl]);

function SalaryService() {
    var wage = 3.75;
    var eveningWorkCompensation = 1.15;
    var overtimeFirstTwoHours = 0.25;
    var overtimeNextTwoHours = 0.5;

    function calculateTotalDailyPay(dailyWage, totalEveningCompensation, totalOvertimeCompensation) {
        return dailyWage + totalEveningCompensation + totalOvertimeCompensation;
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
            compensation += 2 * overtimeNextTwoHours * wage;
            hours -= 2;
        } else {
            compensation += hours * overtimeNextTwoHours * wage;
            return compensation
        }
        compensation += hours * wage;
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
