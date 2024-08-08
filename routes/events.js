const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

const router = express.Router();

// Create a new event without file upload
router.post('/', async (req, res) => {
  console.log('POST /api/events endpoint hit');
  console.log('Request body:', req.body); // Log the request body

  try {
    const { title, description, start_date, end_date, address, city, state, zip, status } = req.body;

    console.log('Parsed body:', { title, description, start_date, end_date, address, city, state, zip, status });

    const newEvent = new Event({
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      location: { address, city, state, zip },
      status,
    });

    console.log('Saving new event:', newEvent);

    await newEvent.save();
    console.log('Event created:', newEvent); // Log the created event
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  console.log('GET /api/events endpoint hit');
  try {
    const events = await Event.find();
    console.log(`Found ${events.length} events`);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
