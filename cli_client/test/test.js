const constructURL = require('../lib/constructURL');

describe('healthcheck URL ', () => {
    it('healthcheck', () => {
        expect( constructURL('/admin/', 'healthcheck') )
        .toBe('http://localhost:9876/ntuaflix_api/admin/healthcheck');
    });
});

