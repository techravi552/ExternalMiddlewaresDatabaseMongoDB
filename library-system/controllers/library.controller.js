const Library = require("../models/library.model");

// 📗 Add book
const addBook = async (req, res) => {
  try {
    const book = await Library.create({ ...req.body, status: "available" });
    res.status(201).json({ message: "Book added", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📘 Get books (with optional filter)
const getBooks = async (req, res) => {
  try {
    const { status, title } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" };

    const books = await Library.find(filter);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📕 Borrow book
const borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowerName } = req.body;

    const book = await Library.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status !== "available") return res.status(409).json({ error: "Book not available" });

    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + 14);

    book.status = "borrowed";
    book.borrowerName = borrowerName;
    book.borrowDate = today;
    book.dueDate = due;

    await book.save();
    res.status(200).json({ message: "Book borrowed", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Return book
const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Library.findById(id);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status !== "borrowed") return res.status(409).json({ error: "Book is not currently borrowed" });

    const today = new Date();
    let overdueFees = 0;

    if (book.dueDate && today > book.dueDate) {
      const diff = Math.ceil((today - book.dueDate) / (1000 * 60 * 60 * 24));
      overdueFees = diff * 10; // Rs. 10 per day
    }

    book.status = "available";
    book.returnDate = today;
    book.overdueFees = overdueFees;
    book.borrowerName = null;
    book.borrowDate = null;
    book.dueDate = null;

    await book.save();
    res.status(200).json({
      message: "Book returned",
      overdueFees,
      book
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑 Delete book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Library.findById(id);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status === "borrowed") return res.status(409).json({ error: "Cannot delete a borrowed book" });

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addBook,
  getBooks,
  borrowBook,
  returnBook,
  deleteBook
};
