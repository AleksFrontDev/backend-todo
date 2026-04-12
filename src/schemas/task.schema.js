const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  completed: z.boolean().default(false),
  userId: z.number().int().positive('User ID must be a positive integer'),
});

const updateTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  completed: z.boolean().default(false)
});

const patchTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  completed: z.boolean().optional(),
});

const taskIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a numeric string'),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema,
  taskIdParamSchema,
};
