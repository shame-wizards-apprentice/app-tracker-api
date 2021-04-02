// Dependencies
const express = require('express')
const cors = require('cors')

// Environment variables
// Port
const PORT = process.env.PORT || 8081;

// Express server instance
const app = express();

// Middleware
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

// Start server
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    })
});