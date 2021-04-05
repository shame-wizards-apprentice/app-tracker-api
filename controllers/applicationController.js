// Dependencies
const express = require('express');
const db = require('../models');

// Express router
const router = express.Router();

// Add new application
router.post('/newapp', (req, res) => {
    db.Application.create({
        company: req.body.company,
        contactName: req.body.contactName,
        
    })
})