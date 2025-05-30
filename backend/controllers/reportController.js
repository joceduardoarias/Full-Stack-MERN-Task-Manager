const Task = require("../models/Task");
const User = require("../models/User");
const excelJS =  require("exceljs");

// @desc Export all tasks as an Excel file 
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const worbook = new excelJS.Workbook();
        const worksheet = worbook.addWorksheet("Task Report");

        worksheet.columns = [
            { header: "Task Id", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "AssignedTo", key: "assignedTo", width: 30 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
            .map((user) => `${user.name} (${user.email})`)
            .join(",");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDtae.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned"
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );
    } catch (err) {
        res.status(500).json({ message: "Error exporting tasks", error: err.message })
    }
}

// @desc Export user tasks as an Excel file 
// @route GET /api/reports/export/users
// @access Private (Admin)
const exportUserReport = async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json({ message: "Error exporting tasks", error: err.message })
    }
}

module.exports = {exportTaskReport, exportUserReport}