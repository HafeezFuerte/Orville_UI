const fs = require('fs-extra');
const path = require('path');

const src = path.join('d:', 'Github', 'Orville_UI', 'src', 'app', 'components', 'facility', 'assets');
const dest = path.join('d:', 'Github', 'Orville_UI', 'src', 'app', 'components', 'facility', 'asset-management');

fs.copy(src, dest)
  .then(() => fs.remove(src))
  .then(() => console.log('success!'))
  .catch(err => console.error(err));
