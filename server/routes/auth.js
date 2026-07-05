import express from "express";
import { signup, login, forgotPassword, getChats ,clearChats, deleteChat, renameChat, togglePinChat } from "../controllers/authControllers.js";

const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Forgot Route
router.post("/forgot", forgotPassword);

// GetChat Route
router.get("/chat/:userId", getChats);

// Delete Route
router.delete("/chat/:userId", clearChats);

// Delete Chat Route
router.delete("/chat/delete/:chatId", deleteChat);

// Rename Chat route
router.put("/chat/rename/:chatId", renameChat);

// Pin Chat Route
router.patch("/chat/pin/:chatId", togglePinChat);

export default router;
