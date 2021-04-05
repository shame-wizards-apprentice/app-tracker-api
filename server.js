// Dependencies
const express = require('express');
const cors = require('cors');
const apicache = require('apicache');

// Port environment variables
const PORT = process.env.PORT || 8081;

// Server and cache instance
const app = express();
let cache = apicache.middleware;

// Cors config
const whitelist = ['http://localhost:3000']

const corsOptions = {
    origin: whitelist,
    credentials: true,
    optionSuccessStatus: 200,
    methods: "GET, HEAD, POST, PUT, DELETE"
}

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cache('5 minutes'));

// Access sequelize database
const db = require('./models');

// Lovely greeting for anyone who tries to visit the deployed server
app.get("/", (req, res) => {
    res.send("Details of your incompetence do not interest me.")
})

// Routes
const userRoutes = require('./controllers/userController');
app.use(userRoutes);

const appRoutes = require('./controllers/applicationController');
app.use(appRoutes);

// Start server
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    })
});