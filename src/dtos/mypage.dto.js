// mypageDto.js

// 유저 프로필 
export const userDTO = (data) => {
    return {
        email: data.email,
        nickname: data.nickname,
        profile_img: data.profile_image
    };
};

// 음성 목록
export const commentListDTO = (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
        character: item.character,
        created_at: item.created_at
    }));
};

// 프로필 수정용 DTO
export const patchUserProfileDTO = (data) => {
    return {
        email: data.email ?? null,
        nickname: data.nickname ?? null,
        password: data.password ?? null,
        profile_img: data.profile_img ?? null
    };
};
