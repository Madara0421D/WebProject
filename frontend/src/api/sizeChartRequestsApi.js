// frontend/src/api/sizeChartRequestsApi.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/sizeChartRequests'; // Update to your backend URL

const getSizeChartRequests = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

const createSizeChartRequest = async (request) => {
    const response = await axios.post(BASE_URL, request);
    return response.data;
};

const updateSizeChartRequest = async (id, updatedRequest) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedRequest);
    return response.data;
};

const deleteSizeChartRequest = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};

// Function to generate PDF
const generatePDF = async () => {
    const response = await axios.get(`${BASE_URL}/pdf`, { responseType: 'blob' });
    return response.data;
};



export default {
    getSizeChartRequests,
    createSizeChartRequest,
    updateSizeChartRequest,
    deleteSizeChartRequest,
    generatePDF,
};



