const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\SVSC\\.gemini\\antigravity-ide\\brain\\22847194-4c97-460f-a4a9-43688763a9a8\\media__1783863096164.png";
const dest = "d:\\Github\\Orville_UI\\src\\assets\\images\\login_illustration.png";

try {
  // Ensure directory exists
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  console.log("Successfully copied illustration image!");
} catch (err) {
  console.error("Error copying file:", err);
}
