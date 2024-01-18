exports.getSample = (req, res, next) => {
    res.status(200).json({ message: 'Hello World!' });
}

exports.getSampleById = (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ message: `Hello World!${id}` });
}

exports.postSample = (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    
    if (!body.name) return res.status(400).json({ message: 'Name body param is required' });
    res.status(200).json({ message: `Hello World! ${id}`, body });
}

exports.getTitlesByGenre = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const {qgenre, minrating, yrFrom, yrTo } = req.body.gqueryObject;

    if (!qgenre || !minrating || isNaN(minrating)) {
        return res.status(400).json({ message: 'Invalid or missing input parameters' });
    }

    const query = `
    SELECT t.tconst, t.titleType, t.primaryTitle, t.originalTitle, t.isAdult, t.startYear, t.endYear, t.runtimeMinutes, t.img_url_asset
    FROM Title t
    JOIN Genre g ON t.tconst = g.tconst
    JOIN Rating r ON t.tconst = r.tconst
    WHERE g.genre = ?
      AND r.averageRating >= ?
      AND (t.startYear BETWEEN ? AND ? OR ? IS NULL OR ? IS NULL)`+ (limit ? ' LIMIT ?' : '');

    const queryParams = [qgenre, minrating, yrFrom, yrTo, yrFrom, yrTo, limit].filter(param => param !== undefined);
    
    pool.getConnection((err, connection) => {
        connection.query(query, queryParams, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });
}


// pws kserw oti epistrefei lista apo obj
// morfopoihsh listas nameTitles sto nameObject
exports.getSearchPersonByName = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const namePart = req.body.nqueryObject;

    const query = `
    SELECT p.nconst, p.primaryName, p.img_url_asset, p.birthYear, p.deathYear, pr.profession
    FROM people p
    JOIN profession pr ON p.nconst = pr.nconst
    WHERE p.primaryName LIKE "%?%"`+ (limit ? ' LIMIT ?' : '');

    const queryParams = [namePart, limit].filter(param => param !== undefined);
    
    pool.getConnection((err, connection) => {
        connection.query(query, queryParams, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });
};

//exports.getPersonDetails = async ()