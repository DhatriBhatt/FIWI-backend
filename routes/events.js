// routes.js
const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

module.exports = (upload, gfs) => {
  const router = express.Router();

  // Create a new event with file upload
  router.post('/events', upload.single('image'), async (req, res) => {
    try {
      // Log the incoming request body and file details
      console.log('Incoming request body:', req.body);
      console.log('Incoming file:', req.file);

      const { title, description, start_date, end_date, address, city, state, zip, status, userid } = req.body;

      // Check if file is uploaded and required fields are present
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!title || !description || !start_date || !end_date || !address || !city || !state || !zip || !status || !userid) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const image = req.file.id;

      const newEvent = new Event({
        image,
        title,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        location: { address, city, state, zip },
        status,
        userid: mongoose.Types.ObjectId(userid)
      });

      await newEvent.save();
      console.log('Event saved:', newEvent);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error saving event:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get all events
  router.get('/events', async (req, res) => {
    try {
      const events = await Event.find().populate('image');
      res.status(200).json(events);
    } catch (error) {
      console.error('Error retrieving events:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Retrieve image by ID
  router.get('/image/:id', (req, res) => {
    gfs.find({ _id: mongoose.Types.ObjectId(req.params.id) }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ err: 'No file exists' });
      }

      const readstream = gfs.openDownloadStream(files[0]._id);
      readstream.pipe(res);
    });
  });

  // Retrieve image by filename
  router.get('/image/filename/:filename', (req, res) => {
    gfs.find({ filename: req.params.filename }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ err: 'No file exists' });
      }

      const readstream = gfs.openDownloadStreamByName(req.params.filename);
      readstream.pipe(res);
    });
  });

  return router;
};
