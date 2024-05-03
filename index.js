const inquirer = require("inquirer");
const figlet = require("figlet");

const connection = require("./lib/SQL_login");
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');

const InquirerFunctions = require('./lib/inquirer');
const SQLquery = require('./lib/SQL_queries');

const inquirerTypes = [
    'input', 'confirm', 'list'
]
console.log(figlet.textSync('Employee Management', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

mainMenu();

function mainMenu() {

    const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);

    inquirer

    .prompt([menuPrompt.ask()]).then(operation => {

        const query1 = "SELECT role.title FROM role"
        const compRolesArrayQuery = new SQLquery(query1);

        const depNameQuery = "SELECT department.name FROM department";
      const depNamesArrayQuery = new SQLquery(depNameQuery);

      switch (operation.menuChoice) {

        case commandMenuChoices[2]:
            return viewAllEmp();

            case commandMenuChoices[3]:
            depNamesArrayQuery.queryReturnResult(viewAllEmpDep);
            break;

         case commandMenuChoices[4]:
            const actionChoice5 = "VIEW BY MANAGER"
            dummyArr = [];

            EmpInfoPrompts(dummyArr, actionChoice5);
            break;
        
            case commandMenuChoices[5]:
                compRolesArrayQuery.getQueryNoRepeats(viewAllEmpRole)
                break;

            case commandMenuChoices[6]:
                return viewAllManager();

            case commandMenuChoices[11]:
                const actionChoice1 = "ADD"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice1);

                break;

            case commandMenuChoices[12]:
                const actionChoice2 = "DELETE"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice2);
                break;

            case commandMenuChoices[13]:
                const actionChoice3 = "UPDATE EMP ROLE"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice3);

                break;

            case commandMenuChoices[14]:
                const actionChoice4 = "UPDATE EMP MANAGER";
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice4);
                break;

            case commandMenuChoices[1]:
                return viewAllRoles();

            case commandMenuChoices[9]:
                return addRole();

            case commandMenuChoices[10]:
                const actionChoice7 = "DELETE ROLE";
                compRolesArrayQuery.getQueryNoRepeats(deleteRole, actionChoice7);
                break;

            case commandMenuChoices[0]:
                return viewAllDep();

            case commandMenuChoices[7]:
                depNamesArrayQuery.queryReturnResult(addDep);
                break;

            case commandMenuChoices[8]:
                depNamesArrayQuery.queryReturnResult(removeDep);
                break;
        }
    })
}
