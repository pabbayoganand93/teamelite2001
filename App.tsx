
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full h-full max-w-4xl flex flex-col bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden" style={{height: 'calc(100vh - 2rem)'}}>
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-100">Gemini Multimodal Chat</h1>
          </div>
          <p className="text-sm text-gray-400">Powered by Gemini 1.5 Flash</p>
        </header>
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;
