const express = require('express');

const upload = require("../middlewares/upload");

const titleController = require('../controllers/title');   //title controller
const nameController = require('../controllers/name');     //name controller
const adminController = require('../controllers/admin');   //admin controller

const router = express.Router();
//title endpoints
router.get('/title/:titleID', titleController.getTitleDetails);
router.get('/searchtitle', titleController.getSearchByTitle);
router.get('/bygenre', titleController.getTitlesByGenre);

//name endpoints
router.get('/name/:nameID', nameController.getPersonDetails);
router.get('/searchname', nameController.getSearchPersonByName);

//admin endpoints
router.post('/admin/healthcheck', adminController.healthcheck);
router.post('/admin/resetall', adminController.resetall);
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
router.get('/getallgenres', titleController.getAllGenres);
router.post('/searchtitle', titleController.getSearchByTitle);


module.exports = router;

