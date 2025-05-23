// 메시지 하나의 구조
export class ChatMessageDTO {
  constructor({ role, content }) {
    this.role = role;
    this.content = content;
  }
}

// 전체 채팅방 응답 구조
export class ChatRoomDTO {
  constructor({ chat_id, is_new, messages }) {
    this.chat_id = chat_id;
    this.is_new = is_new;
    this.messages = messages.map(msg => new ChatMessageDTO(msg));
  }
}
