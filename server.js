// Dependencies
const express = require('express')
const cors = require('cors')

// Port environment variables
const PORT = process.env.PORT || 8081;

// Express server instance
const app = express();

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