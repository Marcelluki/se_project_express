class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.status = 404;
  }
}

module.exports = ForbiddenError;
