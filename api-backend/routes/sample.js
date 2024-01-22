const express = require('express');

const upload = require("../middlewares/upload");
const sampleController = require('../controllers/admin');

const titleController = require('../controllers/title');   //title controller
const nameController = require('../controllers/name');     //name controller
const adminController = require('../controllers/admin');   //admin controller

const router = express.Router();
//title endpoints
router.get('/title/:titleID', titleController.getTitleDetails);
router.get('/bygenre', titleController.getTitlesByGenre);
router.post('/bygenre', titleController.getTitlesByGenre);
router.get('/searchtitle', titleController.getSearchByTitle);

//name endpoints
router.get('/searchname', nameController.getSearchPersonByName);
router.get('/name/:nameID', nameController.getPersonDetails);

//admin endpoints
router.get('/admin/healthcheck', adminController.healthcheck);
router.post('/admin/upload/titlebasics',upload.single("file"),adminController.upload_titlebasics);
router.post('/admin/upload/titleakas', upload.single("file"), adminController.upload_titleakas);
router.post('/admin/upload/namebasics', upload.single("file"), adminController.upload_namebasics);
router.post('/admin/upload/titlecrew', upload.single("file"), adminController.upload_titlecrew);
router.post('/admin/upload/titleepisode', upload.single("file"), adminController.upload_titleepisode);
router.post('/admin/upload/titleprincipals', upload.single("file"), adminController.upload_titleprincipals);
router.post('/admin/upload/titleratings', upload.single("file"), adminController.upload_titleratings);

//front-end endpoints
router.post('/bygenre', titleController.getTitlesByGenre);
router.post('/searchbyrating', titleController.getSearchByRating);
router.post('/searchname', nameController.getSearchPersonByName);


module.exports = router;

