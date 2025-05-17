// Utilidades para llamar a los webhooks de acciones especiales

export async function enviarDatosCrmJson(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error en webhook (enviarDatosCrmJson):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error al guardar datos en CRM: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Resultado del webhook (enviarDatosCrmJson):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return `${result} - Ahora usa la herramienta enviarCorreoPropuesta para enviar el correo , es obligatorio hacerlo`;
  } catch (error) {
    console.error("❌ enviarDatosCrmJson:", error);
    throw error;
  }
}

export async function convertirMoneda(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error en webhook (convertirMoneda):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error al convertir moneda: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Resultado del webhook (convertirMoneda):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return result;
  } catch (error) {
    console.error("❌ Error inesperado en convertirMoneda:", error);
    throw error;
  }
}

export async function crearCarpetaCliente(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error en webhook (crearCarpetaCliente):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error al crear carpeta: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Resultado del webhook (crearCarpetaCliente):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return result;
  } catch (error) {
    console.error("❌ Error inesperado en crearCarpetaCliente:", error);
    throw error;
  }
}

export async function enviarCorreoPropuesta(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error en webhook (enviarCorreoPropuesta):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error al enviar correo: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Resultado del webhook (enviarCorreoPropuesta):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return result;
  } catch (error) {
    console.error("❌ Error inesperado en enviarCorreoPropuesta:", error);
    throw error;
  }
} 