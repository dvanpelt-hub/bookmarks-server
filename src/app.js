require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const validateBearerToken = require("./validate-bearer-token");
const handleError = require("./handle-error");
const bookmarksRouter = require("./bookmarks/bookmarks-router");
const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);
app.use(bookmarksRouter);
app.use(handleError);

app.get("/", (req, res) => {
  res.send("Welcome!");
});

module.exports = app;