const Task = require("../models/Task");

// @desc Get all tasks (Admin: all, member: only assigned task)
// @route GET /api/task
// @acces Private
const getTask = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;
        if (req.user.role === "admin") {            
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );    
        }
        // Add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
              const completedCount = task.todoCheckList.filter(
                (item) => item.completed
              ).length;
              return { ...task._doc, completedTodoCount: completedCount}  
            })
        );
        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {}: { assignedTo: req.user._id }
        );
        
        const pendingTask = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.rol === "admin" && { assignedTo: req.user._id })
        });

        
        const inProgressTask = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.rol === "admin" && { assignedTo: req.user._id })
        });

        const completedTask = await Task.countDocuments({
            ...filter,
            status: "completed",
            ...(req.user.rol === "admin" && { assignedTo: req.user._id })
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTask,
                inProgressTask,
                completedTask
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Get Task By Id
// @route GET /api/task/:id
// @acces Private
const getTaskById = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Create Task
// @route POST /api/task/
// @acces Private (Admin only)
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList
        } = req.body;

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({message: "AssignedTo must be an array of user IDs"});
        }
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
            createdBy: req.user_id
        });

        res.status(201).json({ message: "Task created succesfuly", task });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Update Task
// @route PUT /api/task/:id
// @acces Private 
const updateTask = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Delete Task
// @route PUT /api/task/:id
// @acces Private (Admin only)
const deleteTask = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc update Task Status
// @route PUT /api/task/:id/status
// @acces Private 
const updateTaskStatus = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc update Task Status
// @route PUT /api/task/:id/todo
// @acces Private 
const updateTaskCheckList = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Get Dashboard Data
// @route GET /api/task/dashboar-data
// @acces Private 
const getDashboardData = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Get User Dashboard Data
// @route GET /api/task/user-dashboar-data
// @acces Private 
const getUserDashboardData = async (req, res) => {
    try {
        // const tasks = await 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = {
    getTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getDashboardData,
    getUserDashboardData
}