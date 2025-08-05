const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTasks,
} = require("../controllers/taskcontroller");

const { validateTask } = require("../middleware/taskmiddleware");

router.post("/tasks", validateTask, createTask);
router.get("/tasks", getAllTasks);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks", deleteTasks);

module.exports = router;
