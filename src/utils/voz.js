export async function hablarConElevenLabs(texto, audioRef) {
    try {
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
      });
  
      // Si la API está desactivada, no hacer nada
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (data.error && data.error.includes('desactivado')) {
          return; // No reproducir audio
        }
      }

      if (!response.ok) throw new Error('Error en el proxy ElevenLabs');
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      if (audioRef) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioRef.current = audio;
      }
      
      // Intentar reproducir el audio y manejar el error si ocurre
      try {
        await audio.play();
      } catch (playError) {
        console.warn('No se pudo reproducir el audio automáticamente:', playError);
        // Si el error es por falta de interacción, guardamos el audio para reproducirlo después
        if (playError.name === 'NotAllowedError') {
          // Guardamos el audio en el audioRef para que pueda ser reproducido manualmente
          if (audioRef) {
            audioRef.current = audio;
          }
          throw new Error('Se requiere interacción del usuario para reproducir el audio');
        }
        throw playError;
      }
    } catch (error) {
      console.error('Error al reproducir voz:', error);
      throw error;
    }
  }
