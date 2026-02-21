const prisma = require('../config/prisma');

// GET /tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {createdAt: 'desc'},
    });
    res.json(tasks);
  } catch (err) {
    console.error('GET Error:', err);
    res.status(500).json({error: err.message});
  }
};

// POST /tasks
const createTask = async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        completed: req.body.completed || false,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error('POST Error:', err);
    res.status(400).json({error: err.message});
  }
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});

    const task = await prisma.task.update({
      where: {id},
      data: {
        title: req.body.title,
        completed: req.body.completed,
      },
    });
    res.json(task);
  } catch (err) {
    console.error('PUT Error:', err);
    if (err.code === 'P2025') {
      res.status(404).json({error: `Task with ID ${req.params.id} not found`});
    } else {
      res.status(400).json({error: err.message});
    }
  }
};

// PATCH /tasks/:id
const patchTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});

    const data = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.completed !== undefined) data.completed = req.body.completed;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({error: 'No data to update'});
    }

    const task = await prisma.task.update({
      where: {id},
      data,
    });
    res.json(task);
  } catch (err) {
    console.error('PATCH Error:', err);
    if (err.code === 'P2025') {
      res.status(404).json({error: `Task with ID ${req.params.id} not found`});
    } else {
      res.status(400).json({error: err.message});
    }
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});

    await prisma.task.delete({where: {id}});
    res.json({success: true, message: 'Задача удалена', deletedId: id});
  } catch (err) {
    console.error('DELETE Error:', err);
    if (err.code === 'P2025') {
      res.status(404).json({error: `Task with ID ${req.params.id} not found`});
    } else {
      res.status(400).json({error: err.message});
    }
  }
};

// PATCH /tasks/:id/toggle
const toggleTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});

    const task = await prisma.task.findUnique({where: {id}});
    if (!task) {
      return res.status(404).json({error: `Task with ID ${id} not found`});
    }

    const updatedTask = await prisma.task.update({
      where: {id},
      data: {completed: !task.completed},
    });
    res.json(updatedTask);
  } catch (err) {
    console.error('TOGGLE Error:', err);
    res.status(400).json({error: err.message});
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  toggleTask,
};
