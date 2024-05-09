
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Watson1234",
    database: "employee_management_db"

});

module.exports = connection;
