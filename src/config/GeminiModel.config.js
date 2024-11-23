import { GoogleGenerativeAI } from '@google/generative-ai'
import { configDotenv } from 'dotenv';
configDotenv()


const GeminiAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);


const GeminiModelConfig = GeminiAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: [{ codeExecution: {} }],
});

export default GeminiModelConfig
