-- Setting the database context
USE employee_management_db;

-- Inserting new departments
INSERT INTO department (name)
VALUES 
    ("Technology"),
    ("Finance"),
    ("Legal"),
    ("Marketing"),
    ("Engineering");

-- The following line is commented out and can be used to check inserted departments
-- SELECT * FROM department;

-- Inserting roles with updated titles and salaries
INSERT INTO role (title, salary, department_id) 
VALUES 
    ("Marketing Lead", 95000, 4), -- Marketing department
    ("Marketing Associate", 75000, 4), -- Marketing department
    ("Principal Engineer", 140000, 5), -- Engineering department
    ("Senior Software Engineer", 115000, 5), -- Engineering department
    ("Finance Manager", 125000, 2), -- Finance department
    ("Corporate Lawyer", 135000, 3), -- Legal department
    ("Legal Assistant", 65000, 3), -- Legal department
    ("Technical Lead", 132000, 1), -- Technology department
    ("Project Manager", 98000, 1), -- Technology department
    ("Public Relations Manager", 92000, 4), -- Marketing department
    ("Compliance Officer", 110000, 3), -- Legal department
    ("Marketing Specialist", 87000, 4), -- Marketing department
    ("Human Resources Manager", 90000, 2), -- Finance department (assumed here to be HR under Finance)
    ("Human Resources Specialist", 75000, 2); -- Finance department (assumed here to be HR under Finance)

-- The following line is commented out and can be used to check inserted roles
-- SELECT * FROM role;

-- Inserting employees with references to roles and managers
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  
    ("John", "Doe", 1, NULL),  -- Top-level Marketing Lead has no manager
    ("Sarah", "Smith", 2, 1),  -- Reporting to John Doe
    ("Alice", "Johnson", 3, NULL),  -- Principal Engineer, no manager specified
    ("Bob", "Anderson", 4, 3),  -- Reports to Alice Johnson
    ("Nancy", "White", 5, NULL),  -- Finance Manager, top level in Finance
    ("David", "Moore", 6, NULL),  -- Top-level lawyer
    ("Chloe", "Brown", 7, 6),  -- Legal Assistant under David Moore
    ("James", "Davis", 8, NULL),  -- Technical Lead, no manager specified
    ("Linda", "Miller", 9, 8),  -- Project Manager under James Davis
    ("Brian", "Wilson", 10, 1),  -- PR Manager under John Doe
    ("Eva", "Taylor", 11, 6),  -- Compliance Officer under David Moore
    ("Olivia", "Lewis", 12, 1); -- Marketing Specialist under John Doe

-- The following line is commented out and can be used to check inserted employees
-- SELECT * FROM employee;
