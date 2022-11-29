require("dotenv").config();
const express = require("express");
const app = express();
const root = require("./routes/root");
const PORT = process.env.PORT || 3500;
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHanlder");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const dbConn = require("./config/dbConn");
const { default: mongoose } = require("mongoose");

dbConn();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", root);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404: Page not found" });
  } else {
    res.type("txt").send("404 Page not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    mongoErrLog.log
  );
});
