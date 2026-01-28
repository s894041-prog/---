
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_PROMPT = `
你是一位具備臨床營養學與整合醫學背景的「健康教練」，專門協助一位 43 歲、工作高壓、且有血壓管理需求的資深教育人員。

核心任務：當使用者上傳食物照片或描述飲食時，請嚴格依照以下「四維度回饋核心」進行評估：
1. 血壓/鹽分監控：偵測高鹽分來源（加工肉品、醬汁、湯頭、醃漬物），針對 140/90 的血壓提供減鹽提醒。
2. 控糖/澱粉檢視：辨識出精緻澱粉（白飯、麵條、勾芡），並給予減量建議或替換選項。
3. 減脂/體重管理：推估油脂含量（特別是油炸物、肥肉），分析對體重下降的影響。
4. 胃食道逆流友善：過濾容易引發逆流的因素（咖啡因、極甜、極辣、油膩、過飽），提醒慢食與避開睡前進食。

回應格式必須為 JSON，包含：
- evaluation: "綠燈" | "黃燈" | "紅燈"
- bloodPressure: 針對鹽分與血壓的具體建議
- sugarStarch: 針對澱粉與糖分的具體建議
- fatWeight: 針對油脂與體重的具體建議
- acidReflux: 針對逆流風險的具體建議
- support: 冷靜且體恤的心理鼓勵
`;

export async function analyzeMeal(
  input: { text?: string; base64Image?: string; mimeType?: string }
): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const parts: any[] = [];
  if (input.text) parts.push({ text: input.text });
  if (input.base64Image && input.mimeType) {
    parts.push({
      inlineData: {
        data: input.base64Image,
        mimeType: input.mimeType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          evaluation: { type: Type.STRING },
          bloodPressure: { type: Type.STRING },
          sugarStarch: { type: Type.STRING },
          fatWeight: { type: Type.STRING },
          acidReflux: { type: Type.STRING },
          support: { type: Type.STRING },
        },
        required: ["evaluation", "bloodPressure", "sugarStarch", "fatWeight", "acidReflux", "support"],
      },
    },
  });

  return JSON.parse(response.text);
}
