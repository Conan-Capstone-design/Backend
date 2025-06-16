import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { uploadAudioToS3, deleteAudioFromS3 } from "../../config/voice.uploader.js";


import {
    ttsSave, voiceDelete
} from "../models/tts.dao";

// tts 음성 텍스트 저장
export const saveTts = async (body, user_id, voice) => {
    // 시간
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("시간", created_at)

    const result = await ttsSave({
        user_id: user_id,
        character_id: body.character_id,
        title: body.title,
        text: body.dialogue_text,
        voice: voice,
        created_at: created_at
    });
};

// 음성 삭제
export const deleteVoice = async (voice_id, user_id) => {
    const result = await voiceDelete(voice_id, user_id);
};

//음성 생성
export const generateVoice = async (character, text) => {
  const ttsUrl = "http://conan-tts-conan.store/synthesize";
  const characterMap = {
    "코난": "conan",
    "케로로": "keroro",
    "짱구": "jjanggu"
  };

  const mappedCharacter = characterMap[character] || character; // 매핑 없으면 원래값

  const synthRes = await axios.post(
    ttsUrl,
    {
      character: mappedCharacter, // <-- character도 함께 전송
      text
    },
    {
      responseType: "arraybuffer",
      timeout: 500000,
    }
  );

  const buffer = Buffer.from(synthRes.data);
  const filename = `temp-tts/${uuidv4()}.wav`;

  // S3 업로드 (직접 호출)
  await uploadAudioToS3(buffer, filename);

  const voiceURL = `https://conan.s3.ap-northeast-2.amazonaws.com/${filename}`;

  // 자동 삭제 예약
  setTimeout(async () => {
    try {
      await deleteAudioFromS3(filename);
      console.log("S3 자동 삭제 완료:", filename);
    } catch (err) {
      console.error("S3 삭제 실패:", err.message);
    }
  }, 1000 * 60 * 5);

  return {
    voice_url: voiceURL
  };
};