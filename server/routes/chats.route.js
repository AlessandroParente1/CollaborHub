import verifyToken from "../Middleware/verifyToken.js";
import { Router } from "express";
import { createOrGetChat } from "../controllers/chats.controller.js";

const router = Router();

router.post("/createOrGet", verifyToken, createOrGetChat);


export default router;