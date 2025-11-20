import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompts = {
  caption: `You are an expert at writing compelling social media captions. Your task is to take user-provided text and transform it into a clearer, more engaging caption. Focus on:
- Removing filler words and redundancy
- Creating a strong hook in the first line
- Using active voice and concrete language
- Maintaining authenticity while improving clarity
- Keeping it concise and punchy

Return only the improved caption, no explanations.`,

  bio: `You are an expert at writing clear, compelling profile bios. Your task is to transform user-provided bio text into something more impactful. Focus on:
- Leading with what makes them unique or valuable
- Using concrete language over vague claims
- Creating intrigue or immediate value
- Keeping it concise and scannable
- Removing clichés and generic phrases

Return only the improved bio, no explanations.`,

  message: `You are an expert at clear, professional communication. Your task is to improve user-provided messages or emails. Focus on:
- Getting to the point quickly
- Using clear, direct language
- Maintaining appropriate tone (professional but human)
- Removing unnecessary qualifiers and apologies
- Making asks or next steps explicit

Return only the improved message, no explanations.`,

  tweet: `You are an expert at writing engaging tweets/posts. Your task is to transform user-provided text into a more compelling post. Focus on:
- Starting with a hook that grabs attention
- Making every word count
- Using concrete examples over abstractions
- Creating curiosity or providing immediate value
- Being concise and punchy

Return only the improved post, no explanations.`,
};

export async function POST(request: NextRequest) {
  try {
    const { text, type } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (!type || !['caption', 'bio', 'message', 'tweet'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: caption, bio, message, tweet' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const upgraded = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      original: text,
      upgraded: upgraded.trim(),
      improvements: [], // Could add specific improvements here
    });
  } catch (error) {
    console.error('Error upgrading text:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to upgrade text' },
      { status: 500 }
    );
  }
}

