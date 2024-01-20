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
router.get('/searchtitle', titleController.getSearchByTitle);

//name endpoints
router.get('/searchname', nameController.getSearchPersonByName);
router.get('/name/:nameID', nameController.getPersonDetails);

//admin endpoints
router.get('/admin/healthcheck', adminController.healthcheck);
router.post('/admin/upload/titlebasics', upload.single("file"), adminController.upload_titlebasics);

<<<<<<< HEAD
router.get('/name/:nameID', sampleController.getPersonDetails);

//admin 
router.get('/admin/healthcheck', sampleController.healthcheck);
router.post('/admin/upload/titlebasics', upload.single("file"), sampleController.upload_titlebasics);

module.exports = router;
=======
module.exports = router;
>>>>>>> e9ffd1316943e2a4a0314472254b30949fe32a3c
