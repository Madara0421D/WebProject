//backend/controllers/designRequestsController.js
const DesignRequest = require('../models/DesignRequest');
const PDFDocument = require('pdfkit');


// Create Request
exports.createDesignRequest = async (req, res) => {
    const { patternId, patternName, material, size, country, date, approvalStatus } = req.body;
    const newRequest = new DesignRequest({ patternId, patternName, material, size, country, date, approvalStatus });

    try {
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating request:', error); // Log error for debugging
        res.status(400).json({ error: 'Error creating request' });
    }
};

// Read All Requests
exports.getDesignRequests = async (req, res) => {
    try {
        const requests = await DesignRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error); // Log error for debugging
        res.status(500).json({ error: 'Error fetching requests' });
    }
};

// Update Request
exports.updateDesignRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRequest = await DesignRequest.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error('Error updating request:', error); // Log error for debugging
        res.status(400).json({ error: 'Error updating request' });
    }
};

// Delete Request
exports.deleteDesignRequest = async (req, res) => {
    const { id } = req.params;
    try {
        await DesignRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'Request deleted' });
    } catch (error) {
        console.error('Error deleting request:', error); // Log error for debugging
        res.status(400).json({ error: 'Error deleting request' });
    }
};

// Generate PDF Report
exports.generatePDF = async (req, res) => {
    try {
        const requests = await DesignRequest.find();
        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(pdfData),
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename=DesignRequests.pdf',
            }).end(pdfData);
        });

        // PDF content
        doc.fontSize(20).text('Design Requests Report', { align: 'center' });
        doc.moveDown();

        requests.forEach(request => {
            doc.fontSize(12).text(`Pattern ID: ${request.patternId}`);
            doc.text(`Pattern Name: ${request.patternName}`);
            doc.text(`Material: ${request.material}`);
            doc.text(`Size: ${request.size}`);
            doc.text(`Country: ${request.country}`);
            doc.text(`Date: ${new Date(request.date).toDateString()}`);
            doc.text(`Approval Status: ${request.approvalStatus}`);
            doc.moveDown();
        });

        doc.moveDown().text('Signature: __________________________', { align: 'right' });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error); // Log error for debugging
        res.status(500).json({ error: 'Error generating PDF' });
    }
};

