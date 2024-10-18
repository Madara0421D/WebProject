//backend/models/SizeChartRequest.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeChartRequestSchema = new Schema({
    country: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    measurements: {
        chest: { type: Number, required: true },
        waist: { type: Number, required: true },
        hip: { type: Number, required: true },
        sleeveLength: { type: Number, required: true }
    },
    date: {
        type: Date,
        required: true
    },
    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('SizeChartRequest', sizeChartRequestSchema);

