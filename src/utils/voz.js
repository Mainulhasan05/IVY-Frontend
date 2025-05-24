export async function speakWithElevenLabs(text, audioRef) {
  try {
    const response = await fetch('/api/elevenlabs-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    // If the API is disabled, do nothing
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      if (data.error && data.error.includes('disabled')) {
        return; // Do not play audio
      }
    }

    if (!response.ok) throw new Error('Error in ElevenLabs proxy');

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

    // Try to play the audio and handle any errors
    try {
      await audio.play();
    } catch (playError) {
      console.warn('Could not play audio automatically:', playError);

      // If the error is due to lack of user interaction, store the audio for later playback
      if (playError.name === 'NotAllowedError') {
        if (audioRef) {
          audioRef.current = audio;
        }
        console.error('User interaction is required to play the audio');
      }
      // throw playError;
    }
  } catch (error) {
    console.error('Error playing voice:', error);
    throw error;
  }
}
