const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  toggleTask,
} = require('../controllers/taskcontroller');

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id', patchTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;
