const Task = require("../models/task");

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const taskExists = await Task.findOne({ title });
    if (taskExists) {
      return res.status(400).json({ error: "Task title must be unique" });
    }

    const newTask = await Task.create({ title, description, priority, dueDate });
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllTasks = async (req, res) => {
  try {
    const filter = {};
    const { priority, isCompleted } = req.query;
    if (priority) filter.priority = priority;
    if (isCompleted) filter.isCompleted = isCompleted === "true";

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.priority && !["low", "medium", "high"].includes(updates.priority)) {
      return res.status(400).json({ error: "Invalid Priority Value" });
    }

    if (updates.isCompleted === true) {
      updates.completionDate = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;
    if (!priority) {
      return res.status(400).json({ error: "Priority required for bulk delete" });
    }

    const result = await Task.deleteMany({ priority });
    res.json({ message: `Deleted ${result.deletedCount} tasks` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTasks,
};
