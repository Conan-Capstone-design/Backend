// mypageRoute.js

import express from 'express';
import jwtMiddleware from '../../config/jwtMiddleware.js';

import { getMyPageMainCon, updateUserCon  } from '../controllers/mypage.controller.js';

const mypageRouter = express.Router();

// 마이페이지 메인 화면
mypageRouter.get('/main', jwtMiddleware, getMyPageMainCon);
// 사용자 프로필 수정
mypageRouter.put('/profile', jwtMiddleware, updateUserCon);
// 저장된 캐릭터 대사 모음
mypageRouter.get('/voice-list', jwtMiddleware, getMyPageMainCon);

export { mypageRouter };