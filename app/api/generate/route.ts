import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not set in .env.local' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { parkName, offerName, audience, validity, highlight, extras, tone } = body;

    const prompt = `
You are a marketing copywriter for a family water/theme park in South India.

You must return ONLY short, structured fields — NOT full messages.

Return ONLY valid JSON in this EXACT format:
{
  "headline": "string",
  "highlightLine": "string",
  "ctaLine": "string",
  "instaHashtags": "string"
}

Rules:
- headline → Max 12 words, promotional
- highlightLine → ONE punchy benefit sentence only
- ctaLine → ONE short urgent action line only
- instaHashtags → 3–5 hashtags only, space-separated
- Do NOT include emojis inside these fields
- Do NOT add extra keys
- Do NOT wrap in markdown

Details:
Park name: ${parkName}
Offer name: ${offerName}
Audience: ${audience}
Validity: ${validity}
Highlight: ${highlight}
Extras / T&Cs: ${extras}
Tone: ${tone}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful marketing copywriter.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', errorText);
      return NextResponse.json(
        { error: 'OpenAI API error', detail: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content from OpenAI' },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON from OpenAI:', content);
      return NextResponse.json(
        {
          error: 'Failed to parse OpenAI response as JSON',
          raw: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Server error', detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}