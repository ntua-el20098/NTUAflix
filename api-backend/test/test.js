const app = require('../app');
const request = require('supertest');

const nameID = 'nm0615736';

const expected_json_return = {"name": "Musidora", "nameID": "nm0615736", "namePoster": "https://image.tmdb.org/t/p/{width_variable}/kHiLG0lyy5WqqxsLgYPAi61R37p.jpg", "nameTitles": [{"category": "self", "titleID": "tt0015414"}], "profession": "actress,director,writer"}

describe('Test (GET Request: {baseurl}/name/:nameID)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .get('/ntuaflix_api/name/' + nameID)
        .end((err, res) => {
            response = res.body;
            expect(res.status).toBe(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(response).toMatchObject(expected_json_return);
    })
});