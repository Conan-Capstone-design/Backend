import express from "express";
import jwtMiddleware from "../../config/jwtMiddleware.js";
import { startChatCon, sendMessageCon, getChatListCon } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

// 채팅방 시작
chatRouter.post('/start', jwtMiddleware, startChatCon);
// gpt한테 채팅 전송
chatRouter.post('/send', jwtMiddleware, sendMessageCon);
// 채팅방 리스트
chatRouter.get('/list', jwtMiddleware, getChatListCon);

export { chatRouter };
