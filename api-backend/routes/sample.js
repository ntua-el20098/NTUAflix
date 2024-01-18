const express = require('express');

const sampleController = require('../controllers/sample');

const router = express.Router();


router.get('/bygenre', sampleController.getTitlesByGenre);
router.get('/searchname', sampleController.getSearchPersonByName);

//router.get('/name/:nameID', sampleController.getPersonDetails);

module.exports = router;