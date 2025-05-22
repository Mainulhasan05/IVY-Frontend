import { useRef, useState, useCallback, useEffect } from "react";

// Simple text cleaning to remove duplicates
function cleanText(text) {
  if (!text || text.trim().length === 0) return "";

  // Remove extra spaces and clean up
  return text.trim().replace(/\s+/g, " ");
}

export default function useSpeechToText({
  onResult,
  lang = "es-ES",
  confidenceThreshold = 0.6,
}) {
  const [isListening, setIsListening] = useState(false);
  const [tempText, setTempText] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    setTempText("");
    finalTranscriptRef.current = "";

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Simple configuration
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 1;

        if (result.isFinal) {
          // Only add if confidence is acceptable
          if (confidence >= confidenceThreshold) {
            finalTranscript += transcript + " ";
          }
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
      }

      const fullText = (finalTranscriptRef.current + interimTranscript).trim();
      setTempText(fullText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, lang, confidenceThreshold]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);

      if (tempText.trim()) {
        const cleanedText = cleanText(tempText.trim());
        onResult?.(cleanedText);
      }

      setTempText("");
      finalTranscriptRef.current = "";
    }
  }, [isListening, tempText, onResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    tempText,
    isSupported,
  };
}
