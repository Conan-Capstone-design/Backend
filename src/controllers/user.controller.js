import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import crypto from "crypto";

import { joinUser, userLogin } from "../services/user.service.js";
import { Users, repeatId, passwordCheck, withdrawUser } from "../providers/user.provider.js";

// 전체 회원 조회
export const allUser = async (req, res, next) => {
  console.log("전체 회원 조회");

  res.send(response(status.SUCCESS, await Users()));
};

// 회원가입
export const signUp = async (req, res, next) => {
  console.log("회원가입을 요청하였습니다!");
  console.log("body:", req.body);

  // image
  var imageURL;
  if (req.file) {
    imageURL = req.file.location;
  } else {
    imageURL = null;
  }
  console.log("imageURL:", imageURL)

  res.send(response(status.SUCCESS, await joinUser(req.body, imageURL)));
};

// 로그인
export const login = async (req, res, next) => {
  console.log("로그인(jwt token 발급)을 요청하였습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 찍어보기 위한 테스트용
  // id 존재하는지 확인
  const userId = await repeatId(req.body);

  if (userId == undefined) {
    return res.send(response(status.USER_NOT_EXIST, {}));
  }
  // 아이디
  console.log(userId.email)

  const selectUserId = userId.email;

  // 비밀번호 확인
  const hashedPassword = await crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  // 해시화된 암호
  console.log(hashedPassword);
  const selectUserPasswordParams = [selectUserId, hashedPassword];
  const passwordRows = await passwordCheck(
    selectUserPasswordParams
  );

  if (!passwordRows || passwordRows.password !== hashedPassword) {
    return res.send(response(status.LOGIN_PASSWORD_WRONG, {}));
  }
  console.log("passwordRows.user_id:", passwordRows.user_id)
  const token = await userLogin(passwordRows.user_id);
  console.log("token:", token);
  return res.send(response(status.SUCCESS, token));
};

// 회원 탈퇴
export const withdraw = async (req, res, next) => {
  try {
    const user_id = req.verifiedToken.user_id;
    await withdrawUser(user_id);
    return res.send(response(status.SUCCESS, { message: "회원 탈퇴 완료" }));
  } catch (err) {
    console.error("회원 탈퇴 중 오류 발생:", err);
    return res.send(response(status.INTERNAL_SERVER_ERROR, {}));
  }
};