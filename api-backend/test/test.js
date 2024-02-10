const { describe } = require('node:test');
const app = require('../app');
const request = require('supertest');

// Test 1: GET Request to {baseurl}/title/:titleID
const titleID = 'tt0015414';
const expected_json_return1 = 
{
    "titleObject": {
        "titleID": "tt0015414",
        "type": "movie",
        "originalTitle": "La tierra de los toros",
        "titlePoster": "https://image.tmdb.org/t/p/{width_variable}/hIPPcKfGfmr435bLWICRxPSfiDR.jpg",
        "startYear": "2000",
        "endYear": "",
        "genres": [
            {
                "genreTitle": ""
            }
        ],
        "titleAkas": [
            {
                "akaTitle": "La tierra de los toros",
                "regionAbbrev": "ES"
            },
            {
                "akaTitle": "La tierra de los toros",
                "regionAbbrev": ""
            },
            {
                "akaTitle": "La terre des taureaux",
                "regionAbbrev": "FR"
            },
            {
                "akaTitle": "The Land of the Bulls",
                "regionAbbrev": "XWW"
            },
            {
                "akaTitle": "La Terre des taureaux",
                "regionAbbrev": "FR"
            }
        ],
        "principals": [
            {
                "nameID": "nm0147437",
                "name": "Antonio Cañero",
                "category": "self"
            },
            {
                "nameID": "nm0615736",
                "name": "Musidora",
                "category": "self, director"
            }
        ],
        "rating": {
            "avRating": "5.2",
            "nVotes": "16"
        }
    }
};

describe('Test (GET Request: {baseurl}/title/:titleID)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .get('/ntuaflix_api/title/' + titleID)
        .end((err, res) => {
            response = res.body;
            expect(res.status).toBe(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(response).toMatchObject(expected_json_return1);
    })
});

// Test 2: GET Request to {baseurl}/searchtitle
const expected_json_return2 =
[
    {
        "titleObject": {
            "titleID": "tt0099028",
            "type": "movie",
            "originalTitle": "American Dream",
            "titlePoster": "https://image.tmdb.org/t/p/{width_variable}/da6DPUrYsi3K2HzwalUpphtOHec.jpg",
            "startYear": "1990",
            "endYear": "",
            "genres": [
                {
                    "genreTitle": "Documentary"
                }
            ],
            "titleAkas": [
                {
                    "akaTitle": "American Dream",
                    "regionAbbrev": "US"
                },
                {
                    "akaTitle": "Αμερικάνικο όνειρο",
                    "regionAbbrev": "GR"
                },
                {
                    "akaTitle": "Американская мечта",
                    "regionAbbrev": "SUHH"
                },
                {
                    "akaTitle": "Amerykański sen",
                    "regionAbbrev": "PL"
                },
                {
                    "akaTitle": "American Dream",
                    "regionAbbrev": "GB"
                },
                {
                    "akaTitle": "American Dream",
                    "regionAbbrev": ""
                }
            ],
            "principals": [
                {
                    "nameID": "nm0004453",
                    "name": "Arthur Cohn",
                    "category": "producer"
                },
                {
                    "nameID": "nm0135199",
                    "name": "Cathy Caplan",
                    "category": "director"
                },
                {
                    "nameID": "nm0359735",
                    "name": "Thomas Haneke",
                    "category": "director"
                },
                {
                    "nameID": "nm0465932",
                    "name": "Barbara Kopple",
                    "category": "director"
                },
                {
                    "nameID": "nm0798023",
                    "name": "Lawrence Silk",
                    "category": "director"
                },
                {
                    "nameID": "nm0806498",
                    "name": "Michael Small",
                    "category": "composer"
                },
                {
                    "nameID": "nm14905879",
                    "name": "Wayne Goodnature",
                    "category": "self"
                },
                {
                    "nameID": "nm14905883",
                    "name": "Lewie Anderson",
                    "category": "self"
                },
                {
                    "nameID": "nm14905884",
                    "name": "R.J. Bergstrom",
                    "category": "self"
                },
                {
                    "nameID": "nm14905885",
                    "name": "Ron Bergstrom",
                    "category": "self"
                }
            ],
            "rating": {
                "avRating": "7.8",
                "nVotes": "972"
            }
        }
    }
];

describe ('Test (GET Request: {baseurl}/searchname)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .get('/ntuaflix_api/searchtitle')
        .send(
            {
                "tqueryObject": {
                    "titlePart": "american"
                }
            }
        )
        .end((err, res) => {
            response = res.body;
            expect(res.status).toBe(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(response).toMatchObject(expected_json_return2);
    })
});

// Test 3: GET Request to {baseurl}/bygenre
const expected_json_return3 =
[
    {
        "titleObject": {
            "titleID": "tt0090144",
            "type": "short",
            "originalTitle": "Le temps des bouffons",
            "titlePoster": "https://image.tmdb.org/t/p/{width_variable}/7PVsQkiQsMf5j4pviQgEKJh4BPo.jpg",
            "startYear": "1993",
            "endYear": "",
            "genres": [
                {
                    "genreTitle": "Documentary"
                },
                {
                    "genreTitle": "Short"
                }
            ],
            "titleAkas": [
                {
                    "akaTitle": "Le temps des bouffons",
                    "regionAbbrev": "CA"
                }
            ],
            "principals": [
                {
                    "nameID": "nm0265853",
                    "name": "Pierre Falardeau",
                    "category": "actor, director"
                },
                {
                    "nameID": "nm10165788",
                    "name": "Roger D. Landry",
                    "category": "self"
                }
            ],
            "rating": {
                "avRating": "8.1",
                "nVotes": "233"
            }
        }
    },
    {
        "titleObject": {
            "titleID": "tt0095571",
            "type": "short",
            "originalTitle": "The Making of Monsters",
            "titlePoster": "https://image.tmdb.org/t/p/{width_variable}/zgenzvJ09QuRaduURuBuQzmM4jy.jpg",
            "startYear": "1991",
            "endYear": "",
            "genres": [
                {
                    "genreTitle": "Short"
                }
            ],
            "titleAkas": [
                {
                    "akaTitle": "The Making of Monsters",
                    "regionAbbrev": "CA"
                }
            ],
            "principals": [
                {
                    "nameID": "nm0026523",
                    "name": "Christopher Anderson",
                    "category": "actor"
                },
                {
                    "nameID": "nm0036732",
                    "name": "Stewart Arnott",
                    "category": "actor"
                },
                {
                    "nameID": "nm0340742",
                    "name": "John Greyson",
                    "category": "director, writer"
                },
                {
                    "nameID": "nm0417284",
                    "name": "Miume Jan",
                    "category": "editor"
                },
                {
                    "nameID": "nm0528508",
                    "name": "Laurie Lynd",
                    "category": "producer"
                },
                {
                    "nameID": "nm0532024",
                    "name": "Lee MacDougall",
                    "category": "actor"
                },
                {
                    "nameID": "nm0770765",
                    "name": "Glenn Schellenberg",
                    "category": "composer"
                }
            ],
            "rating": {
                "avRating": "8.4",
                "nVotes": "41"
            }
        }
    }
];

describe('Test (GET Request: {baseurl}/bygenre)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .get('/ntuaflix_api/bygenre?limit=2')
        .send(
            {
                "gqueryObject": {
                  "qgenre": "Short",
                  "minrating": "8"
                }
            }
        )
        .end((err, res) => {
            response = res.body;
            expect(res.status).toBe(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(response).toMatchObject(expected_json_return3);
    })
});


// Test 4: GET Request to {baseurl}/name/:nameID
const nameID = 'nm0615736';
const expected_json_return4 = 
{
    "nameObject": {
        "nameID": "nm0615736",
        "name": "Musidora",
        "namePoster": "https://image.tmdb.org/t/p/{width_variable}/kHiLG0lyy5WqqxsLgYPAi61R37p.jpg",
        "birthYr": 0,
        "deathYr": 1957,
        "profession": "actress,director,writer",
        "nameTitles": [
            {
                "titleID": "tt0015414",
                "category": "self"
            }
        ]
    }
};

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
        expect(response).toMatchObject(expected_json_return4);
    })
});

// Test 5: GET Request to {baseurl}/searchname
const expected_json_return5 =
[
    {
        "nameObject": {
            "nameID": "nm0214172",
            "name": "Georgette Dee",
            "namePoster": "",
            "birthYr": 1958,
            "deathYr": 0,
            "profession": "actress,writer",
            "nameTitles": [
                {
                    "titleID": "tt0099013",
                    "category": "actress"
                }
            ]
        }
    }
]

describe ('Test (GET Request: {baseurl}/searchname)', () => {
    it('Should return data with status 200', (done) => {
        request(app)
        .get('/ntuaflix_api/searchname')
        .send(
            {
                "nqueryObject": {
                    "namePart": "get"
                }
            }
        )
        .end((err, res) => {
            response = res.body;
            expect(res.status).toBe(200);
            done()
        })
    })
    it('Should return an object', () => {
        expect(response).toMatchObject(expected_json_return5);
    })
    
});
