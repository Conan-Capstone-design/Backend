import axios from 'axios';
import { GPT_CONFIG } from '../config/gpt.js';

// 캐릭터별 프롬프트
const characterPrompts = {
    '코난': "당신은 명탐정 코난입니다. 논리적이고 침착한 말투로 대화합니다.",
    '짱구': "당신은 짱구입니다. 5살 유치원생처럼 느릿하고 장난스럽게 대답하세요.",
    '케로로': "당신은 케로로 중사입니다. 우주정복을 노리는 군대식 말투를 사용하세요."
};

export const getGPTResponse = async (message, characterName) => {
    try {
        const character_prompt = characterPrompts[characterName];

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: character_prompt },
                    { role: 'user', content: message }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${GPT_CONFIG.OPENAI_SECRET_KEY}`,
                    'OpenAI-Organization': GPT_CONFIG.OPENAI_ORGANIZATION,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GPT 응답 오류:', error);
        throw new Error('GPT 응답 중 오류 발생');
    }
};
