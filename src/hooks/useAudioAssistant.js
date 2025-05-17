import { useRef, useState, useEffect } from "react";
import { hablarConElevenLabs } from "../utils/voz";

export function useAudioAssistant() {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioMessageIdx, setAudioMessageIdx] = useState(null);
  const [loadingAudioIdx, setLoadingAudioIdx] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/notification.mp3');
    }
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Error al reproducir el sonido:', error);
      });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
      setAudioMessageIdx(null);
    }
  };

  const playAssistantAudio = async (texto, idx) => {
    setIsAudioPlaying(false);
    setAudioMessageIdx(null);
    setLoadingAudioIdx(idx);
    try {
      await hablarConElevenLabs(texto, audioRef);
      setIsAudioPlaying(true);
      setAudioMessageIdx(idx);
      setLoadingAudioIdx(null);
      if (audioRef.current) {
        audioRef.current.onended = () => {
          setIsAudioPlaying(false);
          setAudioMessageIdx(null);
        };
      }
    } catch (e) {
      setIsAudioPlaying(false);
      setAudioMessageIdx(null);
      setLoadingAudioIdx(null);
    }
  };

  return {
    audioRef,
    isAudioPlaying,
    audioMessageIdx,
    loadingAudioIdx,
    playNotificationSound,
    pauseAudio,
    playAssistantAudio,
  };
} 