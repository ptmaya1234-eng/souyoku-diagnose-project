// netlify/functions/gemini.js

// サーバー側で Google のライブラリを使うための宣言
const { GoogleGenAI } = require('@google/genai');

// Netlifyの環境変数からAPIキーを安全に取得します
const apiKey = process.env.GEMINI_API_KEY; 
const ai = new GoogleGenAI(apiKey);
const MODEL_NAME = 'gemini-2.5-flash'; // コスト重視モデル

// Netlify Functionがリクエストを受け取ったときに実行される部分
exports.handler = async (event) => {
    
    // ユーザーから送られてきたデータ（systemPrompt, userQuery）をリクエストボディから取得
    const { systemPrompt, userQuery } = JSON.parse(event.body);

    try {
        // ★★★ index.htmlから移動させたAPI呼び出しの具体的なロジック ★★★
        const response = await ai.models.generateContent({
            model: MODEL_NAME, // 'gemini-2.5-flash' を使用
            systemInstruction: systemPrompt,
            contents: [
                {
                    role: "user",
                    parts: [{ text: userQuery }]
                }
            ],
            config: {
                maxOutputTokens: 2048,
            }
        });
        
        // 成功したら、結果のテキストだけをブラウザに返します
        return {
            statusCode: 200,
            body: JSON.stringify({ text: response.text }),
        };

    } catch (error) {
        // エラー処理部分（このまま利用します）
        console.error("Gemini API Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'AI診断レポートの生成中にエラーが発生しました。' }),
        };
    }
};