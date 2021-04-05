// Dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config/auth');
const e = require('express');

// Express router
const router = express.Router();

// User auth function
const authenticateMe = req => {
    let token = false;
    // Check for authorization headers, assign token if found
    req.headers.authorization ? token = req.headers.authorization.split(" ")[1] : token = false

    // If token is found, authenticate user
    let data = false
    if (token) {
        data = jwt.verify(token, config.secret, (err, data) => {
            if (err) {
                return false
            } else {
                return data
            }
        });
    }
    // If verification succeeds, send back user data
    return data
}


// Add new application
router.post('/applications', (req, res) => {
    const tokenData = authenticateMe(req);
    db.Application.create({
        company: req.body.company,
        contactName: req.body.contactName,
        contactInfo: req.body.contactInfo,
        notes: req.body.notes,
        response: req.body.response,
        date: req.body.date,
        UserId: tokenData.id
    }).then(data => {
        res.json(data)
    }).catch(err => {
        err ? res.status(400).send(`Error creating application: ${err.message}`) : res.status(200).send('Success!')
    });
});


// View user's applications
router.get('/applications', (req, res) => {
    const tokenData = authenticateMe(req);
    db.Application.findAll({
        where: {
            UserId: tokenData.id
        }
    }).then(data => {
        // If user has no applications, tell them no applications found
        !data ? res.status(404).send('No applications found.') : data === [] ? res.status(404).send('No applications found.') : res.json(data)
    }).catch(err => {
        err ? res.status(400).send(`Error finding applications: ${err.message}`) : res.status(200).send('Success!')
    });
});


// Update an application
router.put('/applications/:id', (req, res) => {
    const tokenData = authenticateMe(req)
    // Check for authenticated user, send back forbidden error if none found
    if (!tokenData) {
        res.status(401).send('You must login to update an application.')
    } else {
        db.Application.update({
            company: req.body.company,
            contactName: req.body.contactName,
            contactInfo: req.body.contactInfo,
            notes: req.body.notes,
            response: req.body.response,
        }, {
            where: {
                id: req.params.id,
                UserId: tokenData.id
            }
        }).then(data => {
            res.json(data)
        }).catch(err => {
            err ? res.status(400).send(`Error updating application: ${err.message}`) : res.status(200).send('Success!')
        });
    }
});

// Delete an application
router.delete('/applications/:id', (req, res) => {
    const tokenData = authenticateMe(req);
    // Check for authenticated user, send back forbidden error if none found
    if (!tokenData) {
        res.status(401).send('You must login to delete an application.')
    } else {
        db.Application.destroy({
            where: {
                UserId: tokenData.id,
                id: req.params.id
            }
        }).then(data => {
            res.json(data)
        }).catch(err => {
            err ? res.status(400).send(`Error deleting application: ${err.message}`) : res.status(200).send('Success!')
        });
    }
});

module.exports = router;