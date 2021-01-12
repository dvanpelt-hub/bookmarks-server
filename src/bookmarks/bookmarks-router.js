const express = require("express");
const { v4: uuidv4 } = require("uuid");
const logger = require("../logger");
const dataBank = require("../dataBank");
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const isWebUri = require("isWebUri");

bookmarksRouter
//Using common path of /bookmarks for the route() method//
  .route("/bookmarks")
  .get((req, res) => {
    res.json(dataBank.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    for (const field of ["title", "url", "rating"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }
    const { title, url, description, rating } = req.body;

    //Using Number constructor to verify rating input and respond accordingly//
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send(`'rating' must be a number between 0 and 5`);
    }
    //Checks to make sure url entered is valid//
    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400).send(`'url' must be a valid URL`);
    }
    //Creates a bookmark variable with respective information//
    const bookmark = { id: uuidv4(), title, url, description, rating };

    //Pushes the new bookmark to the dataBank local dataset//
    dataBank.bookmarks.push(bookmark);

    //Log successful creation of the bookmark. Sends back status, location, and the bookmark info in json format//
    logger.info(`Bookmark with id ${bookmark.id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

bookmarksRouter
  //Using express routing (routing params) to handle routing by bookmark id//
  .route("/bookmarks/:bookmark_id")
  .get((req, res) => {
    const { bookmark_id } = req.params;
    const bookmark = dataBank.bookmarks.find((c) => c.id == bookmark_id);
    //If bookmark by id is not found, respond with status code and "Bookmark not Found" message for the user//
    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Bookmark Not Found");
    }
    res.json(bookmark);
  })
  //Handles deleting bookmark specified by idex location and id//
  .delete((req, res) => {
    const { bookmark_id } = req.params;
    const bookmarkIndex = dataBank.bookmarks.findIndex(
      (b) => b.id === bookmark_id
    );
    
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Bookmark Not Found");
    }

    dataBank.bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Bookmark with id ${bookmark_id} deleted.`);
    res.status(204).end();
  });
module.exports = bookmarksRouter;
