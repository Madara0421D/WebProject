//backend/routes/materialRequests.js
const express = require('express');
const { createMaterialRequest, getMaterialRequests, updateMaterialRequest, deleteMaterialRequest } = require('../controllers/materialRequestsController');
const router = express.Router();
const { generateMaterialRequestsPDF } = require('../controllers/materialRequestsController');

router.post('/', createMaterialRequest);
router.get('/', getMaterialRequests);
router.put('/:id', updateMaterialRequest);
router.delete('/:id', deleteMaterialRequest);
router.get('/pdf', generateMaterialRequestsPDF);

module.exports = router;

