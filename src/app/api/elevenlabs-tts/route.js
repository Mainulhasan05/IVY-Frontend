function getCleanText(text) {
  return text
    .replace(/[*•●\-–—]/g, '')
    .replace(/[_`~^]/g, '')
    .replace(/\n|\r|\t|\f/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[\[\]{}()<>]/g, '')
    .trim();
}

export async function POST(req) {
  if (process.env.USE_ELEVENLABS === "false") {
    return new Response(JSON.stringify({ error: "ElevenLabs disabled by configuration" }), { status: 200 });
  }

  const { text } = await req.json();
  if (!text) {
    return new Response(JSON.stringify({ error: 'Text required' }), { status: 400 });
  }

  const cleanText = getCleanText(text);
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/CyVqdFYIjWPbtLUmk4zj', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: cleanText,
        voice_settings: {
          stability: 0.40,
          similarity: 0.80,
          speed: 1.00,
          style: 0.2
        }
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Error in ElevenLabs' }), { status: 500 });
    }

    // Devuelve el audio como stream
    return new Response(response.body, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal error', details: error.message }), { status: 500 });
  }
}