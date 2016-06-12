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
        expect(salaryService.calculateEveningWorkCompensation(1)).to.equal(1.15);
        expect(salaryService.calculateEveningWorkCompensation(10)).to.equal(11.5);
    });

    it('should calculate overtime correctly for first two hours', function () {
        expect(salaryService.calculateOvertimeCompensation(1)).to.equal(0.94);
        expect(salaryService.calculateOvertimeCompensation(1.5)).to.equal(1.41);
        expect(salaryService.calculateOvertimeCompensation(2)).to.equal(1.88);
    });

    it('should calculate overtime correctly for next two hours', function () {
        expect(salaryService.calculateOvertimeCompensation(2.5)).to.equal(2.81);
        expect(salaryService.calculateOvertimeCompensation(3)).to.equal(3.75);
        expect(salaryService.calculateOvertimeCompensation(4)).to.equal(5.63);
    });

    it('should calculate overtime correctly for subsequent hours', function () {
        expect(salaryService.calculateOvertimeCompensation(5)).to.equal(9.38);
        expect(salaryService.calculateOvertimeCompensation(8)).to.equal(20.63);
        expect(salaryService.calculateOvertimeCompensation(10)).to.equal(28.13);
    });

    it('should calculate total daily pay correctly', function () {
        var dailyWage = salaryService.calculateDailyWage(9); // 33.75
        expect(dailyWage).to.equal(33.75);
        var eveningWork = salaryService.calculateEveningWorkCompensation(1); // 1.15
        expect(eveningWork).to.equal(1.15);
        var overtime = salaryService.calculateOvertimeCompensation(1); // 0.94
        expect(overtime).to.equal(0.94);

        expect(salaryService.calculateTotalDailyPay(dailyWage, eveningWork, overtime)).to.equal(35.84);
    });
});