import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { question, studentAnswer, correctAnswer } = await req.json();

    if (!question || !studentAnswer || !correctAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: 'You are an encouraging GMAT tutor for a beginner student. Explain answers clearly and concisely using the Socratic method.',
      messages: [
        {
          role: 'user',
          content: `GMAT question: "${question}"\nStudent answered: "${studentAnswer}"\nCorrect answer: "${correctAnswer}"\n\nExplain in 3 concise bullet points:\n1. Why the correct answer is right\n2. Why the student's answer is wrong (if different)\n3. The key concept to remember for next time\nKeep it encouraging and clear for a beginner.`,
        },
      ],
      tools: [
        {
          name: 'provide_socratic_explanation',
          description: 'Provide the 3-point explanation.',
          input_schema: {
            type: 'object',
            properties: {
              bullets: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                maxItems: 3,
                description: 'The 3 concise bullet points.',
              },
            },
            required: ['bullets'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'provide_socratic_explanation' },
    });

    const toolUseBlock = response.content.find((block) => block.type === 'tool_use');
    
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      throw new Error('Failed to parse explanation from AI.');
    }

    return NextResponse.json(toolUseBlock.input);
  } catch (error: any) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during generation.' },
      { status: 500 }
    );
  }
}
