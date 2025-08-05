const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  borrowBook,
  returnBook,
  deleteBook
} = require("../controllers/library.controller");

const {
  validateBookData,
  checkBorrowLimit
} = require("../middleware/library.middleware");

// Routes
router.post("/library/books", validateBookData, addBook);
router.get("/library/books", getBooks);
router.patch("/library/borrow/:id", checkBorrowLimit, borrowBook);
router.patch("/library/return/:id", returnBook);
router.delete("/library/books/:id", deleteBook);

module.exports = router;
