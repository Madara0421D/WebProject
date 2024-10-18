// frontend/src/api/materialRequestsApi.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/materialRequests'; // Update to your backend URL

const getMaterialRequests = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

const createMaterialRequest = async (request) => {
    const response = await axios.post(BASE_URL, request);
    return response.data;
};

const updateMaterialRequest = async (id, request) => {
    const response = await axios.put(`${BASE_URL}/${id}`, request);
    return response.data;
};

const deleteMaterialRequest = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};


const materialRequestsApi = {
    getMaterialRequests,
    createMaterialRequest,
    updateMaterialRequest,
    deleteMaterialRequest,
};

export default materialRequestsApi;
