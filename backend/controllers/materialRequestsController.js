//backend/controllers/materialRequestsController.js
const MaterialRequest = require('../models/MaterialRequest');
const PDFDocument = require('pdfkit');

// Create Request
exports.createMaterialRequest = async (req, res) => {
    const { materialId, materialName, type, date , quantity , approvalStatus} = req.body;
    const newRequest = new MaterialRequest({ materialId, materialName, type, date ,quantity  , approvalStatus });
    try {
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: 'Error creating request' });
    }
};

// Read All Requests
exports.getMaterialRequests = async (req, res) => {
    try {
        const requests = await MaterialRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching requests' });
    }
};

// Update Request
exports.updateMaterialRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRequest = await MaterialRequest.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ error: 'Error updating request' });
    }
};

// Delete Request
exports.deleteMaterialRequest = async (req, res) => {
    const { id } = req.params;
    try {
        await MaterialRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'Request deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting request' });
    }
};

// Generate PDF for Material Requests
exports.generateMaterialRequestsPDF = async (req, res) => {
    try {
        const requests = await MaterialRequest.find();

        // Create a PDF document
        const doc = new PDFDocument();

        // Set the headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=MaterialRequests.pdf');

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add PDF title
        doc.fontSize(20).text('Material Requests Report', { align: 'center' });
        doc.moveDown();

        // Add each material request to the PDF
        requests.forEach(request => {
            doc.fontSize(12).text(`Material ID: ${request.materialId}`);
            doc.text(`Material Name: ${request.materialName}`);
            doc.text(`Type: ${request.type}`);
            doc.text(`Date: ${request.date ? request.date.toISOString().split('T')[0] : 'No Date'}`);
            doc.text(`Quantity : ${request.quantity }`);
            doc.text(`Approval Status: ${request.approvalStatus}`);
            doc.moveDown();
        });

        // Finalize the PDF and end the stream
        doc.end();
    } catch (error) {
        res.status(500).json({ error: 'Error generating PDF' });
    }
};

