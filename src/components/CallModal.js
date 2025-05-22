import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat"; // Import useChat to access the sendMessage functionality

export const CallModal = ({ isOpen, onClose }) => {
  const [isAssistantTalking, setIsAssistantTalking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [prevTranscript, setPrevTranscript] = useState("");
  const [isTranscriptComplete, setIsTranscriptComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioRef = useRef(new Audio());
  const silenceTimerRef = useRef(null);

  // Get sendMessage and messages from useChat hook
  const { sendMessage, messages, setInputValue, isLoading } = useChat();

  // Monitor for new assistant messages to speak
  useEffect(() => {
    if (!isOpen || !messages.length) return;

    const lastMessage = messages[messages.length - 1];

    // If we got a new assistant message and we're not already speaking
    if (lastMessage.role === "assistant" && !isSpeaking && isOpen) {
      speakWithElevenLabs(lastMessage.content);
    }
  }, [messages, isOpen, isSpeaking]);

  useEffect(() => {
    if (!isOpen) return;

    // Deepgram WebSocket endpoint
    const DEEPGRAM_API_KEY = "8abd6e1342bcb2b6845d355a091a15afd65fb20c"; // Replace with your API Key
    const deepgramUrl = `wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true`;

    console.log("Attempting to open WebSocket with Deepgram...");
    // Open WebSocket
    const ws = new WebSocket(deepgramUrl, ["token", DEEPGRAM_API_KEY]);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket opened successfully.");
      // Access microphone
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Microphone access granted.");
          mediaStreamRef.current = stream;
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);

          source.connect(processor);
          processor.connect(audioContext.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === 1) {
              const inputData = e.inputBuffer.getChannelData(0);
              const buffer = new ArrayBuffer(inputData.length * 2);
              const view = new DataView(buffer);
              for (let i = 0; i < inputData.length; i++) {
                view.setInt16(i * 2, inputData[i] * 0x7fff, true);
              }
              ws.send(buffer);
            }
          };

          ws.onclose = () => {
            console.log("WebSocket closed (from getUserMedia).");
            processor.disconnect();
            source.disconnect();
            audioContext.close();
            stream.getTracks().forEach((track) => track.stop());
          };
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
        });
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed (global event):", e);
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.channel && data.channel.alternatives[0]) {
        const newTranscript = data.channel.alternatives[0].transcript;

        // Only update the transcript if it's different
        if (newTranscript !== transcript) {
          setTranscript(newTranscript);
          setIsAssistantTalking(!!newTranscript);

          // Reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // If the transcript is non-empty, set a silence detection timer
          if (newTranscript.trim()) {
            silenceTimerRef.current = setTimeout(() => {
              if (newTranscript !== prevTranscript && !isProcessing) {
                setPrevTranscript(newTranscript);
                sendTranscriptToBackend(newTranscript);
              }
            }, 1500); // Wait 1.5 seconds of silence before sending
          }
        }

        // If we have transcript and the flag is set that it's final
        if (data.is_final && newTranscript && !isProcessing) {
          clearTimeout(silenceTimerRef.current);
          setPrevTranscript(newTranscript);
          sendTranscriptToBackend(newTranscript);
        }
      }
    };

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      ws.close();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [isOpen, transcript, prevTranscript, isProcessing]);

  // Function to send transcript to backend
  const sendTranscriptToBackend = async (text) => {
    if (!text.trim() || isProcessing || isLoading) return;

    setIsProcessing(true);
    console.log("Sending transcript to backend:", text);

    // Update input value and send message
    setInputValue(text);
    await sendMessage(text);

    // Reset transcript and processing state
    setTranscript("");
    setIsProcessing(false);
  };

  // Function to speak text using ElevenLabs
  const speakWithElevenLabs = async (text) => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);
    setIsAssistantTalking(true);

    try {
      // Replace with your ElevenLabs API key
      const ELEVENLABS_API_KEY =
        "sk_9d2112572f37a43b005a83490d510f003100acafac152954";
      // Replace with your desired voice ID
      const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setIsAssistantTalking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.play();
    } catch (error) {
      console.error("Error with ElevenLabs TTS:", error);
      setIsSpeaking(false);
      setIsAssistantTalking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-gray-700 hover:text-gray-900 text-3xl"
        aria-label="Cerrar"
      >
        ×
      </button>
      {/* SVG animation centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className={`relative w-56 h-56 flex items-center justify-center`}>
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={
              isAssistantTalking ? "animate-pulse-fast" : "animate-pulse-slow"
            }
          >
            <defs>
              <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#38bdf8" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="100" fill="url(#grad)" />
          </svg>
        </div>
        <div className="mt-4 text-xl text-gray-700 text-center min-h-[2rem]">
          {isProcessing ? "Processing..." : transcript}
        </div>
        {isProcessing && (
          <div className="mt-2 text-blue-500">
            <div className="loader"></div>
          </div>
        )}
      </div>
      {/* Buttons at the bottom */}
      <div className="w-full flex justify-center gap-8 pb-10">
        {/* Microphone button */}
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow
            ${isAssistantTalking ? "bg-blue-100 animate-mic" : "bg-gray-100"}
          `}
          aria-label="Micrófono"
          disabled={isProcessing}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill={isAssistantTalking ? "#38bdf8" : "none"}
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isAssistantTalking ? "animate-mic-icon" : ""}
          >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
            <line x1="12" y1="22" x2="12" y2="18" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </button>
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl shadow"
          aria-label="Cerrar"
        >
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {/* Custom Tailwind animations */}
      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-fast {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }
        .animate-mic {
          animation: micpulse 1.2s infinite;
        }
        @keyframes micpulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 #38bdf855;
          }
          50% {
            box-shadow: 0 0 0 12px #38bdf822;
          }
        }
        .animate-mic-icon {
          animation: micicon 1.2s infinite;
        }
        @keyframes micicon {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        .loader {
          border: 3px solid #f3f3f3;
          border-radius: 50%;
          border-top: 3px solid #38bdf8;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
