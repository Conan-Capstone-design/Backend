import { getCharacterIdByNameDAO, getExistingRoomDAO, createRoomDAO, getChatByChatIdDAO, saveMessageDAO, getNameByChatIdDAO, getChatListDAO } from '../models/chat.dao.js';
import { getGPTResponse } from '../../config/gptConnect.js';

// 채팅
export const startChatService = async (userId, characterName) => {
    const characterId = await getCharacterIdByNameDAO(characterName);
    if (characterId == null) {
        throw new Error("캐릭터가 존재하지 않습니다.");
    }

    const existingChatId = await getExistingRoomDAO(userId, characterId);
    if (existingChatId) {
        const messages = await getChatByChatIdDAO(existingChatId);
        return { chatId: existingChatId, messages, isNew: false };
    }

    const newChatId = await createRoomDAO(userId, characterId);
    const gptFirstMessage = await getGPTResponse("처음 인사해줘", characterName);

    await saveMessageDAO(newChatId, "assistant", gptFirstMessage);

    const messages = [{ role: "assistant", content: gptFirstMessage }];
    return { chatId: newChatId, messages, isNew: true };
};

// 채팅 메세지 보내기
export const sendMessageService = async (userId, chatId, message) => {
  // 사용자 메시지 저장
  await saveMessageDAO(chatId, 'user', message);

  // 해당 채팅방의 캐릭터 이름 조회
  const characterName = await getNameByChatIdDAO(chatId);

  // GPT 응답 생성
  const gptResponse = await getGPTResponse(message, characterName);

  // GPT 메시지 저장
  await saveMessageDAO(chatId, 'assistant', gptResponse);

  // 전체 메시지 반환
  return await getChatByChatIdDAO(chatId);
};

// 채팅방 목록
export const getChatListService = async (userId) => {
  return await getChatListDAO(userId);
}