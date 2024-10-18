//backend/routes/sizeChartRequests.js
const express = require('express');
const {
    createSizeChartRequest,
    getSizeChartRequests,
    updateSizeChartRequest,
    deleteSizeChartRequest,
    generatePDF
} = require('../controllers/sizeChartRequestsController');
const router = express.Router();

router.post('/', createSizeChartRequest); // Create
router.get('/', getSizeChartRequests); // Read
router.put('/:id', updateSizeChartRequest); // Update
router.delete('/:id', deleteSizeChartRequest); // Delete
router.get('/pdf', generatePDF); // Generate PDF report

module.exports = router;

