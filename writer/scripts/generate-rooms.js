const path = require('path');
const fs = require('fs');
const { v4: uuid4 } = require('uuid');
const inquirer = require('inquirer');
const Styles = require('colors/safe');

const ROOMS_FILE = path.join(__dirname, '../data/rooms.json');

// Generate a question for the room selection
const questions = [
  {
    type: 'checkbox',
    message: 'Select rooms to generate',
    name: 'rooms',
    choices: [
      {
        name: "Living room",
      },
      {
        name: "Bathroom"
      },
      {
        name: "Kitchen"
      },
      {
        name: "Bedroom"
      },
      {
        name: "Games room"
      },
      {
        name: "Hallway"
      },
      {
        name: "Outside"
      }
    ],
    validate(answer) {
      if(answer.length < 1) {
        return 'You must choose at least one room!'
      }
      return true;
    }
  }
];

// Create the inquirer prompt
inquirer.prompt(questions).then(async(answers) => {

  // Delete the old rooms file
  if(fs.existsSync(ROOMS_FILE)) {
    try {
      fs.unlinkSync(ROOMS_FILE);
    } catch(e) {
      console.error(Styles.red(e));
    }
  }

  const {
    rooms
  } = answers;

  const roomMapping = rooms.map(room => ({
    id: uuid4(),
    room,
  }));

  fs.writeFileSync(ROOMS_FILE, JSON.stringify(roomMapping));

  console.log(Styles.green(`Rooms data written to file!`));
});
