// frontend/src/components/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Optional for styling

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>DILFER</h2>
            <ul><br></br><br></br>
                <li>
                    <Link to="/">Dashboard</Link>
                </li><br></br>
                <li>
                <Link to="/size-chart-requests">Size Chart </Link>
                </li><br></br>
                <li>
                <Link to="/material-requests">Material </Link>
                </li><br></br>
                <li>
                <Link to="/design-requests">Design </Link>
                </li><br></br>
            </ul>
            <button className="logout-btn" >Logout</button>
        </div>
    );
};

export default Sidebar;
