const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  toggleTask,
} = require('../controllers/task.controller');
const {validate, validateParams} = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema,
  taskIdParamSchema,
} = require('../schemas/task.schema');

router.use(authMiddleware);
router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put(
  '/:id',
  validateParams(taskIdParamSchema),
  validate(updateTaskSchema),
  updateTask,
);
router.patch(
  '/:id',
  validateParams(taskIdParamSchema),
  validate(patchTaskSchema),
  patchTask,
);
router.delete('/:id', validateParams(taskIdParamSchema), deleteTask);
router.patch('/:id/toggle', validateParams(taskIdParamSchema), toggleTask);

module.exports = router;
