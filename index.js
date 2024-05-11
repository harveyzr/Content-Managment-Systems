// Required modules and configuration files
const inquirer = require("inquirer");
const figlet = require("figlet");
const connection = require("./lib/connection");
const commandMenuChoices = require('./lib/Menu');
const questions = require('./lib/questions');
const InquirerFunctions = require('./lib/inquirer');
const SQLquery = require('./lib/SQL_queries');

// Inquirer prompt types
const inquirerTypes = ['input', 'confirm', 'list'];

// Displaying a cool styled text in the console at the start
const chalk = require('chalk');

let text = figlet.textSync('Employee Management', {
    font: 'ANSI Shadow',    
    horizontalLayout: 'default',
    verticalLayout: 'default'
});

let border = chalk.yellow('*'.repeat(text.split('\n')[0].length + 2));

console.log(border);
console.log(chalk.yellow('* ') + text.split('\n').join('\n' + chalk.yellow('* ')) + chalk.yellow(' *'));
console.log(border);

// Call the main menu function to start the app
mainMenu();

// Function to display the main menu and handle user input
function mainMenu() {
    const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);

    inquirer.prompt([menuPrompt.ask()]).then(operation => {
        const queryRoleTitles = "SELECT role.title FROM role";
        const compRolesArrayQuery = new SQLquery(queryRoleTitles);

        const queryDepartmentNames = "SELECT department.name FROM department";
        const depNamesArrayQuery = new SQLquery(queryDepartmentNames);

        // Handling different operations based on user choice
        switch (operation.menuChoice) {
            case commandMenuChoices[2]:
                return displayAllEmployees();

            case commandMenuChoices[3]:
                depNamesArrayQuery.queryReturnResult(displayAllEmployeesByDepartment);
                break;

            case commandMenuChoices[4]:
                employeeInformationPrompts([], "VIEW BY MANAGER");
                break;

            case commandMenuChoices[5]:
                compRolesArrayQuery.getQueryNoRepeats(displayAllEmployeesByRole);
                break;

            case commandMenuChoices[6]:
                return displayAllManagers();

            case commandMenuChoices[11]:
                compRolesArrayQuery.getQueryNoRepeats(employeeInformationPrompts, "ADD");
                break;

            case commandMenuChoices[12]:
                compRolesArrayQuery.getQueryNoRepeats(employeeInformationPrompts, "DELETE");
                break;

            case commandMenuChoices[13]:
                compRolesArrayQuery.getQueryNoRepeats(employeeInformationPrompts, "UPDATE EMP ROLE");
                break;

            case commandMenuChoices[14]:
                compRolesArrayQuery.getQueryNoRepeats(employeeInformationPrompts, "UPDATE EMP MANAGER");
                break;

            case commandMenuChoices[1]:
                return displayAllRoles();

            case commandMenuChoices[9]:
                return addNewRole();

            case commandMenuChoices[10]:
                compRolesArrayQuery.getQueryNoRepeats(deleteRole, "DELETE ROLE");
                break;

            case commandMenuChoices[0]:
                return displayAllDepartments();

            case commandMenuChoices[7]:
                depNamesArrayQuery.queryReturnResult(addNewDepartment);
                break;

            case commandMenuChoices[8]:
                depNamesArrayQuery.queryReturnResult(removeDepartment);
                break;
        }
    })
}

// Function to display all employees
function displayAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                   FROM employee
                   INNER JOIN role on role.id = employee.role_id
                   INNER JOIN department on department.id = role.department_id;`

    const empTable = new SQLquery(query);
    empTable.generalTableQuery(mainMenu);
}

// Function to display all employees by department
function displayAllEmployeesByDepartment(depNamesArray) {
    const departmentNamePrompt = new InquirerFunctions(inquirerTypes[2], 'department_Name', questions.viewAllEmpByDep, depNamesArray);
    
    inquirer.prompt(departmentNamePrompt.ask()).then(userResp => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                       FROM employee
                       INNER JOIN role on role.id = employee.role_id
                       INNER JOIN department on department.id = role.department_id AND department.name = ?;`

        const empByDepTable = new SQLquery(query, userResp.department_Name);
        empByDepTable.generalTableQuery(mainMenu);
    })
}

// Function to display all employees managed by a specific manager
function displayAllEmployeesByManager(managerObj, namesArr) {
    const chosenManager = new InquirerFunctions(inquirerTypes[2], 'manager_choice', questions.searchByManager, namesArr);

    inquirer.prompt([chosenManager.ask()]).then(userChoice => {
        console.log(`Manager Searched By: ${userChoice.manager_choice}`);

        let chosenManagerID = 0;
        const chosenManagerName = userChoice.manager_choice.split(" ", 2);

        for (manager of managerObj) {
            if (chosenManagerName[1] == manager.lastName) {
                chosenManagerID = manager.ID;
            }
        }

        const queryManagerSearch = `SELECT employee.last_name, employee.first_name, role.title, department.name
                                    FROM employee
                                    INNER JOIN role on role.id = employee.role_id
                                    INNER JOIN department on department.id = role.department_id
                                    WHERE employee.manager_id = (?)`;

        const managerSearch = new SQLquery(queryManagerSearch, chosenManagerID);
        managerSearch.generalTableQuery(mainMenu);
    })
}

// Function to display all employees by their roles
function displayAllEmployeesByRole(compRoles, actionChoice) {
    const rolePrompt = new InquirerFunctions(inquirerTypes[2], 'role_Title', questions.viewAllEmpByRole, compRoles);

    inquirer.prompt(rolePrompt.ask()).then(userResp => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                       FROM employee
                       INNER JOIN role on role.id = employee.role_id AND role.title = (?)
                       INNER JOIN department on department.id = role.department_id;`;

        const empByRoleTable = new SQLquery(query, userResp.role_Title);
        empByRoleTable.generalTableQuery(mainMenu);
    })
}

// Function to display all managers
function displayAllManagers() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, department.name
                   FROM employee
                   INNER JOIN role on role.id = employee.role_id
                   INNER JOIN department on department.id = role.department_id
                   WHERE employee.id IN (SELECT employee.manager_id FROM employee);`;

    const managerTable = new SQLquery(query);
    managerTable.generalTableQuery(mainMenu);
}

// Function to prompt information for different employee actions (Add, View by Manager, Update Role/Manager)
function employeeInformationPrompts(compRoles, actionChoice) {
    const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN (SELECT employee.manager_id FROM employee)";

    connection.query(query, function (err, res) {
        if (err) throw err;

        let managerNamesArr = [];
        let managerObjArr = [];

        for (let i = 0; i < res.length; i++) {
            let name = res[i].first_name + " " + res[i].last_name;
            let managersobj = {
                ID: res[i].id,
                firstName: res[i].first_name,
                lastName: res[i].last_name
            };

            managerObjArr.push(managersobj);
            managerNamesArr.push(name);
        }

        const firstNamePrompt = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
        const lastNamePrompt = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2);
        const empRolePrompt = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
        const empManagerPrompt = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, managerNamesArr);

        if (actionChoice == "ADD") {
            Promise.all([firstNamePrompt.ask(), lastNamePrompt.ask(), empRolePrompt.ask(), empManagerPrompt.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {
                    addEmployee(emp_info, managerObjArr);
                })
            })
        } else if (actionChoice == "VIEW BY MANAGER") {
            displayAllEmployeesByManager(managerObjArr, managerNamesArr);
        } else {
            Promise.all([firstNamePrompt.ask(), lastNamePrompt.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {
                    if (actionChoice == "UPDATE EMP ROLE") {
                        employeeMultipleCheck(emp_info, actionChoice, compRoles);
                    } else if (actionChoice == "UPDATE EMP MANAGER") {
                        employeeMultipleCheck(emp_info, actionChoice, managerObjArr, managerNamesArr);
                    } else {
                        employeeMultipleCheck(emp_info, actionChoice);
                    }
                })
            })
        }
    })
}

// Function to add a new employee
function addEmployee(emp_info, managerObjArr) {
    console.log("You've entered employee ADD");

    const queryRoleIdFromTitle = "SELECT role.id FROM role WHERE role.title = (?);"
    connection.query(queryRoleIdFromTitle, emp_info.employee_role, function (err, res) {
        if (err) {
            throw err;
        }
        const empRoleId = res[0].id;
        const empFirstName = emp_info.first_name;
        const empLastName = emp_info.last_name;
        const empManagerName = emp_info.employee_manager.split(" ");
        const empManagerFirstName = empManagerName[0];
        const empManagerLastName = empManagerName[1];

        let empManagerId = 0;

        for (let manager of managerObjArr) {
            if (manager.firstName == empManagerFirstName && manager.lastName === empManagerLastName) {
                empManagerId = manager.ID;
            }
        }

        const queryInsertEmpInfo = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        connection.query(queryInsertEmpInfo, [empFirstName, empLastName, empRoleId, empManagerId], function (err, res) {
            if (err) {
                throw err;
            }
            console.log("Employee Added");
            mainMenu();
        })
    })
}

// Function to check multiple employees and take specific actions based on context
function employeeMultipleCheck(emp_info, actionChoice, arrayNeededForNextStep) {
    console.log("You've entered employee multiples check");

    const empFirstName = emp_info.first_name;
    const empLastName = emp_info.last_name;
    const queryMultipleEmpCheck = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, 
                                   employee.manager_id, department.name
                                   FROM employee
                                   INNER JOIN role on role.id = employee.role_id
                                   INNER JOIN department on department.id = role.department_id
                                   WHERE employee.first_name = (?) AND employee.last_name = (?);`

    connection.query(queryMultipleEmpCheck, [empFirstName, empLastName], function (err, res) {
        if (res.length > 1) {
            console.log("Multiple Employees Found!");
            let multipleName = [];
            for (employee of res) {
                let empStr = `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.title} ${employee.name}`;
                multipleName.push(empStr);
            }

            const which_employee_to_Delete = new InquirerFunctions(inquirerTypes[2], 'employee_delete', questions.deleteEmployee1, multipleName);

            inquirer.prompt([which_employee_to_Delete.ask()]).then(userChoice => {
                const chosenEmpInfo = userChoice.employee_delete.split(" ");
                const chosenEmpFirstName = chosenEmpInfo[1];
                const chosenEmpLastName = chosenEmpInfo[2];
                const chosenEmpID = chosenEmpInfo[0];

                if (actionChoice === "DELETE") {
                    deleteEmployee(chosenEmpFirstName, chosenEmpLastName, chosenEmpID);
                } else if (actionChoice === "UPDATE EMP ROLE") {
                    updateEmployeeRole(chosenEmpID, arrayNeededForNextStep);
                } else if (actionChoice === "UPDATE EMP MANAGER") {
                    updateEmployeeManager(chosenEmpID, arrayNeededForNextStep);
                }
            })
        } else if (res.length == 1) {
            console.log("One Employee Found!");

            if (actionChoice === "DELETE") {
                deleteEmployee(empFirstName, empLastName, res[0].id);
            } else if (actionChoice === "UPDATE EMP ROLE") {
                updateEmployeeRole(res[0].id, arrayNeededForNextStep);
            } else if (actionChoice === "UPDATE EMP MANAGER") {
                updateEmployeeManager(res[0].id, arrayNeededForNextStep);
            }
        } else {
            console.log("Could not find employee. Rerouted to Main Menu");
            mainMenu();
        }
    })
}

// Function to delete an employee
function deleteEmployee(firstName, lastName, employeeID) {
    console.log("You've entered employee delete.");

    const queryDelete = "DELETE FROM employee WHERE employee.id = (?);"
    const confirmDelete = new InquirerFunctions(inquirerTypes[2], 'confirm_choice', questions.deleteEmployee2 + firstName + " " + lastName + "?", ["yes", "no"]);
    const deleteQuery = new SQLquery(queryDelete, employeeID);

    inquirer.prompt([confirmDelete.ask()]).then(respObj => {
        if (respObj.confirm_choice === "yes") {
            deleteQuery.delete(mainMenu);
        } else {
            mainMenu();
        }
    })
}

// Function to update an employee's role
function updateEmployeeRole(employeeID, RolesArray) {
    console.log("Entered update employee role.");

    const empNewRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.updateRole, RolesArray);
    const queryGetRoleId = `SELECT role.id FROM role WHERE role.title = (?);`;

    inquirer.prompt([empNewRole.ask()]).then(chosenRole => {
        connection.query(queryGetRoleId, chosenRole.employee_role, function (err, res) {
            if (err) {
                throw err;
            }

            const queryUpdateRoleId = `UPDATE employee SET employee.role_id = (?) WHERE employee.id = (?)`;
            const updateEmpRoleId = new SQLquery(queryUpdateRoleId, [res[0].id, employeeID]);

            updateEmpRoleId.update(mainMenu, "Employee Role Updated!");
        })
    })
}

// Function to update an employee's manager
function updateEmployeeManager(employeeID, managerObjectArray) {
    console.log("Entered update employee manager.");

    const queryCurrentManager = `SELECT employee.manager_id FROM employee WHERE employee.id = (?);`;

    connection.query(queryCurrentManager, employeeID, function (err, res) {
        if (err) {
            throw err;
        }

        const currentManagerID = res[0].manager_id;

        const managerChoices = managerObjectArray.filter(manager => {
            return manager.ID != currentManagerID;
        });

        let possibleNewManagerNames = [];
        for (manager of managerChoices) {
            let managerName = "ID: " + manager.ID + " " + manager.firstName + " " + manager.lastName;
            possibleNewManagerNames.push(managerName);
        }

        const newManagerChoice = new InquirerFunctions(inquirerTypes[2], 'new_Manager', questions.newManager, possibleNewManagerNames);

        inquirer.prompt([newManagerChoice.ask()]).then(userChoice => {
            const userInputSplitAtId = userChoice.new_Manager.split(" ", 2);
            const newManagerID = userInputSplitAtId[1];

            const queryUpdateNewManager = `UPDATE employee SET employee.manager_id = (?) WHERE employee.id = (?)`;

            connection.query(queryUpdateNewManager, [newManagerID, employeeID], function (err, res) {
                if (err) {
                    throw err;
                }
                console.log("Manager Updated!");
                mainMenu();
            })
        })
    })
}

// Function to display all roles in the system
function displayAllRoles() {
    const query = `SELECT role.title, role.salary, department.name FROM role INNER JOIN department ON department.id = role.department_id;`;
    const roleTable = new SQLquery(query);

    roleTable.generalTableQuery(mainMenu);
}

// Function to display all departments
function displayAllDepartments() {
    const query = `SELECT department.name FROM department;`;
    const depTable = new SQLquery(query);

    depTable.generalTableQuery(mainMenu);
}

// Function to add a new role
function addNewRole() {
    const queryDeps = "SELECT department.name FROM department;";
    connection.query(queryDeps, function (err, res) {
        if (err) throw err;

        let depNameArr = [];
        for (let i = 0; i < res.length; i++) {
            depNameArr.push(res[i].name);
        }

        const whatRole = new InquirerFunctions(inquirerTypes[0], 'role_to_add', questions.newRole);
        const whatSalary = new InquirerFunctions(inquirerTypes[0], 'role_salary', questions.salary);
        const whatDepartment = new InquirerFunctions(inquirerTypes[2], 'department', questions.department, depNameArr);

        Promise.all([whatRole.ask(), whatSalary.ask(), whatDepartment.ask()]).then(prompts => {
            inquirer.prompt(prompts).then(userChoices => {
                const getDepId = `SELECT department.id FROM department WHERE department.name = (?);`;

                connection.query(getDepId, userChoices.department, function (err, res) {
                    if (err) {
                        throw err;
                    }

                    const addRoleQuery = `INSERT INTO role (role.title, role.salary, role.department_id) VALUES ( (?), (?), (?));`;
                    const addRole = new SQLquery(addRoleQuery, [userChoices.role_to_add, userChoices.role_salary, res[0].id]);

                    addRole.update(mainMenu, "Role added!");
                })
            })
        })
    })
}

// Function to delete a role
function deleteRole(compRolesArr) {
    console.log("You've entered role delete");

    const whatRole = new InquirerFunctions(inquirerTypes[2], 'role_to_delete', questions.deleteRole, compRolesArr);

    inquirer.prompt([whatRole.ask()]).then(userChoice => {
        const role_id_Query = `SELECT role.id FROM role WHERE role.title = (?);`;

        connection.query(role_id_Query, userChoice.role_to_delete, function (err, res) {
            const roleDeleteID = res[0].id;
            const roleDeleteTitle = userChoice.role_to_delete;

            if (res.length > 1) {
                console.log("Role found in multiple departments!");

                const departmentsWithRoleQuery = `SELECT department.name, role.department_id FROM department INNER JOIN role on role.department_id = department.id AND role.title = (?);`;

                connection.query(departmentsWithRoleQuery, userChoice.role_to_delete, function (err, res) {
                    if (err) throw err;
                    const departmentsWithRoleArr = [];

                    for (let department of res) {
                        departmentsWithRoleArr.push(department);
                    }

                    const whichDepartment = new InquirerFunctions(inquirerTypes[2], 'department_to_delete_Role_From', questions.departmentDeleteRole, departmentsWithRoleArr);

                    inquirer.prompt([whichDepartment.ask()]).then(userChoice => {
                        console.log(res);
                        const departmentName_ID_Arr = res.filter(department => {
                            return department.name == userChoice.department_to_delete_Role_From;
                        });

                        const deleteRoleQuery2 = "DELETE FROM role WHERE role.title = (?) AND role.department_id = (?)";
                        const deleteInstance2 = new SQLquery(deleteRoleQuery2, [roleDeleteTitle, departmentName_ID_Arr[0].department_id]);
                        deleteInstance2.delete(mainMenu);
                    })
                })

            } else {
                const deleteRoleQuery = "DELETE FROM role WHERE role.id = (?);";
                const deleteInstance = new SQLquery(deleteRoleQuery, roleDeleteID);
                deleteInstance.delete(mainMenu);
            }
        })
    })
}

// Function to add a new department
function addNewDepartment(depNameArr) {
    const whatDep = new InquirerFunctions(inquirerTypes[0], 'dep_to_add', questions.newDep);

    inquirer.prompt([whatDep.ask()]).then(userChoice => {
        const alreadyExist = depNameArr.filter(department => {
            return department.name == userChoice.dep_to_add;
        });

        if (alreadyExist.length >= 1) {
            console.log("Department Already exists!");
            mainMenu();
        } else {
            const addDepQuery = `INSERT INTO department (department.name) VALUES (?);`;
            const addDep = new SQLquery(addDepQuery, userChoice.dep_to_add);

            addDep.update(mainMenu, "Department added!");
        }
    })
}

// Function to remove a department
function removeDepartment(depNameArr) {
    const whatDepartment = new InquirerFunctions(inquirerTypes[0], 'dep_to_delete', questions.deleteDep);

    inquirer.prompt([whatDepartment.ask()]).then(userChoice => {
        const deleteDepQuery = `DELETE FROM department WHERE department.name = (?);`;
        const deleteDep = new SQLquery(deleteDepQuery, userChoice.dep_to_delete);

        deleteDep.update(mainMenu, "Department deleted!");
    })
}
