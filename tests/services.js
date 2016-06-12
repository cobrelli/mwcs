var expect = require('chai').expect;
require('./test-helper');

angular.module('mwcs', []);

require('../app/services/salaryservice');

describe('Salary service', function() {
  beforeEach(ngModule('mwcs'));

  it('should calculate simple daily wage', inject(function(SalaryService) {
    expect(SalaryService.calculateDailyWage(1)).to.equal(3.75);
  }));
});