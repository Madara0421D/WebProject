// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Home component
import DesignRequests from './pages/DesignRequests'; // Design Requests component
import SizeChartRequests from './pages/SizeChartRequests'; // Size Chart Requests component
import MaterialRequests from './pages/MaterialRequests'; // Material Requests component
import Sidebar from './components/Sidebar'; // Sidebar component

function App() {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                {/* Sidebar Component */}
                <Sidebar />
                
                {/* Main Content Area */}
                <div style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/size-chart-requests" element={<SizeChartRequests />} />
                        <Route path="/material-requests" element={<MaterialRequests />} />
                        <Route path="/design-requests" element={<DesignRequests />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
