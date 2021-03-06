// Dependencies
const express = require(`express`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)
const db = require(`../models`)
const config = require(`../config/auth`)

// Express router
const router = express.Router();

// Handle user authentication
const authenticateMe = req => {
    let token = false;
    // Check for authorization headers, assign token if found
    req.headers.authorization ? token = req.headers.authorization.split(` `)[1] : token = false
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
router.post(`/users/new`, (req, res) => {
    if (!req.body) {
        res.status(400).send(`Username and password can't be blank, idiot!`)
    } else {
        db.User.create({
            username: req.body.username,
            password: req.body.password
        }).then(data => {
            if(data) {
                const token = jwt.sign({
                    username: data.username,
                    id: data.id
                }, config.secret, {
                    expiresIn: `2h`
                });
                res.json({
                    user: data, token
                });
            }
        }).catch(err => {
            err ? res.send(`Signup error: ${err.message}`) : res.status(200).send(`Success!`)
        });
    }
});


// Login route
router.post(`/users`, (req, res) => {
    if (!req.body) {
        res.status(400).send(`Username and password can't be blank, idiot!`)
    } else {
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(data => {
            if (!data) {
                res.status(404).send(`Hey man, what are you trying to pull?`)
            } else if (bcrypt.compareSync(req.body.password, data.password)) {
                const token = jwt.sign({
                    username: data.username,
                    id: data.id
                }, config.secret, {
                    expiresIn: `2h`
                });
                res.json({
                    user: data, token
                });
            } else {
                res.status(401).send(`We don't serve your kind here.`)
            }
        }).catch(err => {
            err ? res.send(`Error logging in: ${err.message}`) : res.status(200).send(`Success!`)
        });
    }
});


// Authentication route
router.get(`/users`, (req, res) => {
    let tokenData = authenticateMe(req);
    if (tokenData) {
        db.User.findOne({
            where: {
                id: tokenData.id
            }
        }).then(data => {
            res.json(data)
        }).catch(err => {
            err ? res.status(400).send(`Error verifying user: ${err.message}`) : res.status(200).send(`Success!`)
        });
    } else {
        res.status(404).send(`The details of your incompetence do not interest me.`)
    }

});

module.exports = router;