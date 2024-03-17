const fs = require("fs");

const LogHandler = (filename, mode) => {
  // Path to log file
  const logFilePath = `./server/logs/${filename}.log`;

  let outputLog = null;

  if (mode === "P") {
    if (fs.existsSync(logFilePath)) {
      const date = new Date().toISOString().replace(/:/g, "-");
      const oldLogFilePath = `./server/logs/${filename}_${date}.log`;

      // Rename the old log file
      fs.renameSync(logFilePath, oldLogFilePath);
    }
    outputLog = fs.createWriteStream(logFilePath, { flags: "w" }); // Create a new file if exists
  } else if (mode === "D") {
    outputLog = fs.createWriteStream(logFilePath, { flags: "a" }); // Append to existing file
  } else {
    outputLog = fs.createWriteStream(logFilePath, { flags: "w" }); // Create a new file if mode is invalid
  }

  return outputLog;
};

module.exports = LogHandler;
