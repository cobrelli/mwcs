var expect = require('chai').expect;
require('./test-helper');
require('../app/services/salaryservice');

var salaryService;

describe('Salary service', function () {
    beforeEach(ngModule('mwcs'));

    beforeEach(inject(function (SalaryService) {
        salaryService = SalaryService;
    }));

    it('should calculate simple daily wage', function () {
        expect(salaryService.calculateDailyWage(1)).to.equal(3.75);
    });

    it('should calculate evening work compensation correctly', function () {
        expect(salaryService.calculateEveningWorkCompensation(1)).to.equal(4.9);
        expect(salaryService.calculateEveningWorkCompensation(10)).to.equal(49);
    });

    it('should calculate overtime correctly for first two hours', function () {
        expect(salaryService.calculateOvertimeCompensation(1)).to.equal(0.9375);
        expect(salaryService.calculateOvertimeCompensation(1.5)).to.equal(1.40625);
        expect(salaryService.calculateOvertimeCompensation(2)).to.equal(1.875);
    });

    it('should calculate overtime correctly for next two hours', function () {
        expect(salaryService.calculateOvertimeCompensation(2.5)).to.equal(2.8125);
        expect(salaryService.calculateOvertimeCompensation(3)).to.equal(3.75);
        expect(salaryService.calculateOvertimeCompensation(4)).to.equal(5.625);
    });

    it('should calculate overtime correctly for subsequent hours', function () {
        expect(salaryService.calculateOvertimeCompensation(5)).to.equal(9.375);
        expect(salaryService.calculateOvertimeCompensation(8)).to.equal(20.625);
        expect(salaryService.calculateOvertimeCompensation(10)).to.equal(28.125);
    });

    it('should calculate total daily pay correctly', function () {
        var dailyWage = salaryService.calculateDailyWage(8); // 30
        expect(dailyWage).to.equal(30);
        var eveningWork = salaryService.calculateEveningWorkCompensation(1); // 4.9
        expect(eveningWork).to.equal(4.9);
        var overtime = salaryService.calculateOvertimeCompensation(1); // 0.9375
        expect(overtime).to.equal(0.9375);

        expect(salaryService.calculateTotalDailyPay(dailyWage, eveningWork, overtime)).to.equal(35.8375);
    });
});