const constructURL = require('../lib/constructURL');

describe('healthcheck URL ', () => {
    it('healthcheck', () => {
        expect( constructURL('/admin/', 'healthcheck') )
        .toBe('http://localhost:9876/ntuaflix_api/admin/healthcheck');
    });
});

describe('name url ', () => {
    it('name', () => {
        expect(constructURL('/name/', 'nm0615736') )
        .toBe('http://localhost:9876/ntuaflix_api/name/nm0615736');
    });
});

describe('title url ', () => {
    it('title', () => {
        expect(constructURL('/title/', 'tt0015414') )
        .toBe('http://localhost:9876/ntuaflix_api/title/tt0015414');
    });
});

