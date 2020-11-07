const { NFC } = require('nfc-pcsc');
const Styles = require('colors/safe');
const inquirer = require('inquirer');

const readRooms = require('./lib/_readRoomsFile');

const nfc = new NFC();

// Load the rooms
let rooms = readRooms();

// Signal that rooms have been loaded
if(rooms.length) {
  console.log(Styles.grey(`Rooms data read successfully`));
}

nfc.on('reader', reader => {
  // Notify the user that the reader has been found
  console.log(Styles.green.bold(`${reader.reader.name} attached!\n`));

  let stagedRoom = null;

  const requestRoom = () => {
    console.clear();
    inquirer.prompt([
      {
        type: "list",
        name: "room",
        message: "Which room tag would you like to write?",
        choices: rooms.map(({ id, room }) => ({ value: id, name: room })),
        validate(answer) {
          if(!answer) {
            return "You must select an answer";
          }
          return true;
        }
      }
    ]).then(({ room }) => {
      stagedRoom = room;
      console.log(Styles.cyan(`Scan a tag to write to`));
    });
  };

  requestRoom();

  reader.on('card', async () => {
    if(!stagedRoom) {
      return console.log(Styles.red.underline(`\nYou must select a room`));
    }

    try {
      const data = Buffer.allocUnsafe(36);
      data.fill(0);
      data.write(stagedRoom);
      await(reader.write(4, data));
      console.log(Styles.green.bold(`Data written to chip\n\n`));
      setTimeout(requestRoom, 2000);
    } catch(err) {
      console.error(Styles.red(`Error writing to chip: ${err}`));
    }
  });
});
