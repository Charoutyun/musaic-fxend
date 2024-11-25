import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: 'Prompt is required.' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', 
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    return NextResponse.json({ reply: assistantMessage });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error fetching ChatGPT response:',
        error.response?.data || error.message
      );
    } else {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch response from ChatGPT.' },
      { status: 500 }
    );
  }
}
