export const TypingIndicator = () => {
  return (
    <div className="w-full flex flex-col items-start">
      <div className="p-4 my-2 rounded-lg inline-block max-w-[80%] bg-gray-100 rounded-tr-lg rounded-tl-lg rounded-br-lg ml-2 relative">
        <div className="absolute w-4 h-4 bg-gray-100 left-[-8px] bottom-[5px] transform rotate-45"></div>
        <div className="flex space-x-2 items-center">
          <div className="text-gray-600">Está escribiendo</div>
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 