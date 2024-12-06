import verifyToken from "../Middleware/verifyToken.js";
import { Router } from "express";
import { getChat } from "../controllers/chats.controller.js";

const router = Router();

router.get("/", verifyToken, getChat);

export default router;