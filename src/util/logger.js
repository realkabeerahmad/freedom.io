class Logger {
  constructor(filename, mode) {
    this.filename = filename;
    this.mode = mode;
    this.consoler = new console.Console(this.filename, this.filename);
  }

  info(message) {
    const date = new Date().toISOString();
    this.consoler.log(`[${date}] [INFO] [${message}]`);
  }

  exception(message) {
    const date = new Date().toISOString();
    this.consoler.log(`[${date}] [EXCEPTION] [${message}]`);
  }

  warn(message) {
    const date = new Date().toISOString();
    this.consoler.log(`[${date}] [WARN] [${message}]`);
  }

  error(message) {
    const date = new Date().toISOString();
    this.consoler.error(`[${date}] [ERROR] [${message}]`);
  }

  debug(message) {
    if (this.mode === "D") {
      const date = new Date().toISOString();
      this.consoler.log(`[${date}] [DEBUG] [${message}]`);
    }
  }
}

module.exports = Logger;
