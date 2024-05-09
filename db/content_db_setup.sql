-- Drop the existing database if it exists
DROP DATABASE IF EXISTS Employee_Management_db;
COMMIT;

-- Create a new database named Employee_Management_db
CREATE DATABASE Employee_Management_db; 
COMMIT;

-- Switch to use the newly created database
USE Employee_Management_db;
COMMIT;

-- Drop the department table if it already exists
DROP TABLE IF EXISTS department;
COMMIT;

-- Create the department table with id and name columns
CREATE TABLE department(
    id INT auto_increment PRIMARY KEY NOT NULL,
    name VARCHAR(30)
);
COMMIT;

-- Drop the role table if it already exists
DROP TABLE IF EXISTS role;
COMMIT;

-- Create the role table with id, title, salary, and department_id columns
CREATE TABLE role(
    id INT auto_increment PRIMARY KEY NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
COMMIT;

-- Drop the employee table if it already exists
DROP TABLE IF EXISTS employee;
COMMIT;

-- Create the employee table with id, first_name, last_name, role_id, and manager_id columns
CREATE TABLE employee(
    id INT auto_increment PRIMARY KEY NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
COMMIT;
