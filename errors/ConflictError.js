class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.status = 404;
  }
}

module.exports = ConflictError;
