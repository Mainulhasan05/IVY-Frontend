export const ChatHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center shadow-md">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-md">
        <span className="text-blue-600 font-bold text-lg">IV</span>
      </div>
      <div>
        <h1 className="font-bold text-lg">Ivy Assistant</h1>
        <p className="text-xs text-blue-100">Your smart virtual assistant</p>
      </div>
    </div>
  );
}; 