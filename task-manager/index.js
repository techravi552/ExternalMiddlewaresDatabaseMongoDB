const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("./models/Task");

dotenv.config();
const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));


app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send({ message: "Task created", task });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const { status, dueDate } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(filter);
    res.send(tasks);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).send({ error: "Task not found" });
    res.send({ message: "Task updated", task });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send({ error: "Task not found" });
    res.send({ message: "Task deleted" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
