//backend/models/MaterialRequest.js
const mongoose = require('mongoose');

const MaterialRequestSchema = new mongoose.Schema({
    materialId: { type: String, required: true },
    materialName: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    quantity : { type: String, required: true },
    approvalStatus: { type: String, required: true }
});

module.exports = mongoose.model('MaterialRequest', MaterialRequestSchema);

