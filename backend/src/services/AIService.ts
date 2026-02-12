import OpenAI from 'openai';

export class AIService {
    private openai: OpenAI | null = null;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        } else {
            console.warn('OPENAI_API_KEY not found. AI features will be disabled.');
        }
    }

    async getFixSuggestion(code: string, errorLog: string): Promise<string | null> {
        if (!this.openai) {
            console.warn('AI Service is disabled due to missing API key.');
            return null;
        }

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are an expert embedded systems engineer. You will be provided with C++/Arduino code and a compilation error log. Your task is to fix the code. Return ONLY the full fixed code. Do not include markdown formatting or explanations.' },
                    { role: 'user', content: `Code:\n${code}\n\nError Log:\n${errorLog}` }
                ],
                model: 'gpt-4-turbo',
            });

            const fixedCode = completion.choices[0].message.content;
            return fixedCode ? fixedCode.replace(/```cpp/g, '').replace(/```/g, '').trim() : null;
        } catch (error) {
            console.error('Error fetching AI fix:', error);
            return null;
        }
    }
    async generateCode(prompt: string, board: string): Promise<string | null> {
        if (!this.openai) {
            console.warn('AI Service is disabled due to missing API key.');
            return null;
        }

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: `You are an expert embedded systems engineer. Write a complete, compilable C++/Arduino program for the ${board} based on the user's prompt. Return ONLY the code. Do not include markdown formatting or explanations.` },
                    { role: 'user', content: prompt }
                ],
                model: 'gpt-4-turbo',
            });

            const code = completion.choices[0].message.content;
            return code ? code.replace(/```cpp/g, '').replace(/```c/g, '').replace(/```/g, '').trim() : null;
        } catch (error) {
            console.error('Error generating AI code:', error);
            return null;
        }
    }
}
