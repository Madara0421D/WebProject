//frontend/src/pages/DesignRequests.js
import './DesignRequests.css'; // Adjust the path according to your file structure
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import designRequestsApi from '../api/designRequestsApi';

const BASE_URL = 'http://localhost:5000/api/designRequests';

const DesignRequests = () => {
    // Form state
    const [patternId, setPatternId] = useState('');
    const [patternName, setPatternName] = useState('');
    const [material, setMaterial] = useState('');
    const [size, setSize] = useState('');
    const [country, setCountry] = useState('');
    const [date, setDate] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('Pending');
    
    // Previous requests
    const [previousRequests, setPreviousRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input

    // Track the ID of the request being updated (null means create new)
    const [updatingRequestId, setUpdatingRequestId] = useState(null);

    // Fetch design requests from API
    const fetchDesignRequests = async () => {
        const requests = await designRequestsApi.getDesignRequests();
        setPreviousRequests(requests);
    };

    useEffect(() => {
        fetchDesignRequests(); // Fetch on component mount
    }, []);

    // Handle form submission (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRequest = { patternId, patternName, material, size, country, date, approvalStatus };

        try {
            if (updatingRequestId) {
                // Update existing request
                await designRequestsApi.updateDesignRequest(updatingRequestId, newRequest);
            } else {
                // Create new request
                await designRequestsApi.createDesignRequest(newRequest);
            }

            // Clear the form fields after submission
            clearForm();

            // Refresh the requests list
            await fetchDesignRequests();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Clear form function
    const clearForm = () => {
        setPatternId('');
        setPatternName('');
        setMaterial('');
        setSize('');
        setCountry('');
        setDate('');
        setApprovalStatus('Pending');
        setUpdatingRequestId(null); // Reset to create new request
    };

    // Handle request update (pre-fill form with existing data)
    const handleUpdate = (request) => {
        setPatternId(request.patternId);
        setPatternName(request.patternName);
        setMaterial(request.material);
        setSize(request.size);
        setCountry(request.image);
        setDate(request.date);
        setApprovalStatus(request.approvalStatus);
        setUpdatingRequestId(request._id); // Set the request ID to track update
    };

    // Handle request deletion
    const handleDelete = async (id) => {
        await designRequestsApi.deleteDesignRequest(id);
        fetchDesignRequests(); // Refresh the requests list
    };

    // Function to generate PDF
    const handleGeneratePDF = async () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('DILFER', 14, 20);

        const tableData = previousRequests.map((request) => [
            request.patternId,
            request.patternName,
            request.material,
            request.size,
            request.country,
            request.date ? request.date.substring(0, 10) : 'No date',
            request.approvalStatus,
        ]);

        doc.autoTable({
            head: [['Pattern ID', 'Pattern Name', 'Material', 'Size','Country', 'Date', 'Approval Status']],
            body: tableData,
            startY: 30,
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
        });

        // Set smaller font for the signature
        doc.setFontSize(10);

        // Calculate the width of the signature text
        const signatureText = 'Signature: ___________________________';
        const pageWidth = doc.internal.pageSize.width;
        const textWidth = doc.getTextWidth(signatureText);

        // Place the signature at the bottom right
        const pageHeight = doc.internal.pageSize.height;
        doc.text(signatureText, pageWidth - textWidth - 14, pageHeight - 10);

        doc.save('DesignRequests.pdf');
    };

    // Input change handlers with validations
    const handlePatternIdChange = (value) => {
        if (/^[a-zA-Z0-9]*$/.test(value)) { // Allow only alphanumeric characters
            setPatternId(value);
        }
    };

    const handlePatternNameChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) { // Allow only alphanumeric characters and spaces
            setPatternName(value);
        }
    };

    const handleMaterialChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) { // Allow only alphanumeric characters and spaces
            setMaterial(value);
        }
    };

    const handleSizeChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) { // Allow only alphanumeric characters and spaces
            setSize(value);
        }
    };

    const handleCountryChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) { // Allow only alphanumeric characters and spaces
            setCountry(value); // Set the correct state
        }
    };
    

    const handleDateChange = (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        selectedDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        if (selectedDate <= today) {
            setDate(value);
        } else {
            alert("You cannot select a future date.");
        }
    };

    // Filtered requests based on search term
    const filteredRequests = previousRequests.filter((request) =>
        request.patternId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.patternName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.size.toLowerCase().includes(searchTerm.toLowerCase())||
        request.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>New Design Form</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Pattern ID"
                    value={patternId}
                    onChange={(e) => handlePatternIdChange(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Pattern Name"
                    value={patternName}
                    onChange={(e) => handlePatternNameChange(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Material"
                    value={material}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Size"
                    value={size}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    required
                />
                <label htmlFor="date">Creating Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
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

            <h3>Previous Designs</h3>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '5px', width: '100%' }}
            />
            <table className="designs-table">
                <thead>
                    <tr>
                        <th>Pattern ID</th>
                        <th>Pattern Name</th>
                        <th>Material</th>
                        <th>Size</th>
                        <th>Country</th>
                        <th>Date</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.patternId}</td>
                                <td>{request.patternName}</td>
                                <td>{request.material}</td>
                                <td>{request.size}</td>
                                <td>{request.country}</td>
                                <td>{request.date ? request.date.substring(0, 10) : 'No date'}</td>
                                <td>{request.approvalStatus}</td>
                                <td>
                                    <button onClick={() => handleUpdate(request)} className="update-button">Update</button>
                                    <button onClick={() => handleDelete(request._id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No requests found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Generate PDF Button */}
            <button onClick={handleGeneratePDF}>Generate PDF Report</button>
        </div>
    );
};

export default DesignRequests;
