import { TypingIndicator } from "./TypingIndicator";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

// Función para reemplazar palabras clave por emojis
function replaceEmojis(text) {
  return text
    .replace(/:check:/g, "✅")
    .replace(/:star:/g, "⭐")
    .replace(/:warning:/g, "⚠️")
    .replace(/:info:/g, "ℹ️");
}

// Renderiza el mensaje del asistente con Markdown y emojis
function renderAssistantMessage(msg) {
  const msgWithEmojis = replaceEmojis(msg);
  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors"
          >
            🔗 haz clic aquí
          </a>
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold">{props.children}</strong>
        ),
        em: ({ node, ...props }) => (
          <em className="italic">{props.children}</em>
        ),
        li: ({ node, ...props }) => (
          <li className="ml-4 list-disc">{props.children}</li>
        ),
      }}
    >
      {msgWithEmojis}
    </ReactMarkdown>
  );
}

function transformarListaADatosEnLinea(msg) {
  // Si ya contiene una lista Markdown o numerada, no transformes nada
  if (/^\s*[-*]\s|^\s*\d+\.\s/m.test(msg)) {
    return msg;
  }
  // Detecta bloques de lista numerada de campos en negrita (sin enlaces)
  // Solo transforma si el bloque de lista está seguido de una línea vacía o texto, pero no si hay un enlace Markdown en la misma línea
  const regex = /((?:\d+\.\s*\*\*.*?\*\*:?.*?\n?)+)(?!\[.*?\]\(.*?\))/g;
  let match;
  const campos = [];
  let hayLista = false;
  // Extrae solo la lista numerada de campos en negrita
  const listaRegex = /\d+\.\s*\*\*(.*?)\*\*:?(.*)?\n?/g;
  let listaMatch;
  const camposSet = new Set();
  while ((listaMatch = listaRegex.exec(msg)) !== null) {
    hayLista = true;
    const campo = `**${listaMatch[1].trim()}**`;
    const explicacion = listaMatch[2]?.trim();
    // Evita repeticiones exactas
    const claveUnica = campo + (explicacion ? ": " + explicacion : "");
    if (!camposSet.has(claveUnica)) {
      camposSet.add(claveUnica);
      if (explicacion) {
        campos.push(`${campo}: ${explicacion}`);
      } else {
        campos.push(campo);
      }
    }
  }
  if (hayLista && campos.length > 0) {
    // Muestra los campos como una lista de ítems Markdown
    return msg.replace(
      /(?:\d+\.\s*\*\*.*?\*\*:?.*?\n?)+/g,
      `Por favor, proporciona los siguientes datos:\n${campos
        .map((c) => `- ${c}`)
        .join("\n")}`
    );
  }
  return msg;
}

export const ChatMessages = ({
  messages,
  chatRef,
  isLoading,
  isAudioPlaying,
  audioMessageIdx,
  pauseAudio,
  playAssistantAudio,
  loadingAudioIdx,
}) => {
  const [localTimes, setLocalTimes] = useState([]);
  const [audioError, setAudioError] = useState(null);

  useEffect(() => {
    setLocalTimes(
      messages.map((msg) => {
        if (!msg.timestamp) return "";
        const date = new Date(msg.timestamp);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      })
    );
  }, [messages]);

  const handlePlayAudio = async (content, idx) => {
    try {
      setAudioError(null);
      await playAssistantAudio(content, idx);
    } catch (error) {
      if (error.message.includes("interacción del usuario")) {
        setAudioError(
          "Haz clic en el botón de reproducción para escuchar el audio"
        );
      } else {
        setAudioError("Error al reproducir el audio. Intenta nuevamente.");
      }
    }
  };

  return (
    <div ref={chatRef} className="flex-grow overflow-y-auto p-4 text-black">
      {messages.map((msg, i) => {
        if (msg?.sender) {
          if (msg.sender == "client") {
            msg.role = "user";
          } else {
            msg.role = "assistant";
          }
        }

        if (!msg.timestamp) {
          msg.timestamp = msg.createdAt;
        }

        const isAssistant = msg.role === "assistant";
        const isPlaying =
          isAssistant && isAudioPlaying && audioMessageIdx === i;
        const isLoadingAudio = isAssistant && loadingAudioIdx === i;
        return (
          <div
            key={i}
            className={`w-full flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`px-3 text-xs font-medium ${
                msg.role === "user" ? "text-blue-600" : "text-green-600"
              }`}
            >
              {msg.role === "user" ? "Tú" : "IVY Asistente"}
            </div>

            <div
              className={`p-4 my-1 rounded-lg whitespace-pre-wrap inline-block max-w-[80%] shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-100 rounded-tl-lg rounded-tr-lg rounded-bl-lg mr-2 border-t border-r border-blue-200"
                  : "bg-gray-100 rounded-tr-lg rounded-tl-lg rounded-br-lg ml-2 border-t border-l border-gray-200"
              }`}
            >
              {msg.role === "user"
                ? msg.content
                : renderAssistantMessage(
                    transformarListaADatosEnLinea(msg.content)
                  )}
              {isAssistant && (
                <div className="flex items-center gap-2 mt-2">
                  {isPlaying ? (
                    <>
                      {/* Icono de onda animada */}
                      <span className="flex items-center">
                        <span className="h-4 w-1 bg-blue-500 mr-0.5 animate-wave1" />
                        <span className="h-3 w-1 bg-blue-400 mr-0.5 animate-wave2" />
                        <span className="h-2 w-1 bg-blue-300 animate-wave3" />
                      </span>
                      <button
                        onClick={pauseAudio}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-100 transition-colors"
                        title="Pausar audio"
                      >
                        {/* Icono de pausa */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      </button>
                      <span className="text-xs text-blue-600">
                        Reproduciendo audio...
                      </span>
                    </>
                  ) : isLoadingAudio ? (
                    // Preloader/spinner
                    <span className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-600"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePlayAudio(msg.content, i)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-100 transition-colors"
                      title="Reproducir audio"
                    >
                      {/* Icono de play */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  )}
                  {audioError && audioMessageIdx === i && (
                    <span className="text-xs text-red-500 ml-2">
                      {audioError}
                    </span>
                  )}
                </div>
              )}
            </div>
            {msg.timestamp && (
              <small className="text-xs text-gray-500 mt-1 px-3">
                {typeof window === "undefined"
                  ? new Date(msg.timestamp).toISOString().slice(11, 16)
                  : localTimes[i]}
              </small>
            )}
          </div>
        );
      })}

      {isLoading && <TypingIndicator />}
      {/* Animaciones de onda para el indicador de audio */}
      <style jsx>{`
        @keyframes wave1 {
          0%,
          100% {
            height: 1rem;
          }
          50% {
            height: 1.5rem;
          }
        }
        @keyframes wave2 {
          0%,
          100% {
            height: 0.75rem;
          }
          50% {
            height: 1.25rem;
          }
        }
        @keyframes wave3 {
          0%,
          100% {
            height: 0.5rem;
          }
          50% {
            height: 1rem;
          }
        }
        .animate-wave1 {
          animation: wave1 1s infinite;
        }
        .animate-wave2 {
          animation: wave2 1s infinite;
        }
        .animate-wave3 {
          animation: wave3 1s infinite;
        }
      `}</style>
    </div>
  );
};
