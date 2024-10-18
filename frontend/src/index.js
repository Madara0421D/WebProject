// frontend/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Find the root element
const container = document.getElementById('root');

// Create a React root
const root = createRoot(container);

// Render the App component in the root
root.render(<App />);

