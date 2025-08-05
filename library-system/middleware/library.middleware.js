const Library = require("../models/library.model");

// 🔎 Validation for adding book
const validateBookData = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Incomplete Data" });
  }
  next();
};

// 📚 Borrow limit (max 3 books)
const checkBorrowLimit = async (req, res, next) => {
  const { borrowerName } = req.body;
  const activeBorrowed = await Library.countDocuments({
    borrowerName,
    status: "borrowed"
  });

  if (activeBorrowed >= 3) {
    return res.status(409).json({
      error: `${borrowerName} already borrowed 3 books`
    });
  }

  next();
};

module.exports = {
  validateBookData,
  checkBorrowLimit
};
