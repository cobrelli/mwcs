var expect = require('chai').expect;
require('./test-helper');

angular.module('mwcs', []);

require('../app/services/salaryservice');

describe('Salary service', function () {
    beforeEach(ngModule('mwcs'));

    it('should calculate simple daily wage', inject(function (SalaryService) {
        expect(SalaryService.calculateDailyWage(1)).to.equal(3.75);
    }));

    it('should calculate evening work compensation correctly', inject(function (SalaryService) {
        expect(SalaryService.calculateEveningWorkCompensation(1)).to.equal(4.9);
        expect(SalaryService.calculateEveningWorkCompensation(10)).to.equal(49);
    }));

    it('should calculate overtime correctly for first two hours', inject(function (SalaryService) {
        expect(SalaryService.calculateOvertimeCompensation(1)).to.equal(0.9375);
        expect(SalaryService.calculateOvertimeCompensation(1.5)).to.equal(1.40625);
        expect(SalaryService.calculateOvertimeCompensation(2)).to.equal(1.875);
    }));

    it('should calculate overtime correctly for next two hours', inject(function (SalaryService) {
        expect(SalaryService.calculateOvertimeCompensation(2.5)).to.equal(2.8125);
        expect(SalaryService.calculateOvertimeCompensation(3)).to.equal(3.75);
        expect(SalaryService.calculateOvertimeCompensation(4)).to.equal(5.625);
    }));

    it('should calculate overtime correctly for subsequent hours', inject(function (SalaryService) {
        expect(SalaryService.calculateOvertimeCompensation(5)).to.equal(9.375);
        expect(SalaryService.calculateOvertimeCompensation(8)).to.equal(20.625);
        expect(SalaryService.calculateOvertimeCompensation(10)).to.equal(28.125);
    }));

    it('should calculate total daily pay correctly', inject(function (SalaryService) {
        var dailyWage = SalaryService.calculateDailyWage(8); // 30
        expect(dailyWage).to.equal(30);
        var eveningWork = SalaryService.calculateEveningWorkCompensation(1); // 4.9
        expect(eveningWork).to.equal(4.9);
        var overtime = SalaryService.calculateOvertimeCompensation(1); // 0.9375
        expect(overtime).to.equal(0.9375);

        expect(SalaryService.calculateTotalDailyPay(dailyWage, eveningWork, overtime)).to.equal(35.8375);
    }));
});