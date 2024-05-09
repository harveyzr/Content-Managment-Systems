// Import the mysql module to connect to the MySQL database
const mysql = require("mysql");

// Create a connection to the database using the mysql module
const connection = mysql.createConnection({
    host: "localhost",  // Specify the hostname where the database server resides
    port: 3306,         // Specify the port number that the database server is listening on
    user: "root",       // Database username to connect as
    password: "Watson1234",  // Password for the database user
    database: "employee_management_db"  // The name of the database to connect to
});

// Export the connection to make it available in other parts of the application
module.exports = connection;
