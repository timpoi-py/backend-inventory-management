const express = require("express");
const app = express();
const root = require("./routes/root");
const PORT = process.env.PORT || 3500;
const path = require("path");

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

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
