// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import materialRequestsApi from '../api/materialRequestsApi';
import './Home.css';

Chart.register(...registerables);

const Home = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch material data from the API
    const fetchMaterialData = async () => {
        try {
            const requests = await materialRequestsApi.getMaterialRequests();
            const materialIds = requests.map(request => request.materialId);
            const quantities = requests.map(request => request.quantity || 0);

            setChartData({
                labels: materialIds,
                datasets: [
                    {
                        label: 'Material Quantities',
                        data: quantities,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                        hoverBorderColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching material data:', error);
        }
    };

    useEffect(() => {
        fetchMaterialData();
    }, []);

    // Navigate to the respective pages
    const handleSizeCharts = () => {
        navigate('/size-chart-requests'); // Navigate to Size Chart Requests page
    };

    const handleRequestMaterials = () => {
        navigate('/material-requests'); // Navigate to Material Requests page
    };

    const handleCreateDesign = () => {
        navigate('/design-requests'); // Navigate to Design Requests page
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Dashboard</h1>
            <div className="button-container">
            <button onClick={() => navigate('/size-chart-requests')}> Size Chart </button>
            <button onClick={() => navigate('/material-requests')}> Material </button>
            <button onClick={() => navigate('/design-requests')}> Design </button>
            </div>
            <div className="chart-container">
                {loading ? (
                    <p>Loading chart...</p>
                ) : (
                    <Bar 
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            return `${context.dataset.label}: ${context.raw}`;
                                        },
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Materials',
                                    },
                                },
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Quantity',
                                    },
                                },
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
