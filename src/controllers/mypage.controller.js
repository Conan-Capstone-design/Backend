// mypageController.js
import { response } from '../../config/response.js'; 
import { status } from '../../config/response.status.js'; 
import { editImageProfile, deleteS3Object, renameS3Object } from '../../config/image.uploader.js';
import path from "path";

import { getUserInfo, getCommentList, getVoiceList, getVoiceListByChar, deleteVoice } from '../providers/mypage.provider.js'; 
import { getNicknameDao, getProfileImageDao, deleteImageDao, getEmailDao } from '../models/mypage.dao.js'; 
import { updateUser } from '../services/mypage.service.js'

// 마이페이지 메인 화면
export const getMyPageMainCon = async (req, res) => {
    try {
        const userInfo = await getUserInfo(req.verifiedToken.user_id);
        const commentList = await getCommentList(req.verifiedToken.user_id, 2);

        res.send(response(status.SUCCESS, {
            user: userInfo,
            commentList: commentList
        }));
    } catch (error) {
        console.error("마이페이지 메인 화면 정보를 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 저장한 캐릭터 대사 모음
export const getVoiceListCon = async (req, res) => {
    try {
        const result = await getVoiceList(req.verifiedToken.user_id);
        res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.error("저장한 캐릭터 대사 모음을 가져오는 중 오류 발생:", err);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 저장한 캐릭터 대사 모음 (캐릭터 날짜 별)
export const getVoiceListByCharCon = async (req, res) => {
    try {
        const characterName = req.query.characterName;

        const result = await getVoiceListByChar(req.verifiedToken.user_id, characterName);
        res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.error("저장한 캐릭터 대사 모음을 가져오는 중 오류 발생:", err);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 저장한 캐릭터 대사 모음 (삭제)
export const deleteVoiceCon = async (req, res) => {
    try {
        const user_id = req.verifiedToken.user_id;
        const { characterName, voiceId } = req.query;

        await deleteVoice(user_id, characterName, voiceId);
        res.send(response(status.SUCCESS, {}));
    } catch (err) {
        console.error('캐릭터 대사 삭제 중 오류 발생:', err);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 프로필 수정
export const updateUserCon = async (req, res) => {
    editImageProfile.single('profile_img')(req, res, async (err) => {
        if (err) {
            console.error("profile_img 업로드 오류:", err);
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        try {
            const userId = req.verifiedToken.user_id;
            const { nickname, password } = req.body;

            const profileData = {};

            if (nickname) profileData.nickname = nickname;
            if (password) profileData.password = password;

            // 프로필 이미지가 업로드된 경우에만 처리
            if (req.file) {
                const oldUrl = req.file.location;
                const oldKey = oldUrl.split('https://conan.s3.ap-northeast-2.amazonaws.com/')[1];
                const fileExtension = path.extname(oldKey);

                const emailResult = await getEmailDao(userId);
                const userEmail = emailResult[0][0].email;
                const newKey = `profile/${userEmail}${fileExtension}`;

                await renameS3Object(oldKey, newKey);
                const timestamp = new Date().getTime();
                profileData.photo = `https://conan.s3.ap-northeast-2.amazonaws.com/${newKey}?timestamp=${timestamp}`;
            }

            if (Object.keys(profileData).length === 0) {
                return res.send(response(status.BAD_REQUEST, { message: "수정할 값이 없습니다." }));
            }

            const result = await updateUser(userId, profileData);
            res.send(response(status.SUCCESS, profileData));
        } catch (error) {
            console.error("프로필 수정 중 오류:", error);
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};
