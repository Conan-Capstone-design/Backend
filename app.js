import express from "express";
import { response } from "./config/response.js";
import { BaseError } from "./config/error.js";
import { status } from "./config/response.status.js";
import { userRouter } from "./src/routes/user.route.js";
import { mypageRouter } from "./src/routes/mypage.route.js";
import { chatRouter } from "./src/routes/chat.route.js";

const app = express();
// local로 접속시
// const port = 3000;

// elastic beanstalk으로 접속시
const port = 8080;

// server setting - veiw, static, body-parser etc..
app.set("port", process.env.PORT || 3000); // 서버 포트 지정
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함
app.use(express.urlencoded({ extended: false }));

// user
app.use("/user", userRouter);

// mypage
app.use("/mypage", mypageRouter);

// chatgpt
app.use("/chat", chatRouter);

// error handling
app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});

// app.use((err, req, res, next) => {
//   console.log(err.data.status);
//   console.log(err.data.message);
//   // 템플릿 엔진 변수 설정
//   res.locals.message = err.message;
//   // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
//   res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
//   res.status(err.data.status).send(response(err.data));
// });

app.use((err, req, res, next) => {
  const status = err?.data?.status || 500;
  const message = err?.data?.message || err.message || "Internal Server Error";

  console.error("에러 로그:", err);

  res.locals.message = message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};

  res.status(status).send(response({ status, message }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});