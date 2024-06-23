class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

// const BAD_REQUEST_ERROR = 400;
// const FORBIDDEN_ERROR = 403;
// const NOT_FOUND_ERROR = 404;
// const INTERNAL_SERVER_ERROR = 500;
// const CONFLICT_ERROR = 409;
// const UNAUTHORIZED = 401;

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
};
