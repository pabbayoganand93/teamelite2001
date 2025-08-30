import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Role } from '../types';
import { generateContent } from '../services/geminiService';
import ChatMessageComponent from './ChatMessage';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { XCircleIcon } from './icons/XCircleIcon';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Fix: Wrapped removeImage in useCallback to ensure it has a stable identity across re-renders.
  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!userInput.trim() && !imageFile) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      role: Role.USER,
      parts: [
        { text: userInput },
        ...(imagePreview ? [{ imageUrl: imagePreview }] : [])
      ],
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const responseText = await generateContent(userInput, imageFile || undefined);
      const modelMessage: ChatMessage = {
        role: Role.MODEL,
        parts: [{ text: responseText }],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, modelMessage]);
    // Fix: Changed `catch (err: any)` to a more type-safe `catch (err)` and added a type guard. This resolves the parsing issue causing "Cannot find name 'err'".
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
       const systemMessage: ChatMessage = {
        role: Role.SYSTEM,
        parts: [{ text: `Error: ${errorMessage}` }],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, systemMessage]);
    } finally {
      setIsLoading(false);
      setUserInput('');
      removeImage();
    }
  // Fix: Added `removeImage` to the dependency array to satisfy exhaustive-deps and prevent stale closures, which resolves the 'Cannot find name' errors.
  }, [userInput, imageFile, imagePreview, removeImage]);

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
  };

  const suggestions = [
      "Describe this image",
      "Translate 'Hello, world!' to French",
      "Write a short poem about the ocean"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mb-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-200">Start a conversation</h2>
                <p className="mt-2">Upload an image, ask a question, or try a suggestion.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => handleSuggestionClick(s)} className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">{s}</button>
                    ))}
                </div>
            </div>
        )}
        {messages.map((msg, index) => (
          <ChatMessageComponent key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length-1].role === Role.USER && (
          <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  {/* AI Icon here */}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700 p-4">
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {imagePreview && (
          <div className="relative w-24 h-24 mb-2 rounded-lg overflow-hidden border border-gray-600">
            <img src={imagePreview} alt="upload preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-0.5 hover:bg-gray-800"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message or upload an image..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!userInput.trim() && !imageFile)}
            className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;