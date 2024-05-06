USE employee_management_db;
INSERT INTO department (name)
 VALUES ("IT"),
		("Finance"),
		("Legal"),
		("Sales"),
		("Engineering");
-- SELECT * FROM department;

INSERT INTO role (title, salary, department_ID) 
VALUES ("Sales Lead", 100000, 4),
("Salesperson", 80000, 4),
("Lead Engineer", 150000, 4),
("Software Engineer", 120000, 4),
("Account Manager", 160000, 2),
("Accountant", 125000 , 3),
 ("Software Engineer", 85000, 3),
 ("Lead Engineer", 100000, 3),
("Manager", 85000, 4),
("Accountant", 70000, 4),
("Manager", 100000, 5),
("Sales Lead", 90000, 5),
("Salesperson", 70000, 5);
-- SELECT * FROM role;

USE employee_management_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ("Joel", "Iles", 1, NULL ),
		("Theresa", "Louise", 2, 1),
		("Mitch", "Young", 3, NULL),
		("Duke", "Johnson", 4, 3),
		("Josh", "Johnson", 5, 3),
		("Leslie", "Knope", 6, NULL),
		("Ron", "Swanson", 7, 6),
		("April", "Ludgate",8, 6),
        ("Donna", "Awesome", 9, NULL),
        ("Tom", "Haverford", 10, 9),
		("Zach", "Harvey", 11, Null);
-- SELECT * FROM employee;
