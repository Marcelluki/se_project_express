// const errorHandler = (err, req, res, next) => {
//   console.error(err);
//   res.send({ message: err.message });
// };
const errorHandler = (err, req, res, next) => {
  console.error(err);
  // err.status = err.status || 500;
  // err.message = err.message || "An error has occurred to the server";
  const status = err.status || 500;
  const message = err.message || "An error has occurred on the server";
  // res.send({
  //   status: err.status,
  //   message: err.message,
  // });
  res.status(status).send({ message });
};

module.exports = {
  errorHandler,
};
