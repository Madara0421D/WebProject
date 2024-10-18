// frontend/src/pages/MaterialRequests.js
import React, { useState, useEffect } from 'react';
import materialRequestsApi from '../api/materialRequestsApi';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Make sure to install this package
import './MaterialsRequests.css';

const MaterialRequests = () => {
    // Form state
    const [materialId, setMaterialId] = useState('');
    const [materialName, setMaterialName] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [approvalStatus, setApprovalStatus] = useState('Pending');
    const [searchTerm, setSearchTerm] = useState('');

    // Previous requests
    const [previousRequests, setPreviousRequests] = useState([]);

    // Track the ID of the request being updated (null means create new)
    const [updatingRequestId, setUpdatingRequestId] = useState(null);

    // Fetch material requests from API
    const fetchMaterialRequests = async () => {
        try {
            const requests = await materialRequestsApi.getMaterialRequests();
            setPreviousRequests(requests);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        fetchMaterialRequests(); // Fetch on component mount
    }, []);

    // Handle form submission (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRequest = { materialId, materialName, type, date, quantity, approvalStatus };

        try {
            if (updatingRequestId) {
                // Update existing request
                await materialRequestsApi.updateMaterialRequest(updatingRequestId, newRequest);
            } else {
                // Create new request
                await materialRequestsApi.createMaterialRequest(newRequest);
            }

            // Clear the form fields after submission
            clearForm();

            // Refresh the requests list
            fetchMaterialRequests();
        } catch (error) {
            console.error('Error submitting the request:', error);
        }
    };

    // Clear form function
    const clearForm = () => {
        setMaterialId('');
        setMaterialName('');
        setType('');
        setDate('');
        setQuantity(0);
        setApprovalStatus('Pending');
        setUpdatingRequestId(null);
    };

    // Handle request update (pre-fill form with existing data)
    const handleUpdate = (request) => {
        setMaterialId(request.materialId);
        setMaterialName(request.materialName);
        setType(request.type);
        setDate(request.date);
        setQuantity(request.quantity);
        setApprovalStatus(request.approvalStatus);
        setUpdatingRequestId(request._id);
    };

    // Handle request deletion
    const handleDelete = async (id) => {
        try {
            await materialRequestsApi.deleteMaterialRequest(id);
            fetchMaterialRequests(); // Refresh the requests list
        } catch (error) {
            console.error('Error deleting the request:', error);
        }
    };

    // Handle PDF generation
    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('DILFER', 14, 22);

        // Table Data
        doc.autoTable({
            head: [['Material ID', 'Material Name', 'Type', 'Date', 'Quantity', 'Approval Status']],
            body: previousRequests.map(request => [
                request.materialId,
                request.materialName,
                request.type,
                request.date ? request.date.substring(0, 10) : 'No date',
                request.quantity,
                request.approvalStatus,
            ]),
            startY: 30,
        });

        // Signature
        const pageHeight = doc.internal.pageSize.height;
        const signatureY = pageHeight - 40;

        doc.setFontSize(10);
        doc.text('Signature:', doc.internal.pageSize.width - 50, signatureY, { align: 'right' });
        doc.line(doc.internal.pageSize.width - 60, signatureY + 5, doc.internal.pageSize.width - 10, signatureY + 5);

        // Save the PDF
        doc.save('MaterialRequests.pdf');
    };

    // Input change handlers with validations
    const handleMaterialIdChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
            setMaterialId(value);
        }
    };

    const handleMaterialNameChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
            setMaterialName(value);
        }
    };

    const handleTypeChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
            setType(value);
        }
    };

    const handleDateChange = (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
            setDate(value);
        } else {
            alert("You cannot select a future date.");
        }
    };

    const handleQuantityChange = (value) => {
        if (/^[0-9]*$/.test(value)) {
            setQuantity(Number(value));
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtered requests based on search term
    const filteredRequests = previousRequests.filter(request =>
        (request.materialId && request.materialId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.materialName && request.materialName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.type && request.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.quantity && request.quantity.toString().includes(searchTerm))
    );

    return (
        <div>
            <h2>Material Request Form</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Material ID"
                    value={materialId}
                    onChange={(e) => handleMaterialIdChange(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Material Name"
                    value={materialName}
                    onChange={(e) => handleMaterialNameChange(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Type"
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    required
                />
                <label htmlFor="date">Creating Date:</label>
                <input
                    type="date"
                    placeholder="Create Date"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    required
                />
                <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button type="submit">{updatingRequestId ? 'Update Request' : 'Submit Request'}</button>
                <button type="button" onClick={clearForm}>Clear Form</button>
            </form>

            <h3>Previous Material Requests</h3>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '100%', padding: '8px' }}
            />
            <table className="material-requests-table">
                <thead>
                    <tr>
                        <th>Material ID</th>
                        <th>Material Name</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.materialId}</td>
                                <td>{request.materialName}</td>
                                <td>{request.type}</td>
                                <td>{request.date ? request.date.substring(0, 10) : 'No date'}</td>
                                <td>{request.quantity}</td>
                                <td>{request.approvalStatus}</td>
                                <td>
                                    <button onClick={() => handleUpdate(request)} className="update-button">Update</button>
                                    <button onClick={() => handleDelete(request._id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No requests found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Generate PDF Button */}
            <button onClick={handleGeneratePDF} style={{ marginTop: '20px' }}>Generate PDF</button>
        </div>
    );
};

export default MaterialRequests;
