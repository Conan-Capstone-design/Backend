import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import crypto from "crypto";

import { saveTts, deleteVoice, generateVoice  } from "../services/tts.service.js";
import { getVoice, viewVoice } from "../providers/tts.provider.js";


// 음성, 텍스트 저장
export const saveVoice = async (req, res, next) => {
    console.log("음성 텍스트 저장");
    console.log("body:", req.body)

    // voice
    var voiceURL;
    if (req.file) {
        voiceURL = req.file.location;
    } else {
        voiceURL = null;
    }
    
    if (req.body.character_id > 3 || req.body.character_id < 1 ){
        return res.send(response(status.CHARACTER_NOT_FOUND, {}));
    }
    console.log("voiceURL:", voiceURL)
    const result = await saveTts(req.body, req.verifiedToken.user_id, voiceURL)


    res.send(response(status.SUCCESS, result));
};

// 저장 음성 전체 보기
export const voiceAll = async (req, res, next) => {
    console.log("저장 음성 전체 보기");
    console.log("user_id:",req.verifiedToken.user_id)

    const result = await viewVoice(req.verifiedToken.user_id)

    res.send(response(status.SUCCESS, result));
};

// 음성 불러오기
export const voicePlay = async (req, res, next) => {
    const id = req.params.voice_id;

    console.log("음성 재생");
    console.log("params:", id)
    console.log("user_id:",req.verifiedToken.user_id)

    const result = await getVoice(id, req.verifiedToken.user_id)

    res.send(response(status.SUCCESS, result));
};

// 음성 삭제
export const voiceDelete = async (req, res, next) => {
    const id = req.params.voice_id;

    console.log("음성 삭제");
    console.log("params:", id)
    console.log("user_id:",req.verifiedToken.user_id)

    const result = await deleteVoice(id, req.verifiedToken.user_id)

    res.send(response(status.SUCCESS, result));
};

// 음성 재생
export const PlayVoiceTemp = async (req, res, next) => {
  try {
    const { character, text } = req.body;

    if (!character || !text) {
      return res.send(response(status.PARAMETER_IS_WRONG, {
        message: "character/ text는 필수입니다."
      }));
    }

    const result = await generateVoice(character, text);

    return res.send(response(status.SUCCESS, result));
  } catch (error) {
    console.error("음성 재생 실패:", error);
    return res.send(response(status.INTERNAL_SERVER_ERROR, {
      error: error.message
    }));
  }
};
