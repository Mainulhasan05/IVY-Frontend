export const SendButton = ({ onClick, disabled }) => {
  return (
    <button
      className="w-9 h-9 flex items-center justify-center bg-blue-500 text-white rounded-full transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed ml-1"
      onClick={onClick}
      disabled={disabled}
      aria-label="Enviar mensaje"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-5 h-5"
      >
        <path 
          d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" 
        />
      </svg>
    </button>
  );
}; 