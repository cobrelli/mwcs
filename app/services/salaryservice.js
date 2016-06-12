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
        return hours * eveningWorkCompensation;
    }

    function calculateOvertimeCompensation(overtimeHours) {
        var compensation = 0;
        if (overtimeHours > 2) {
            compensation += 2 * overtimeFirstTwoHours * wage;
            overtimeHours -= 2;
        } else {
            compensation += overtimeHours * overtimeFirstTwoHours * wage;
            return compensation
        }
        if (overtimeHours > 2) {
            compensation += 2 * overtimeNextTwoHours * wage;
            overtimeHours -= 2;
        } else {
            compensation += overtimeHours * overtimeNextTwoHours * wage;
            return compensation
        }
        compensation += overtimeHours * wage;
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