// Dependencies
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
const config = require('../config/auth')

// Express router
const router = express.Router();

// Handle user authentication
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


// Signup route
router.post('/signup', (req, res) => {
    db.User.create({
        username: req.body.username,
        password: req.body.password
    }).then(data => {
        res.json(data)
    }).catch(err => {
        err ? res.status(500).send(`Error creating user: ${err.message}`) : res.status(200).send('Success!')
    });
});


// Login route
router.post('/login', (req, res) => {
    db.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(data => {
        if (!data) {
            res.status(404).send('Hey man, what are you trying to pull?')
        } else if (bcrypt.compareSync(req.body.password, data.password)) {
            const token = jwt.sign({
                username: data.username,
                id: data.id
            }, config.secret, {
                expiresIn: "2h"
            });
            res.json({
                user: data, token
            });
        } else {
            res.status(401).send("We don't serve your kind here.")
        }
    }).catch(err => {
        err ? res.status(500).send(`Error loggin in: ${err.message}`) : res.status(200).send('Success!')
    });
});


// Authentication route
router.get('/vip', (req, res) => {
    let tokenData = authenticateMe(req);
    if (tokenData) {
        db.User.findOne({
            where: {
                id: tokenData.id
            }
        }).then(data => {
            res.json(data)
        }).catch(err => {
            err ? res.status(500).send(`Error verifying user: ${err.message}`) : res.status(200).send('Success!')
        });
    } else {
        res.status(404).send('The details of your incompetence do not interest me.')
    }
});

module.exports = router;