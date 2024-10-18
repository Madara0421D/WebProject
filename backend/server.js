//backend/server.js
// Importing required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importing routes
const materialRequestsRouter = require('./routes/materialRequests');
const designRequestsRouter = require('./routes/designRequests');
const sizeChartRequestsRoutes = require('./routes/sizeChartRequests');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// Middleware setup
//app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors()); // Enable CORS
//app.use(bodyParser.json()); // Parse JSON bodies
//app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection
mongoose.connect('mongodb+srv://reqITP:reqITP123@itpreqcluster.mcs4w.mongodb.net/?retryWrites=true&w=majority&appName=itpReqCluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB', error);
});

// Route setup
app.use('/api/materialRequests', materialRequestsRouter);
app.use('/api/designRequests', designRequestsRouter);
app.use('/api/sizeChartRequests', sizeChartRequestsRoutes);


// Start the server
//const PORT = process.env.PORT || 5000; // Define the port
//app.listen(PORT, () => {
   // console.log(`Server is running on port ${PORT}`);
//});
