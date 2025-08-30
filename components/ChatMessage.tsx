
import React from 'react';
import { ChatMessage, Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const isSystem = message.role === Role.SYSTEM;

  const textContent = message.parts.find(p => p.text)?.text || '';
  const imageContent = message.parts.find(p => p.imageUrl)?.imageUrl;

  if (isSystem) {
    return (
      <div className="text-center text-sm text-red-400 py-2">
        {textContent}
      </div>
    )
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-lg`}>
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
          {imageContent && (
            <img src={imageContent} alt="user upload" className="rounded-lg mb-2 max-w-xs" />
          )}
          {textContent && <p className="text-white whitespace-pre-wrap">{textContent}</p>}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>

       {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessageComponent;
