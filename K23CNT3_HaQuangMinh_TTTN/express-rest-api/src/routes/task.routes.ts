import express from "express";
import * as controller from "../controllers/task.controller";
import protect from "../middleware/auth.middleware";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
  .get(controller.getTasks)
  .post(controller.createTask);

router.route('/:id')
  .put(controller.updateTask)
  .delete(controller.deleteTask);

export default router;
