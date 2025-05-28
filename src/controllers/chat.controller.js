import { startChatService, sendMessageService, getChatListService  } from '../services/chat.service.js';
import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { ChatRoomDTO } from '../dtos/chat.dto.js';

export const startChatCon = async (req, res) => {
    try {
        const userId = req.verifiedToken.user_id;
        const characterName = req.query.character_name;

        if (!characterName) {
            return res.send(response(status.BAD_REQUEST, { message: "character_name 쿼리 파라미터가 필요합니다." }));
        }

        const { chatId, messages, isNew } = await startChatService(userId, characterName);

        const dto = new ChatRoomDTO({
            chat_id: chatId,
            is_new: isNew,
            messages: messages,
        });

        res.send(response(status.SUCCESS, dto));
    } catch (error) {
        console.error('채팅방 생성 또는 조회 중 오류 발생:', error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 채팅 작성
export const sendMessageCon = async (req, res) => {
  try {
    const userId = req.verifiedToken.user_id;
    const { chat_id, message } = req.body;

    const messages = await sendMessageService(userId, chat_id, message);

    res.send(response(status.SUCCESS, messages));
  } catch (error) {
    console.error('메시지 전송 중 오류 발생:', error.message);
    res.send(response(status.INTERNAL_SERVER_ERROR, {}));
  }
};

// 채팅방 리스트
export const getChatListCon = async (req, res) => {
  try {
    const userId = req.verifiedToken.user_id;
    const result = await getChatListService(userId);
    res.send(response(status.SUCCESS, result));
  } catch (err) {
    console.error('채팅 목록 조회 중 오류 발생:', err);
    res.send(response(status.INTERNAL_SERVER_ERROR, {}));
  }
};