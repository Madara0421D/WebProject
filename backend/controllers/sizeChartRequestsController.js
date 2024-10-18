// backend/controllers/sizeChartRequestsController.js
const SizeChartRequest = require('../models/SizeChartRequest');
const PDFDocument = require('pdfkit');

// Create a size chart request
const createSizeChartRequest = async (req, res) => {
    try {
        console.log('Data received:', req.body);  // Log the data being received
        const sizeChartRequest = new SizeChartRequest(req.body);
        await sizeChartRequest.save();
        res.status(201).json(sizeChartRequest);
    } catch (error) {
        console.error('Error creating size chart request:', error.message);
        res.status(500).json({ message: 'Server error creating size chart request', error: error.message });
    }
};

// Get all size chart requests
const getSizeChartRequests = async (req, res) => {
    try {
        const sizeChartRequests = await SizeChartRequest.find({});
        res.status(200).json(sizeChartRequests);
    } catch (error) {
        console.error('Error fetching size chart requests:', error.message);  // More detailed error logging
        res.status(500).json({ message: 'Server error fetching size chart requests', error: error.message });
    }
};

// Update a size chart request by ID
const updateSizeChartRequest = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedRequest = await SizeChartRequest.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedRequest) return res.status(404).json({ message: "Size Chart Request not found" });
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ error: 'Error updating size chart request' });
    }
};

// Delete a size chart request by ID
const deleteSizeChartRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRequest = await SizeChartRequest.findByIdAndDelete(id);
        if (!deletedRequest) return res.status(404).json({ message: "Size Chart Request not found" });
        res.status(200).json({ message: "Size Chart Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting size chart request' });
    }
};

// Generate PDF for size chart requests
const generatePDF = async (req, res) => {
    try {
        const sizeChartRequests = await SizeChartRequest.find({});
        
        // Create a new PDF document
        const doc = new PDFDocument();
        
        // Set the response type to PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sizeChartRequests.pdf');
        
        doc.pipe(res);  // Stream the PDF to the response
        
        // Add a title
        doc.fontSize(20).text('Size Chart Requests', { align: 'center' });

        // Add a table-like structure for each request
        sizeChartRequests.forEach((request, index) => {
            doc.moveDown(1);
            doc.fontSize(12).text(`${index + 1}. Country: ${request.country}, Size: ${request.size}`);
            doc.text(`   Measurements: Chest: ${request.measurements.chest}, Waist: ${request.measurements.waist}, Hip: ${request.measurements.hip}, Sleeve Length: ${request.measurements.sleeveLength}`);
            doc.text(`   Date: ${request.date}, Approval Status: ${request.approvalStatus}`);
        });
        
        // Add signature space
        doc.moveDown(2).text('Signature: ___________________', { align: 'left' });

        // Finalize the PDF and end the stream
        doc.end();
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};

module.exports = {
    createSizeChartRequest,
    getSizeChartRequests,
    updateSizeChartRequest,
    deleteSizeChartRequest,
    generatePDF
};
