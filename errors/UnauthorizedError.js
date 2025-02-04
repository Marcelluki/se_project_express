class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 404;
  }
}

module.exports = UnauthorizedError;
