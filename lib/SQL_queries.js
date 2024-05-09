// Import the MySQL module to enable database interactions
const mysql = require("mysql");

// Import the connection configuration which is assumed to be defined in "./SQL_login"
const connection = require("./SQL_login");

// Import and configure the 'as-table' package for pretty-printing SQL results as a table
const asTable = require('as-table').configure({ delimiter: ' | ', dash: '-' });

// Define a class for handling common SQL query operations
class SQLqueries {
    // Constructor to initialize the SQLqueries class with a query and optional values
    constructor(query, values) {
        this.query = query;       // SQL query string
        this.values = values;     // Optional array of values for parameterized queries
    }

    // Executes a general SQL query and displays the results in a table format, then proceeds with a callback function
    generalTableQuery(nextStep) {
        // Execute the query using the MySQL connection
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err; // If there is an error in the query, throw an exception

            console.log("\n");
            console.log(asTable(res)); // Pretty-print the result as a table
            console.log("\n");
            nextStep(); // Call the next step function passed as a parameter
        });
    }

    // Executes a SQL query, filters out repeated titles, and passes the results to the next step
    getQueryNoRepeats(nextStep, parameterToPassToNextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err; // Handle errors during the query

            let titleArr = []; // Initialize an empty array to store unique titles
            for (let i = 0; i < res.length; i++) {
                // Loop through the results and populate the title array without duplicates
                if (!titleArr.includes(res[i].title)) {
                    titleArr.push(res[i].title);
                }
            }
            // Call the next step function with the array of unique titles and any additional parameters
            nextStep(titleArr, parameterToPassToNextStep);
        });
    }

    // Deletes records from the database based on the query and calls the next step
    delete(nextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err; // Handle errors during the query

            console.log("Delete Successful!");
            nextStep(); // Proceed to the next step function after deletion
        });
    }

    // Updates records in the database and displays a custom message upon completion
    update(nextStep, message) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err; // Handle errors during the query

            console.log(message); // Display a custom message after the update
            nextStep(); // Call the next step function
        });
    };

    // Executes a query and directly passes the results to the next step without modifications
    queryReturnResult(nextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err; // Handle errors during the query

            nextStep(res); // Pass the query result directly to the next step function
        })
    }
}

// Export the SQLqueries class so it can be used in other parts of the application
module.exports = SQLqueries;
