function limpiarTexto(texto) {
  return texto
    .replace(/[*•●\-–—]/g, '')
    .replace(/[_`~^]/g, '')
    .replace(/\n|\r|\t|\f/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[\[\]{}()<>]/g, '')
    .trim();
}

export async function POST(req) {
  if (process.env.USE_ELEVENLABS === "false") {
    return new Response(JSON.stringify({ error: "ElevenLabs desactivado por configuración" }), { status: 200 });
  }

  const { texto } = await req.json();
  if (!texto) {
    return new Response(JSON.stringify({ error: 'Texto requerido' }), { status: 400 });
  }

  const textoLimpio = limpiarTexto(texto);

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/CyVqdFYIjWPbtLUmk4zj', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: textoLimpio,
        voice_settings: {
          stability: 0.40,
          similarity: 0.80,
          speed: 1.10,
          style: 0.2
        }
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Error en ElevenLabs' }), { status: 500 });
    }

    // Devuelve el audio como stream
    return new Response(response.body, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno', details: error.message }), { status: 500 });
  }
}