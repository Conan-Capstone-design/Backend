import axios from 'axios';
import { GPT_CONFIG } from '../config/gpt.js';
import { characterPrompts } from '../config/characterPrompts.js';

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
