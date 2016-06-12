var expect = require('chai').expect;
var _ = require('lodash')
require('./test-helper');
require('../app/controllers/mwcscontroller');

var scope;
var ctrl;

describe('mwcs controller', function () {
    beforeEach(ngModule('mwcs'));
    
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('mwcsCtrl', {$scope: scope});
    }));

    it('should have default encoding', function () {
        expect(scope.encoding).to.equal('ISO-8859-1');
    });
    
    it('should calculate salaries when results is set', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,12:00,13:00']
        }
        
        scope.$apply(function () {
            scope.results = results;    
        });
        expect(_.isEmpty(scope.salaries)).not.to.equal(true);
    });
    
    it('should calculate salaries with multiple persons', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,12:00,13:00', 'James Testy,2,1.1.2011,12:00,13:00']
        }
        
        scope.$apply(function () {
            scope.results = results;    
        });
        expect(_.keys(scope.salaries).length).to.equal(2);
        expect(scope.salaries['1'].salary).to.equal(3.75);
        expect(scope.salaries['2'].salary).to.equal(3.75);
    });
    
    it('should calculate salaries correctly with single shift during normal hours', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,12:00,13:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(3.75);
    });
    
    it('should calculate 1 hour evening work in morning', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,05:00,06:00']
        }
        scope.results = results;
        scope.$apply();
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(1.15);
    });
    
    it('should calculate salaries correctly with shift completely in evening work', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,01:00,03:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(2.3);
        expect(scope.salaries['1'].salary).to.equal(9.8);
    });
    
    it('should calculate salaries correctly with 2 hours overtime', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,06:00,16:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(39.38);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(0);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(1.88);
    });
    
    it('should calculate salaries correctly with 4 hours overtime', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,06:00,18:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(50.63);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(0);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(5.63);
    });
    
    it('should calculate salaries correctly with 6 hours overtime and 2 hours evening', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,06:00,20:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(67.93);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(2.3);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(13.13);
    });
    
    it('should calculate salaries correctly with 1 hours overtime and 1 hours in morning', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,05:00,14:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(35.84);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(1.15);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(0.94);
    });
    
    it('should calculate salaries correctly with 1 hours overtime and 1 hours in evening', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,10:00,19:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(35.84);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(1.15);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(0.94);
    });
    
    it('should calculate salaries correctly with shift continuing next day', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,18:00,02:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(39.2);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(9.2);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(0);
    });
    
    it('should calculate evening work correctly with shift continuing next day', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,18:00,04:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(11.5);
    });
    
    it('should calculate salaries correctly with shift starting from morning and ending next morning', function () {
        var results = {
            header: ['Person Name', 'Person ID', 'Date', 'Start', 'End'],
            content: ['John Doe,1,1.1.2011,05:00,04:00']
        }
        scope.results = results;
        scope.$apply();
        expect(_.keys(scope.salaries).length).to.equal(1);
        expect(scope.salaries['1'].salary).to.equal(145.78);
        expect(scope.salaries['1'].totalEveningWorkCompensation).to.equal(12.65);
        expect(scope.salaries['1'].totalOvertimeCompensation).to.equal(46.88);
    });
});