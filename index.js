const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;
conn.once('open', () => {
  console.log('Connected to MongoDB');
});

const adminUserRoutes = require('./routes/adminUsers');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

app.use('/api', adminUserRoutes);
app.use('/api', eventRoutes);
app.use('/api', userRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Capstone Project API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

