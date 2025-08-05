const validateTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({ error: "Incomplete Data Received" });
  }

  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: "Invalid Priority Value" });
  }

  next();
};

module.exports = { validateTask };
