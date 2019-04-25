const fs = require("fs");
const path = require("path");

const files = [path.join("src", "main.js"), path.join("src", "style.css")];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`...Cleaning ${file}`);
    fs.unlinkSync(file);
  }
});

console.log("Cleaning done!");
