//frontend/src/pages/SizeChartRequests.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this package is installed
import './SizeChartRequests.css';

const SizeChartRequests = () => {
    const [country, setCountry] = useState('');
    const [size, setSize] = useState('');
    const [measurements, setMeasurements] = useState({ chest: '', waist: '', hip: '', sleeveLength: '' });
    const [date, setDate] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('Pending');
    const [previousRequests, setPreviousRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const BASE_URL = 'http://localhost:5000/api/sizeChartRequests';

    // Fetch requests on component mount
    const fetchRequests = useCallback(async () => {
        const requests = await axios.get(BASE_URL);
        setPreviousRequests(requests.data);
        setFilteredRequests(requests.data);
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        // Filter requests based on the search query
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = previousRequests.filter(request =>
            request.country.toLowerCase().includes(lowercasedQuery) ||
            request.size.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredRequests(filtered);
    }, [searchQuery, previousRequests]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRequest = { country, size, measurements, date, approvalStatus };

        if (isEditing) {
            await axios.put(`${BASE_URL}/${editingId}`, newRequest);
            setIsEditing(false);
            setEditingId(null);
        } else {
            await axios.post(BASE_URL, newRequest);
        }

        fetchRequests();
        resetForm();
    };

    const handleEdit = (request) => {
        setCountry(request.country);
        setSize(request.size);
        setMeasurements(request.measurements);
        setDate(request.date);
        setApprovalStatus(request.approvalStatus);
        setIsEditing(true);
        setEditingId(request._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
        fetchRequests();
    };

    const resetForm = () => {
        setCountry('');
        setSize('');
        setMeasurements({ chest: '', waist: '', hip: '', sleeveLength: '' });
        setDate('');
        setApprovalStatus('Pending');
    };

    // Handle PDF generation
    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('DILFER', 14, 22);

        // Table Data
        doc.autoTable({
            head: [['Country', 'Size', 'Chest', 'Waist', 'Hip', 'Sleeve Length', 'Date', 'Approval Status']],
            body: filteredRequests.map(request => [
                request.country,
                request.size,
                request.measurements.chest,
                request.measurements.waist,
                request.measurements.hip,
                request.measurements.sleeveLength,
                request.date ? request.date.substring(0, 10) : 'No date',
                request.approvalStatus,
            ]),
            startY: 30,
        });

        // Signature
        const pageHeight = doc.internal.pageSize.height; // Get the height of the page
        const signatureY = pageHeight - 40; // Set Y position above the bottom

        doc.setFontSize(10); // Set smaller font size for signature
        doc.text('Signature:', doc.internal.pageSize.width - 50, signatureY, { align: 'right' }); // Align right
        doc.line(doc.internal.pageSize.width - 60, signatureY + 5, doc.internal.pageSize.width - 10, signatureY + 5); // Signature line

        // Save the PDF
        doc.save('SizeChartRequests.pdf');
    };

    // Input change handlers with validations
    const handleCountryChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) { // Allow only alphanumeric characters and spaces
            setCountry(value);
        }
    };

    const handleSizeChange = (value) => {
        if (/^[a-zA-Z0-9\s]*$/.test(value)) { // Allow only alphanumeric characters and spaces
            setSize(value);
        }
    };

    const handleMeasurementChange = (field, value) => {
        if (/^\d*\.?\d*$/.test(value) && (value === '' || Number(value) >= 0)) { // Allow only positive numbers
            setMeasurements({ ...measurements, [field]: value });
        }
    };

    const handleDateChange = (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        selectedDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        if (selectedDate <= today) {
            setDate(value);
        } else {
            alert("You cannot select a future date.");
        }
    };

    return (
        <div>
            <h2>{isEditing ? 'Edit Size Chart' : 'Size Chart Form'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
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
                    type="number"
                    placeholder="Chest Measurement"
                    value={measurements.chest}
                    onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Waist Measurement"
                    value={measurements.waist}
                    onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Hip Measurement"
                    value={measurements.hip}
                    onChange={(e) => handleMeasurementChange('hip', e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Sleeve Length Measurement"
                    value={measurements.sleeveLength}
                    onChange={(e) => handleMeasurementChange('sleeveLength', e.target.value)}
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
                <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button type="submit">{isEditing ? 'Update Request' : 'Submit Request'}</button>
                {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
            </form>

            <h3>Previous Size Charts</h3>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
            />
            <table className="size-chart-table">
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Size</th>
                        <th>Chest</th>
                        <th>Waist</th>
                        <th>Hip</th>
                        <th>Sleeve Length</th>
                        <th>Date</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests && filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.country}</td>
                                <td>{request.size}</td>
                                <td>{request.measurements.chest}</td>
                                <td>{request.measurements.waist}</td>
                                <td>{request.measurements.hip}</td>
                                <td>{request.measurements.sleeveLength}</td>
                                <td>{request.date ? request.date.substring(0, 10) : 'No date'}</td>
                                <td>{request.approvalStatus}</td>
                                <td>
                                    <button onClick={() => handleEdit(request)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDelete(request._id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: 'center' }}>No requests found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add the "Generate PDF" button */}
            <button onClick={handleGeneratePDF}>Generate PDF</button>
        </div>
    );
};

export default SizeChartRequests;
