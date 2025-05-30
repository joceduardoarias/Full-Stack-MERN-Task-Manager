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
                return { ...task._doc, completedTodoCount: completedCount }
            })
        );
        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
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
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )
        if (!task) {
            res.status(404).json({ message: "task not found" });
        }
        return res.json(task)
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

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "AssignedTo must be an array of task IDs" });
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
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not Found" });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDtae = req.body.dueDtae || task.dueDtae;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of task ID's" });
            }
        }
        const updatedTask = await task.save();

        res.json({ message: "Task updated succesfuly", updatedTask });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc Delete Task
// @route PUT /api/task/:id
// @acces Private (Admin only)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).select("-password");
        if (!task) {
            res.status(404).json({ message: "task not found" });
        }

        await Task.deleteOne({ _id: req.params.id });

        return res.json({ message: "Task deleted succesfuly" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc update Task Status
// @route PUT /api/task/:id/status
// @acces Private 
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not Found" });
        }
        
        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        )

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.status = req.body.status || task.status;
    
        if (task.status === "Completed") {
            task.todoCheckList.forEach(item => {
                item.completed = true;
            });
            task.progress = 100;
        }
        await task.save();

        res.json({ message: "Task updated succesfuly", task });
        
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc update Task Status
// @route PUT /api/task/:id/todo
// @acces Private 
const updateTaskCheckList = async (req, res) => {
    try {
        const { todoCheckList } = req.body;

        const task = await Task.findById(req.params.id);
         if (!task) {
            return res.status(404).json({ message: "Task not Found" });
        }
        
        if (!task.assignedTo.includes(req.user._id) && req.user.role === "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.todoCheckList = todoCheckList; // Replace with updated checklist

        const completedCount = task.todoCheckList.filter(
            (item) => item.completed
        ).length;
        
        const totalItems = task.todoCheckList.length;

        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems)*100) : 0;

        if(task.progress === 100){
            task.status = "Completed";
        }else if(task.progress > 0){
            task.status = "In Progress";
        }else{
            task.status = "Pending";
        }

        await task.save();

        const updatedTask = await task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.json({ message: "Task Checklist updated", updatedTask});
        
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

// @desc Get task Dashboard Data
// @route GET /api/task/task-dashboar-data
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