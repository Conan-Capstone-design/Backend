import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import crypto from "crypto";
import jwt from "jsonwebtoken"

import {
  addUser
} from "../models/user.dao";

import { JWT_SECRET } from '../../config/jwt.js'
const jwtsecret = JWT_SECRET

// 회원가입
export const joinUser = async (body, image) => {
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
    image: image,
    created_at: created_at
  });

  // 이메일 중복시
  if (joinUserData == -1) {
    return joinUserData;
  } else {
    return joinUserData
  }
};

// 로그인 (Jwt 토큰 발급)
export const userLogin = async (user_id) => {
    try {
        //토큰 생성 Service
        let token = await jwt.sign(
          {
            user_id: user_id,
          }, // 토큰의 내용(payload)
          jwtsecret, // 비밀키
          {
            expiresIn: "1d",
            subject: "userInfo",
          } // 유효 기간 1일
        );
        console.log("jwtsecret:",jwtsecret)
        return token;
      } catch (err) {
        console.error("Error acquiring connection:", err);
      }
}