var expect = require('chai').expect;
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
});