const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
    getTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getDashboardData,
    getUserDashboardData
} = require("../controllers/taskController");

const router = express.Router();

// Task Management Routes
router.get("/dashboar-data", protect, getDashboardData);
router.get("/user-dashboar-data", protect, getUserDashboardData);
router.get("/", protect, getTask);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskCheckList);

module.exports = router;
