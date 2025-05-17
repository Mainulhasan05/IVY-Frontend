import { useChat } from "src/hooks/useChat";
import ClientForm from "./ClientForm"; // Ajusta la ruta según tu estructura

export default function ChatPage() {
  const {
    showForm,
    clientData,
    handleClientFieldChange,
    missingFields,
    isLoading,
    sendClientForm,
    CLIENT_FIELDS,
    // ...otros estados y funciones del chat
  } = useChat();

  return (
    <div>
      {showForm ? (
        <ClientForm
          clientData={clientData}
          handleClientFieldChange={handleClientFieldChange}
          missingFields={missingFields}
          isLoading={isLoading}
          sendClientForm={sendClientForm}
          CLIENT_FIELDS={CLIENT_FIELDS}
        />
      ) : (
        // Aquí va tu componente de chat normal
        <ChatComponent />
      )}
    </div>
  );
}