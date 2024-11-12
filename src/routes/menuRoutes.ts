import { Router } from "express";
import {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getMenu);
router.post("/", authenticateAdmin, addMenuItem);
router.put("/:id", authenticateAdmin, updateMenuItem);
router.delete("/:id", authenticateAdmin, deleteMenuItem);

export default router;
