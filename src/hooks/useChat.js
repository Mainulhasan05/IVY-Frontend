import { useState, useRef, useEffect } from "react";
import { CLOSING_REGEX } from "../utils/closingRegex";
import { useAudioAssistant } from "./useAudioAssistant";
import { sendChatMessage } from "../services/chatService";
import { getRoundedTimestamp } from "../utils/chatUtils";

export const useChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, 👋 I'm Ivy, your virtual assistant. How may I help you today?",
      timestamp: getRoundedTimestamp(),
    },
  ]);
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [pendingFolderRequest, setPendingFolderRequest] = useState(false);

  // Hook de audio modularizado
  const {
    audioRef,
    isAudioPlaying,
    audioMessageIdx,
    loadingAudioIdx,
    playNotificationSound,
    pauseAudio,
    playAssistantAudio,
  } = useAudioAssistant();

  // Guarda el contenido del último mensaje del asistente reproducido
  const lastPlayedAssistantContent = useRef(null);

  // Efecto para reproducir el audio solo cuando llega un nuevo mensaje del asistente
  useEffect(() => {
    const lastIdx = messages.length - 1;
    if (
      lastIdx >= 0 &&
      messages[lastIdx].role === "assistant" &&
      lastPlayedAssistantContent.current !== messages[lastIdx].content
    ) {
      lastPlayedAssistantContent.current = messages[lastIdx].content;
      pauseAudio();
      playAssistantAudio(messages[lastIdx].content, lastIdx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const sendMessage = async () => {
    const userText = inputValue.trim();

    if (!userText || isClosed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText, timestamp: getRoundedTimestamp() },
    ]);
    setInputValue("");
    setIsLoading(true);
    setProcessingStatus("processing");
    try {
      const data = await sendChatMessage({ userMessage: userText, threadId });
      if (data.threadId) setThreadId(data.threadId);
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error,
            timestamp: data.timestamp || getRoundedTimestamp(),
          },
        ]);
        setIsLoading(false);
        setProcessingStatus(null);
        return;
      }
      if (data.response) {
        if (data.processingStatus) {
          setProcessingStatus(data.processingStatus);
        }
        const isClosing = CLOSING_REGEX.some((regex) =>
          regex.test(data.response)
        );
        // Si es cierre y no hay carpeta, y no hemos pedido aún la carpeta
        if (isClosing && !data.folderUrl && !pendingFolderRequest) {
          setPendingFolderRequest(true);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.response,
              timestamp: data.timestamp || getRoundedTimestamp(),
            },
          ]);
          setIsLoading(true);
          setProcessingStatus("processing");
          setTimeout(async () => {
            setInputValue("");
            await sendMessageAuto(
              "Send your farewell to the user in a personalized way and create a folder in Google Drive so they can upload references for the desired product."
            );
          }, 500);
          return;
        }
        // Si ya existe la carpeta, procedemos con el cierre normal
        if (isClosing && data.folderUrl) {
          setIsClosed(true);
          setPendingFolderRequest(false);
          await playAssistantAudio(data.response, messages.length);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.response,
              timestamp: data.timestamp || getRoundedTimestamp(),
            },
            {
              role: "system",
              content: `🔒 The conversation has ended. If you'd like to start a new one, please refresh the page.\n\n📁 A folder has been created in Google Drive with the conversation information: ${data.folderUrl}`,
              timestamp: getRoundedTimestamp(),
            },
          ]);
          setInputValue("");
          setIsLoading(false);
          setProcessingStatus(null);
          return;
        }
        // Si no es cierre, resetea el pendingFolderRequest
        if (!isClosing) setPendingFolderRequest(false);
        await playAssistantAudio(data.response, messages.length);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            timestamp: data.timestamp || getRoundedTimestamp(),
          },
        ]);
        playNotificationSound();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ There was an error processing your message. Please try again.",
          timestamp: getRoundedTimestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setProcessingStatus(null);
    }
  };

  // Nueva función para enviar mensaje automático
  const sendMessageAuto = async (text, retryCount = 0) => {
    if (!text || isClosed) return;
    setIsLoading(true);
    setProcessingStatus("processing");
    try {
      const data = await sendChatMessage({ userMessage: text, threadId });
      if (data.threadId) setThreadId(data.threadId);
      if (data.error) {
        // Si el error es por run activo, reintenta después de un delay (máx 3 intentos)
        if (data.error.includes("while a run") && retryCount < 3) {
          setTimeout(() => {
            sendMessageAuto(text, retryCount + 1);
          }, 3000); // espera 3 segundos y reintenta
          return;
        }
        setIsLoading(false);
        setProcessingStatus(null);
        setPendingFolderRequest(false);
        return;
      }
      if (data.response) {
        if (data.processingStatus) {
          setProcessingStatus(data.processingStatus);
        }
        // Si la respuesta incluye la URL de la carpeta y es cierre, mostrar mensaje de cierre
        const isClosing = CLOSING_REGEX.some((regex) =>
          regex.test(data.response)
        );
        if (isClosing && data.folderUrl) {
          setIsClosed(true);
          setPendingFolderRequest(false);
          await playAssistantAudio(data.response, messages.length);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.response,
              timestamp: data.timestamp || getRoundedTimestamp(),
            },
            {
              role: "system",
              content: `🔒 The conversation has ended. If you'd like to start a new one, please refresh the page.\n\n📁 A folder has been created in Google Drive with the conversation information: ${data.folderUrl}`,
              timestamp: getRoundedTimestamp(),
            },
          ]);
          setInputValue("");
          setIsLoading(false);
          setProcessingStatus(null);
          return;
        }
        // Si no es cierre, resetea el pendingFolderRequest
        if (!isClosing) setPendingFolderRequest(false);
        await playAssistantAudio(data.response, messages.length);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            timestamp: data.timestamp || getRoundedTimestamp(),
          },
        ]);
        playNotificationSound();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ There was an error processing your message. Please try again.",
          timestamp: getRoundedTimestamp(),
        },
      ]);
      setPendingFolderRequest(false);
    } finally {
      setIsLoading(false);
      setProcessingStatus(null);
    }
  };

  const updateProcessingStatus = (status) => {
    setProcessingStatus(status);
  };

  return {
    inputValue,
    setInputValue,
    messages,
    sendMessage,
    isLoading,
    isClosed,
    processingStatus,
    updateProcessingStatus,
    isAudioPlaying,
    audioMessageIdx,
    pauseAudio,
    playAssistantAudio,
    loadingAudioIdx,
    setMessages,
  };
};
