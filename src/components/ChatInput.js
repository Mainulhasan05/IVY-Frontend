import { SendButton } from './SendButton';
import useSpeechToText from '../hooks/useSpeechToText';

export const ChatInput = ({ inputValue, setInputValue, onSendMessage, isProcessing, pauseAudio, onOpenCallModal }) => {
  const { isListening, startListening: baseStartListening, stopListening, tempText } = useSpeechToText({
    onResult: (text) => setInputValue(prev => (prev ? prev + ' ' : '') + text)
  });

  // Envolver startListening para pausar el audio antes de grabar
  const startListening = () => {
    if (pauseAudio) pauseAudio();
    baseStartListening();
  };

  return (
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors
          ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-blue-500 text-white hover:bg-blue-600'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
        aria-label={isListening ? 'Stop microphone' : 'Talk'}
        title={isListening ? 'Stop microphone' : 'Talk'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21a1 1 0 1 1-2 0v-2.08A7 7 0 0 1 5 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onOpenCallModal}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors
          bg-green-500 text-white hover:bg-green-600
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
        aria-label="Start call"
        title="Start call"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM21 6h-3V3h-2v3h-3v2h3v3h2V8h3z" />
        </svg>
      </button>

      <textarea
        placeholder={isListening ? "Listening..." : "Write your message..."}
        className={`flex-1 min-h-[48px] max-h-40 p-3 text-base bg-white text-black border
          ${isListening ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'}
          rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
        value={isListening && tempText ? (inputValue ? inputValue + ' ' + tempText : tempText) : inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        disabled={isProcessing}
      />
      <SendButton 
        onClick={onSendMessage} 
        disabled={isProcessing || isListening} 
      />
    </div>
  );
}; 