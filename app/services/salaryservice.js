function SalaryService() {
    var wage = 3.75;
    var eveningWorkCompensation = 1.15;
    var overtimeFirstTwoHours = 0.25;
    var overtimeNextTwoHours = 0.5;

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    function calculateTotalDailyPay(dailyWage, totalEveningCompensation, totalOvertimeCompensation) {
        return round(dailyWage + totalEveningCompensation + totalOvertimeCompensation, 2);
    }

    function calculateDailyWage(hours) {
        return round(hours * wage, 2);
    }

    function calculateEveningWorkCompensation(hours) {
        return round(hours * eveningWorkCompensation, 2);
    }

    function calculateOvertimeCompensation(overtimeHours) {
        var compensation = 0;
        if (overtimeHours > 2) {
            compensation += 2 * overtimeFirstTwoHours * wage;
            overtimeHours -= 2;
        } else {
            compensation += overtimeHours * overtimeFirstTwoHours * wage;
            return round(compensation, 2)
        }
        if (overtimeHours > 2) {
            compensation += 2 * overtimeNextTwoHours * wage;
            overtimeHours -= 2;
        } else {
            compensation += overtimeHours * overtimeNextTwoHours * wage;
            return round(compensation, 2)
        }
        compensation += overtimeHours * wage;
        return round(compensation, 2);
    }

    return {
        calculateTotalDailyPay: calculateTotalDailyPay,
        calculateDailyWage: calculateDailyWage,
        calculateEveningWorkCompensation: calculateEveningWorkCompensation,
        calculateOvertimeCompensation: calculateOvertimeCompensation
    };
}
angular.module('mwcs').service('SalaryService', SalaryService);