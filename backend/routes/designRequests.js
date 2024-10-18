//backend/routes/designRequests.js
const express = require('express');

const {
    createDesignRequest,
    getDesignRequests,
    updateDesignRequest,
    deleteDesignRequest,
    generatePDF
} = require('../controllers/designRequestsController');
const router = express.Router();

router.post('/', createDesignRequest); // Create
router.get('/', getDesignRequests); // Read
router.put('/:id', updateDesignRequest); // Update
router.delete('/:id', deleteDesignRequest); // Delete
router.get('/pdf', generatePDF); // Generate PDF report

module.exports = router;

