import { useRef, useState } from 'react';

// Compara frases por palabras en común (umbral: 70%)
function areSimilarPhrases(f1, f2) {
  const palabras1 = f1.split(' ');
  const palabras2 = f2.split(' ');
  const comunes = palabras1.filter(p => palabras2.includes(p)).length;
  const maxLen = Math.max(palabras1.length, palabras2.length);
  return (comunes / maxLen) > 0.7;
}

// Elimina repeticiones exactas y frases muy similares
function removeRepeatingSimilarPhrases(texto) {
  const frases = texto
    .split(/[.?!,;:\n]+/)
    .map(f => f.trim().toLowerCase())
    .filter(Boolean);

  const uniquePhrases = [];
  frases.forEach(f => {
    if (!uniquePhrases.some(existing => areSimilarPhrases(existing, f))) {
      uniquePhrases.push(f);
    }
  });

  return uniquePhrases.join('. ') + (texto.trim().endsWith('.') ? '' : '.');
}

export default function useSpeechToText({
  onResult,
  lang = 'en-US',
  activateSendByKeyword = false,
  onSend
}) {
  const [isListening, setIsListening] = useState(false);
  const [tempText, setTempText] = useState('');
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  const startListening = () => {
    setTempText('');
    finalTranscriptRef.current = '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('This browser does not support SpeechRecognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const fullText = (finalTranscriptRef.current + interimTranscript).trim();
      setTempText(fullText);

      if (activateSendByKeyword && onSend) {
        const cleanText = textoCompleto.toLowerCase();
        if (/\b(send|ready|done|send it)\b/.test(cleanText)) {
          stopListening(); // detener antes de enviar
          onSend(cleanText.replace(/\b(send|ready|done|send it)\b/, '').trim());
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      if (isListening) recognition.start();
      else setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (tempText.trim()) {
        const clean = removeRepeatingSimilarPhrases(tempText.trim());
        onResult(clean);
      }
      setTempText('');
      finalTranscriptRef.current = '';
    }
  };

  return { isListening, startListening, stopListening, tempText };
}
