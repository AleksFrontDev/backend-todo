require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({adapter})

app.use(cors());
app.use(express.json());

// 📋 GET /tasks - Получить все задачи (ИЗМЕНИЛ: убрал /api)
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(tasks);
  } catch (err) {
    console.error('GET Error:', err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ➕ POST /tasks - Создать задачу
app.post('/tasks', async (req, res) => {
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
    res.status(400).json({
      error: err.message,
    });
  }
});

// 🔄 PUT /tasks/:id - Полностью обновить задачу
app.put('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const task = await prisma.task.update({
      where: { id: id },
      data: {
        title: req.body.title,
        completed: req.body.completed,
      },
    });

    res.json(task);
  } catch (err) {
    console.error('PUT Error:', err);

    if (err.code === 'P2025') {
      // Запись не найдена
      res.status(404).json({
        error: `Task with ID ${req.params.id} not found`,
      });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// ✏️ PATCH /tasks/:id - Частично обновить задачу
app.patch('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.completed !== undefined) data.completed = req.body.completed;

    // Проверяем, что есть что обновлять
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    const task = await prisma.task.update({
      where: { id: id },
      data: data,
    });

    res.json(task);
  } catch (err) {
    console.error('PATCH Error:', err);

    if (err.code === 'P2025') {
      res.status(404).json({
        error: `Task with ID ${req.params.id} not found`,
      });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// ❌ DELETE /tasks/:id - Удалить задачу
app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await prisma.task.delete({
      where: { id: id },
    });

    res.json({
      success: true,
      message: 'Задача удалена',
      deletedId: id,
    });
  } catch (err) {
    console.error('DELETE Error:', err);

    if (err.code === 'P2025') {
      res.status(404).json({
        error: `Task with ID ${req.params.id} not found`,
      });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// 🔄 PATCH /tasks/:id/toggle - Переключить статус completed
app.patch('/tasks/:id/toggle', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return res.status(404).json({
        error: `Task with ID ${id} not found`,
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: {
        completed: !task.completed,
      },
    });

    res.json(updatedTask);
  } catch (err) {
    console.error('TOGGLE Error:', err);
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
