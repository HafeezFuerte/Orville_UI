const fs = require('fs');
const path = require('path');

const src = "d:\\Github\\Masaar_UI\\src\\assets\\images\\login_background.png";
const dest = "d:\\Github\\Orville_UI\\src\\assets\\images\\login_background.png";

try {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log("Successfully copied background image!");
} catch (err) {
  console.error("Error copying background image:", err);
}
