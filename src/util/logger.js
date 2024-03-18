class Logger {
  constructor(filename, mode) {
    this.filename = filename;
    this.mode = mode;
    this.consoler = new console.Console(this.filename, this.filename);
  }
  log(logMessage) {
    if (this.mode === "D" || this.mode === "P") {
      const date = new Date().toISOString();
      this.consoler.log(`[${date}] ${logMessage}`);
    }
  }
  info(message) {
    this.log(`[INFO] ${message}`);
  }

  exception(message) {
    this.log(`[EXCEPTION] ${message}`);
  }

  warn(message) {
    this.log(`[WARN] ${message}`);
  }

  error(message) {
    this.log(`[ERROR] ${message}`);
  }

  debug(message) {
    if (this.mode === "D") {
      this.log(`[DEBUG] ${message}`);
    }
  }
}

module.exports = Logger;
