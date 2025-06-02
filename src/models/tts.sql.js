// models/tts.sql.js
// tts 음성 텍스트 저장
export const insertTtsSql =
    "INSERT INTO character_voice (user_id, character_id, dialogue_text, voice, created_at) VALUES (?, ?, ?, ?, ?);";
