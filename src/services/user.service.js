import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import crypto from "crypto";
import { signinResponseDTO, existEmail } from "../dtos/user.dto";
import {
  addUser,
  getUser,
  getUserPreferToUserID,
  setPrefer,
} from "../models/user.dao";

export const joinUser = async (body) => {
  // 시간
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log("시간", created_at)

  // 비밀번호 암호화
  const hashedPassword = await crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");
  console.log("비밀번호 암호화" + hashedPassword);

  const joinUserData = await addUser({
    email: body.email,
    password: hashedPassword,
    nickname: body.nickname,
    option: body.option,
    created_at: created_at
  });

  // 이메일 중복시
  if (joinUserData == -1) {
    throw new BaseError(status.EMAIL_ALREADY_EXIST);
  } else {
    return joinUserData
  }
};
