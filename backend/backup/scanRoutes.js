const fs = require('fs');
const path = require('path');

const searchDir = path.join(__dirname);
const fileExts = ['.js'];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /\.use
