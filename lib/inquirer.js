// Require the inquirer package to enable prompting functionality in the console
const inquirer = require("inquirer");

// Define a class InquirerFunctions to handle the creation of inquirer prompt objects
class InquirerFunctions {
    // Constructor to initialize a new instance with the specified properties
    constructor(type, name, message, choices) {
        this.type = type;       // Type of the prompt (e.g., 'input', 'confirm')
        this.name = name;       // Key for the answer object returned from the prompt
        this.message = message; // Message to show to the user when prompting
        this.choices = choices; // Array of choices for 'list', 'checkbox', etc. type prompts
    }

    // Method to create a prompt object based on the instance's properties
    ask() {
        // Basic structure of a prompt object
        const askObJ = {
            type: this.type,
            name: this.name,
            message: this.message
        };
        // Check if the 'choices' is undefined before adding it to the prompt object
        if (this.choices === "undefined") {
            return askObJ; // Return the basic prompt object if no choices are provided
        } else {
            askObJ.choices = this.choices; // Add choices to the prompt object
            return askObJ; // Return the completed prompt object
        }
    }
}

// Export the InquirerFunctions class so it can be used by other files
module.exports = InquirerFunctions;
