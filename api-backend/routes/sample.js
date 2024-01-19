const express = require('express');

const sampleController = require('../controllers/sample');

const router = express.Router();


router.get('/title/:titleID', sampleController.getTitleDetails);
router.get('/bygenre', sampleController.getTitlesByGenre);
router.get('/searchname', sampleController.getSearchPersonByName);
router.get('/searchtitle', sampleController.getSearchByTitle);

//router.get('/name/:nameID', sampleController.getPersonDetails);

//admin 
router.get('/admin/healthcheck', sampleController.healthcheck);
router.post('/admin/upload/titlebasics', sampleController.upload_titlebasics);

module.exports = router;