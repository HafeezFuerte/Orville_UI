const fs = require('fs');
let html = fs.readFileSync('d:/Github/Orville_UI/src/app/components/components/create-new-unit/add-unit.component.html', 'utf8');

html = html.replace(/Unit/g, 'Room');
html = html.replace(/unit/g, 'room');
html = html.replace(/Units/g, 'Rooms');
html = html.replace(/units/g, 'rooms');

fs.writeFileSync('d:/Github/Orville_UI/src/app/components/components/create-new-room/add-room.component.html', html);
console.log('Done replacement');
