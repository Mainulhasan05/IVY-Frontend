// 1. Obtener o crear un thread
export async function getOrCreateThread(existingThreadId, api_key) {
  if (existingThreadId) {
    console.log("📎 Usando thread existente:", existingThreadId);
    return existingThreadId;
  }
  console.log("🔄 Creando nuevo thread...");
  const threadRes = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2"
    }
  });
  if (!threadRes.ok) {
    const text = await threadRes.text();
    throw new Error(`Error al crear thread: ${text}`);
  }
  const threadData = await threadRes.json();
  console.log("🧵 Thread creado exitosamente:", {
    threadId: threadData.id,
    status: threadRes.status,
    statusText: threadRes.statusText
  });
  return threadData.id;
}

// 2. Enviar mensaje al thread
export async function sendMessageToThread(threadId, userMessage, api_key) {
  // Polling para esperar a que no haya run activo
  let hasActiveRun = true;
  let maxTries = 15;
  let tries = 0;

  while (hasActiveRun && tries < maxTries) {
    // Consulta los runs activos del thread
    const runsRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });
    const runsData = await runsRes.json();
    // Busca si hay algún run activo
    hasActiveRun = runsData.data.some(run => run.status === "in_progress" || run.status === "queued");
    if (hasActiveRun) {
      await new Promise(res => setTimeout(res, 2000)); // espera 2 segundos
      tries++;
    }
  }

  if (hasActiveRun) {
    throw new Error('El sistema está tardando más de lo esperado. Por favor, intenta de nuevo en unos minutos.');
  }

  // Ahora sí, envía el mensaje
  console.log("📤 Enviando mensaje al thread...");
  const messageRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2"
    },
    body: JSON.stringify({ role: "user", content: userMessage })
  });
  if (!messageRes.ok) {
    const text = await messageRes.text();
    throw new Error(`Error al enviar mensaje al thread: ${text}`);
  }
  console.log("📨 Mensaje enviado:", {
    status: messageRes.status,
    statusText: messageRes.statusText,
    longitudMensaje: userMessage.length
  });
}

// 3. Iniciar y monitorear un run
export async function runAssistant(threadId, assistant_id, api_key) {
  console.log("🚀 Iniciando run con el assistant...");
  const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2"
    },
    body: JSON.stringify({
      assistant_id,
      tool_choice: "auto",
      tool_resources: {
        file_search: {
          vector_store_ids: [process.env.VECTOR_STORE_ID]
        }
      }
    })
  });
  if (!runRes.ok) {
    const text = await runRes.text();
    throw new Error(`Error al iniciar run: ${text}`);
  }
  const runData = await runRes.json();
  console.log("🔍 Run iniciado:", {
    runId: runData.id,
    status: runData.status,
    vectorStoreId: process.env.VECTOR_STORE_ID
  });

  let status = runData.status;
  const maxRetries = 3;
  const retryDelay = 5000;
  let retries = 0;
  let checkData = runData;

  while ((status === "in_progress" || status === "queued") && retries < maxRetries) {
    console.log(`⏳ Intento ${retries + 1}/${maxRetries}:`, {
      estado: status,
      timestamp: new Date().toISOString(),
      runId: runData.id
    });
    await new Promise(r => setTimeout(r, retryDelay));
    retries++;
    const checkRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runData.id}`, {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });
    checkData = await checkRes.json();
    status = checkData.status;
    console.log(`📊 Estado del run (intento ${retries}):`, {
      status,
      lastError: checkData.last_error,
      startedAt: checkData.started_at,
      completedAt: checkData.completed_at
    });
  }
  return checkData;
}

// 4. Obtener el último mensaje del asistente
export async function getLastAssistantMessage(threadId, api_key) {
  console.log("📥 Obteniendo mensajes del thread...");
  const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      Authorization: `Bearer ${api_key}`,
      "OpenAI-Beta": "assistants=v2"
    }
  });
  if (!messagesRes.ok) {
    const text = await messagesRes.text();
    throw new Error(`Error al obtener mensajes del thread: ${text}`);
  }
  const messagesData = await messagesRes.json();
  const lastAssistantMsg = messagesData.data
    .filter((m) => m.role === "assistant")
    .sort((a, b) => b.created_at - a.created_at)[0];
  return lastAssistantMsg;
}

// 5. Manejo centralizado de errores
export function handleErrorResponse(error, threadId) {
  console.error("❌ Ups, algo no salió como esperaba:", error);
  return new Response(JSON.stringify({
    error: "Lo siento, hubo un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?",
    detalles: error.message,
    threadId
  }), { status: 500 });
}

// 6. Polling de un run existente hasta que termine
export async function pollRunStatus(threadId, runId, api_key) {
  const maxRetries = 6;
  const retryDelay = 5000;
  let retries = 0;
  let status = "in_progress";
  let checkData = null;
  while ((status === "in_progress" || status === "queued") && retries < maxRetries) {
    console.log(`⏳ Polling run existente (intento ${retries + 1}/${maxRetries}):`, {
      estado: status,
      timestamp: new Date().toISOString(),
      runId
    });
    await new Promise(r => setTimeout(r, retryDelay));
    retries++;
    const checkRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });
    checkData = await checkRes.json();
    status = checkData.status;
    console.log(`📊 Estado del run (poll intento ${retries}):`, {
      status,
      lastError: checkData.last_error,
      startedAt: checkData.started_at,
      completedAt: checkData.completed_at
    });
  }
  return checkData;
} 

// 7. Función para obtener una marca de tiempo redondeada al minuto más cercano
export function getRoundedTimestamp() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString();
}

// 8. Función para manejar acciones pendientes
export async function handlePendingAction(threadId, action, pendingActions) {
  try {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        // Intentamos ejecutar la acción
        const result = await action();
        console.log(
          `✅ Acción completada en intento ${
            retryCount + 1
          } para thread ${threadId}`
        );
        return result;
      } catch (error) {
        lastError = error;
        retryCount++;

        if (error.message.includes("while a run is active")) {
          // Si es un error de run activo, esperamos exponencialmente más tiempo
          const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(
            `⏳ Esperando ${waitTime}ms antes del reintento ${
              retryCount + 1
            } para thread ${threadId}`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // Si es otro tipo de error, lo propagamos
        throw error;
      }
    }

    // Si llegamos aquí, todos los reintentos fallaron
    throw new Error(
      `No se pudo completar la acción después de ${maxRetries} intentos: ${lastError.message}`
    );
  } finally {
    // Limpiamos la acción pendiente
    pendingActions.delete(threadId);
  }
}
