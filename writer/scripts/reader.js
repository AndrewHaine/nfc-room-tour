const fs = require('fs');
const path = require('path');
const { NFC } = require('nfc-pcsc');
const Styles = require('colors/safe');

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

  reader.on('card', async card => {

    let tagId = null;

    try {
      const data = await reader.read(4, 36);
      tagId = data.toString();
    } catch(err) {
      return console.log(Styles.red(`Error reading tag data: ${err}`));
    }

    if(tagId) {
      const room = rooms.filter(({ id }) => (id === tagId))[0];
      if(room) {
        console.log(`${Styles.green('This is the')} ${Styles.green.bold(room.room)}`);
      } else {
        console.log(`No room found for this tag`);
      }
    }
  });
});
