import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { description } = await req.json();

        const prompt = `Genereaza-mi valori nutritionale pentru acest produs cu urmatoarea descriere, returneaza doar rezultatul de forma 310 kcal, etc. adauga tot ce e nevoie proteine lipide etc. IMPORTANT:nu adauga alt text in raspuns inafara de valorile generate: ${description}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const nutritionalValues = completion.choices[0].message.content;

        return NextResponse.json({ nutritionalValues });
    } catch (error) {
        console.error('Error generating nutritional values:', error);
        return NextResponse.json({ error: 'Failed to generate nutritional values' }, { status: 500 });
    }
}