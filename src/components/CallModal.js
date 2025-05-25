"use client";

import { useAudioAssistant } from "@/hooks/useAudioAssistant";
import { useChat } from "@/hooks/useChat";
import { sendChatMessage } from "@/services/chatService";
import { useEffect, useRef, useState } from "react";

export function CallModal({ isOpen, onClose }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef(null);
  const microphoneRef = useRef(null);
  const lastTranscriptTimeRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  const {
    audioRef,
    isAudioPlaying,
    audioMessageIdx,
    loadingAudioIdx,
    playNotificationSound,
    pauseAudio,
    playAssistantAudio,
  } = useAudioAssistant();

  const {
    sendMessage
  } = useChat();


  async function sendTranscriptToAPI(transcript) {
    if (!transcript.trim()) return null;
    try {
      const res = await fetch("/api/transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript.trim() }),
      });
      console.log("Transcript sent to API.");
      return res
    } catch (err) {
      console.error("Failed to send transcript:", err);
      return null
    }
  }

  function resetSilenceTimer(currentTranscript) {
    lastTranscriptTimeRef.current = Date.now();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

    silenceTimeoutRef.current = setTimeout(() => {
      console.log("Detected silence. Sending transcript...");
      sendChatMessage({ userMessage: currentTranscript })
      .then((res) => {
        console.log("sending to assistantaudio:", res.response)
        playAssistantAudio(res.response)
      })
      setText(""); // Clear UI
    }, 2000); // 3 seconds of silence = done talking
  }

  async function startTranscription() {
    if (isRecording) return; // Prevent multiple inits

    setIsRecording(true);

    const DEEPGRAM_URL = "wss://api.deepgram.com/v1/listen?punctuate=true";
    const DEEPGRAM_API_KEY = "e324bc51d0aa777d7752e04db876b793e5670229";

    const socket = new WebSocket(`${DEEPGRAM_URL}`, ["token", DEEPGRAM_API_KEY]);
    socketRef.current = socket;

    socket.onopen = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        microphoneRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(e.data);
          }
        };

        recorder.start(100); // every 250ms
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setIsRecording(false);
        socket.close();
        onClose();
      }
    };

    socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        const newText = data.channel?.alternatives[0]?.transcript;
        if (newText && data.is_final) {
          setText((prev) => {
            const updated = prev + newText + "\n";
            resetSilenceTimer(updated);
            return updated
          })
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("Socket error:", err);
      stopTranscription();
    };

    socket.onclose = () => {
      console.log("Socket closed");
      setIsRecording(false);
    };
  }

  function stopTranscription() {
    microphoneRef.current?.stop();
    socketRef.current?.close();
    setIsRecording(false);
  }

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <button
        onClick={() => {
          stopTranscription();
          onClose();
        }}
        disabled={!isRecording}
        className="absolute top-6 right-6 z-50 text-gray-700 hover:text-gray-900 text-3xl"
        aria-label="Close"
      >
        x
      </button>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className={`relative w-56 h-56 flex items-center justify-center`}>
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={!isRecording ? "animate-pulse-fast" : "animate-pulse-slow"}
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
        <div className="mt-4 text-xl text-gray-700 text-center min-h-[2rem] whitespace-pre-wrap">
          {text}
        </div>
      </div>
      <div className="w-full flex justify-center gap-8 pb-10">
        <button
          onClick={startTranscription}
          disabled={isRecording}
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow"
          aria-label="Micrófono"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill={isRecording ? "#38bdf8" : "none"}
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
            <line x1="12" y1="22" x2="12" y2="18" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </button>
        <button
          onClick={stopTranscription}
          disabled={!isRecording}
          className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl shadow"
          aria-label="Close"
        >
          <svg width="32" height="32" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-fast {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1);}
          50% { opacity: 0.7; transform: scale(1.08);}
        }
      `}</style>
    </div>
  );
}
