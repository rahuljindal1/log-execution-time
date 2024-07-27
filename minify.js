const fs = require("fs");
const path = require("path");
const terser = require("terser");

// Function to minify JavaScript files
async function minifyFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const result = await terser.minify(code, {
      compress: false,
      mangle: false,
      format: {
        comments: "some",
        beautify: false,
        indent_level: 1,
      },
    });
    fs.writeFileSync(filePath, result.code, "utf8");
    console.log(`Minified: ${filePath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
}

function minifyDirectory(dirPath) {
  fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return console.error(`Unable to scan directory ${dirPath}:`, err);
    }

    entries.forEach((entry) => {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        minifyDirectory(fullPath);
      } else if (entry.isFile() && path.extname(entry.name) === ".js") {
        minifyFile(fullPath);
      }
    });
  });
}

const directoryPath = path.join(__dirname, "dist"); // Change 'src' to your directory
minifyDirectory(directoryPath);
