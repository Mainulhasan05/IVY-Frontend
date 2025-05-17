import { useRef, useState } from 'react';

// Compara frases por palabras en común (umbral: 70%)
function sonFrasesSimilares(f1, f2) {
  const palabras1 = f1.split(' ');
  const palabras2 = f2.split(' ');
  const comunes = palabras1.filter(p => palabras2.includes(p)).length;
  const maxLen = Math.max(palabras1.length, palabras2.length);
  return (comunes / maxLen) > 0.7;
}

// Elimina repeticiones exactas y frases muy similares
function eliminarRepeticionesFrasesSimilares(texto) {
  const frases = texto
    .split(/[.?!,;:\n]+/)
    .map(f => f.trim().toLowerCase())
    .filter(Boolean);

  const frasesUnicas = [];
  frases.forEach(f => {
    if (!frasesUnicas.some(existing => sonFrasesSimilares(existing, f))) {
      frasesUnicas.push(f);
    }
  });

  return frasesUnicas.join('. ') + (texto.trim().endsWith('.') ? '' : '.');
}

export default function useSpeechToText({
  onResult,
  lang = 'es-ES',
  activarEnvioPorPalabraClave = false, // activa detección automática de palabras como "enviar"
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
      console.error('Este navegador no soporta SpeechRecognition');
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

      const textoCompleto = (finalTranscriptRef.current + interimTranscript).trim();
      setTempText(textoCompleto);

      if (activarEnvioPorPalabraClave && onSend) {
        const textoLimpio = textoCompleto.toLowerCase();
        if (/\b(enviar|listo|ya está|mándalo)\b/.test(textoLimpio)) {
          stopListening(); // detener antes de enviar
          onSend(textoLimpio.replace(/\b(enviar|listo|ya está|mándalo)\b/, '').trim());
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
        const limpio = eliminarRepeticionesFrasesSimilares(tempText.trim());
        onResult(limpio);
      }
      setTempText('');
      finalTranscriptRef.current = '';
    }
  };

  return { isListening, startListening, stopListening, tempText };
}
