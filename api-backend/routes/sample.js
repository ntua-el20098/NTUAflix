const express = require('express');

const sampleController = require('../controllers/sample');

const router = express.Router();

router.get('/', sampleController.getSample);
router.get('/:id', sampleController.getSampleById);
router.post('/:id', sampleController.postSample);

router.get('/bygenre', sampleController.getTitlesByGenre);

module.exports = router;