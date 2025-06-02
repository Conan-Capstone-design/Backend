import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import crypto from "crypto";

import { saveTts } from "../services/tts.service.js";


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