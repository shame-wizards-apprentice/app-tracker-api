// Dependencies
const mysql = require('mysql2');

// Configure db connection
let connection;
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "applications"
  });
};

connection.connect(err => {
  err ? console.error(`Error connecting to database: ${err.stack}`) : console.log(`Connected as id ${connection.threadId}`)
});

// Export connection 
module.exports = connection;