const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.oriign}`,
    "errLog.log"
  );
  console.log(err.stack);

  // set status code

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);
  res.json({ message: err.message });
};

module.exports = errorHandler;
