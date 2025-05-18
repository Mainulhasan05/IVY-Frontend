"use client";
import { useRef, useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { ChatMessages } from "../components/ChatMessages";
import { ChatInput } from "../components/ChatInput";
import { ChatHeader } from "../components/ChatHeader";
import { ProcessingStatus } from "../components/ProcessingStatus";
import { CallModal } from "../components/CallModal";

export default function ChatPage() {
  const {
    inputValue,
    setInputValue,
    messages,
    sendMessage,
    isLoading,
    processingStatus,
    updateProcessingStatus,
    isAudioPlaying,
    audioMessageIdx,
    pauseAudio,
    playAssistantAudio,
    loadingAudioIdx,
    setMessages,
  } = useChat();
  const chatRef = useRef();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side mounting detection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Data fetching effect
  useEffect(() => {
    if (!isMounted) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/chat-bot/conversation/0`
        );

        if (!res.ok) {
          console.warn(`API returned status: ${res.status}`);
          return;
        }

        const data = await res.json();

        // Validate data structure before updating state
        if (data && data.data && Array.isArray(data.data.messages)) {
          // Ensure each message has the required properties
          const safeMessages = data.data.messages.map((msg) => {
            if (msg?.sender) {
              if (msg.sender == "client") {
                msg.role = "user";
              } else {
                msg.role = "assistant";
              }
            }

            return {
              content: msg.message || "",
              // Preserve other properties
              ...msg,
            };
          });

          setMessages([...messages, ...safeMessages]);
        } else {
          console.warn("Invalid data format received:", data);
          // Initialize with empty array if no valid messages
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        // Initialize with empty array on error
        setMessages([]);
      }
    };

    fetchData();
  }, [isMounted, setMessages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Efecto para detectar acciones específicas en los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        const messageContent = lastMessage.content.toLowerCase();

        if (
          messageContent.includes("convertir") ||
          messageContent.includes("moneda")
        ) {
          updateProcessingStatus("converting");
        } else if (
          messageContent.includes("analizar") ||
          messageContent.includes("datos")
        ) {
          updateProcessingStatus("analyzing");
        } else if (
          messageContent.includes("generar") ||
          messageContent.includes("crear")
        ) {
          updateProcessingStatus("generating");
        } else {
          updateProcessingStatus("processing");
        }
      }
    }
  }, [messages, updateProcessingStatus]);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4 font-sans">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col bg-white rounded-lg shadow-md overflow-hidden relative">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto" ref={chatRef}>
          <ChatMessages
            messages={messages}
            isAudioPlaying={isAudioPlaying}
            audioMessageIdx={audioMessageIdx}
            pauseAudio={pauseAudio}
            playAssistantAudio={playAssistantAudio}
            loadingAudioIdx={loadingAudioIdx}
          />
          {isLoading && <ProcessingStatus status={processingStatus} />}
        </div>
        <div className="p-4 border-t border-gray-200">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={sendMessage}
            isProcessing={isLoading}
            pauseAudio={pauseAudio}
            onOpenCallModal={() => setIsCallModalOpen(true)}
          />
        </div>
        {isCallModalOpen && (
          <CallModal
            isOpen={isCallModalOpen}
            onClose={() => setIsCallModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
