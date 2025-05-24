// Utilidades para llamar a los webhooks de acciones especiales

export async function sendCrmJsonData(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error in webhook (sendCrmJsonData):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error saving data to CRM: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Webhook result (sendCrmJsonData):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return `${result} - Now use the sendMailProposal tool to send the email, it is mandatory to do so.`;
  } catch (error) {
    console.error("❌ sendCrmJsonData:", error);
    throw error;
  }
}

export async function convertCurrency(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error in webhook (convertCurrency):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error converting currency: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Webhook result (convertCurrency):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return result;
  } catch (error) {
    console.error("❌ Unexpected error in convertCurrency:", error);
    throw error;
  }
}

export async function createCustomerFolder(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error in webhook (createCustomerFolder):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error creating folder: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Webhook result (createCustomerFolder):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return result;
  } catch (error) {
    console.error("❌ Unexpected error in createCustomerFolder:", error);
    throw error;
  }
}

export async function sendMailProposal(args, webhookUrl) {
  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!makeRes.ok) {
      const errorText = await makeRes.text();
      console.error("❌ Error en webhook (sendMailProposal):", {
        status: makeRes.status,
        statusText: makeRes.statusText,
        respuesta: errorText
      });
      throw new Error(`Error sending email: ${errorText}`);
    }
    const result = await makeRes.text();
    console.log("🔔 Webhook result (sendMailProposal):", {
      status: makeRes.status,
      statusText: makeRes.statusText,
      respuesta: result
    });
    return result;
  } catch (error) {
    console.error("❌ Unexpected error in sendMailProposal:", error);
    throw error;
  }
} 