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