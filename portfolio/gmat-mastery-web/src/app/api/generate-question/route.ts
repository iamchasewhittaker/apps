import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { section, difficulty } = await req.json();

    if (!section || !difficulty) {
      return NextResponse.json({ error: 'Missing section or difficulty' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: 'You are an expert GMAT tutor. Generate realistic, high-quality GMAT practice questions that accurately reflect the logic, style, and difficulty of the real exam. Data Sufficiency questions MUST use the standard 5 fixed options.',
      messages: [
        {
          role: 'user',
          content: `Generate a ${difficulty} GMAT ${section} question.`,
        },
      ],
      tools: [
        {
          name: 'provide_gmat_question',
          description: 'Provide the generated GMAT question in a structured format.',
          input_schema: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The full text of the GMAT question.',
              },
              options: {
                type: 'object',
                properties: {
                  A: { type: 'string' },
                  B: { type: 'string' },
                  C: { type: 'string' },
                  D: { type: 'string' },
                  E: { type: 'string' },
                },
                required: ['A', 'B', 'C', 'D', 'E'],
                description: 'The 5 multiple choice options.',
              },
              correct: {
                type: 'string',
                enum: ['A', 'B', 'C', 'D', 'E'],
                description: 'The correct answer letter.',
              },
              topic: {
                type: 'string',
                description: 'The specific sub-topic (e.g., Ratios, Geometry, Sentence Correction).',
              },
              explanation: {
                type: 'string',
                description: 'A brief explanation of why the answer is correct.',
              },
            },
            required: ['question', 'options', 'correct', 'topic', 'explanation'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'provide_gmat_question' },
    });

    // Find the tool use block
    const toolUseBlock = response.content.find((block) => block.type === 'tool_use');
    
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      throw new Error('Failed to parse question from AI.');
    }

    return NextResponse.json(toolUseBlock.input);
  } catch (error: any) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during generation.' },
      { status: 500 }
    );
  }
}
