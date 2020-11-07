const fs = require('fs');
const path = require('path');
const Styles = require('colors/safe');

const ROOMS_FILE = path.join(__dirname, '../../data/rooms.json');

const readRoomsFile = () => {
  let rooms = [];
  try {
    const roomsFileData = fs.readFileSync(ROOMS_FILE);
    rooms = JSON.parse(roomsFileData);
  } catch(err) {
    console.log(Styles.red(`\nError reading the rooms data: ${err}`));
  }
  return rooms;
};

module.exports = readRoomsFile;
