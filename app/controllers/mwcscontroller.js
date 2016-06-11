var moment = require('moment');

function mwcsCtrl($scope, SalaryService) {
    $scope.encoding = 'ISO-8859-1';
    $scope.results = '';

    $scope.$watch('results', function (content) {
        console.log('file changed', content);
        if (content) {
            $scope.salaries = parseResults(content);
        }
    });

    function parseResults(data) {
        var lines = data.content;
        var header = data.header;
        var salaries = {};

        lines.forEach(function (line) {
            var properties = line.split(',');
            if (properties.length === header.length) {
                var id = properties[1];
                var name = properties[0];
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
                var totalPay = SalaryService.calculateTotalDailyPay(dailyWage, eveningWorkCompensation, overtimeCompensation);
                
                console.log('id: ' + properties[1] + ', name: ' + properties[0]);
                console.log('dailyWage', dailyWage);
                console.log('overtimeCompensation', overtimeCompensation);
                console.log('eveningWorkCompensation', eveningWorkCompensation);
                console.log('total', SalaryService.calculateTotalDailyPay(dailyWage, eveningWorkCompensation, overtimeCompensation));
                if (!salaries[id]) {
                    salaries[id] = {
                        name: name,
                        salary: 0,
                        totalOvertimeCompensation: 0,
                        totalEveningWorkCompensation: 0
                    }
                }
                
                salaries[id].salary += totalPay;
                salaries[id].totalOvertimeCompensation += overtimeCompensation;
                salaries[id].totalEveningWorkCompensation += eveningWorkCompensation;
            }
        });
        
        return salaries;
    }
}
angular.module('mwcs').controller('mwcsCtrl', ['$scope', 'SalaryService', mwcsCtrl]);