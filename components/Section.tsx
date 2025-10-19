import React, { useState, useEffect, useRef } from 'react';
import { Vip } from '../constants';
import { UserIcon, BotIcon, SendIcon } from './Icon';


// --- CHAT MESSAGE COMPONENT ---
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatMessage: React.FC<Message> = ({ sender, text }) => {
  const isUser = sender === 'user';

  if (sender === 'bot' && text === 'Thinking...') {
    return (
       <div className={`flex items-start gap-3 my-4`}>
        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
          <BotIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
          <div className="flex items-center justify-center space-x-1 h-6">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
          <BotIcon className="w-6 h-6 text-cyan-400" />
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-cyan-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
       {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};


// --- CHAT INPUT COMPONENT ---
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 rounded-b-lg">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name, e.g., 'Ravi Singh MP'..."
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-full py-3 pl-5 pr-14 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-60"
            disabled={isProcessing}
            autoFocus
          />
          <button
            type="submit"
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            disabled={isProcessing || !inputValue.trim()}
          >
            <SendIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};


// --- CHAT INTERFACE COMPONENT ---
function normalizeString(str: string): string {
  if (!str) return '';
  const honorifics = ['mr', 'ms', 'mrs', 'shri', 'dr'];
  let normalized = str.toLowerCase().trim().replace(/[.,]/g, '');
  const words = normalized.split(/\s+/);
  const filteredWords = words.filter(word => !honorifics.includes(word));
  return filteredWords.join(' ');
}

function levenshteinDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function fuzzyMatchScore(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  return (longer.length - levenshteinDistance(longer, shorter)) / longer.length;
}

interface ChatInterfaceProps {
  vips: Vip[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ vips }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I am the VIP Registry Assistant. How can I help you today? \n\nPlease ask me about a VIP by name.' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isProcessing]);

  const handleSendMessage = (userInput: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setIsProcessing(true);

    setTimeout(() => {
        const normalizedQuery = normalizeString(userInput);
        const results = vips
            .map(vip => ({ ...vip, score: fuzzyMatchScore(normalizedQuery, normalizeString(vip.Full_Name)) }))
            .filter(vip => vip.score > 0.4)
            .sort((a, b) => b.score - a.score);

        let botReply = "I'm sorry, I couldn't find a record matching that name. Please try again with a different spelling or more details.";

        if (results.length > 0) {
            const bestMatch = results[0];
            if (bestMatch.Received === 'Yes') {
                const noteInfo = bestMatch.Notes ? ` We last noted contact during: "${bestMatch.Notes}"` : "";
                botReply = `Yes, we've connected with ${bestMatch.Full_Name} (${bestMatch.Position}, ${bestMatch.State}). Our records show they received the book "${bestMatch.Book_Title}" on ${bestMatch.Date_Received}.${noteInfo}`;
            } else {
                botReply = `Based on our records, we haven't yet provided any documents to ${bestMatch.Full_Name} (${bestMatch.Position}, ${bestMatch.State}).`;
            }
        }
        
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        <header className="p-4 bg-gray-900/50 border-b border-gray-700 text-center rounded-t-lg">
            <h1 className="text-xl font-bold text-white">VIP Registry Assistant</h1>
        </header>
        <main className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
                <ChatMessage key={index} sender={msg.sender} text={msg.text} />
            ))}
            {isProcessing && <ChatMessage sender="bot" text="Thinking..." />}
            <div ref={messagesEndRef} />
        </main>
        <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
    </div>
  );
};


// --- MAIN USER VIEW COMPONENT ---
interface UserViewProps {
  vips: Vip[];
  onAdminLoginClick: () => void;
}

export const UserView: React.FC<UserViewProps> = ({ vips, onAdminLoginClick }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans flex justify-center items-center p-4 relative">
      <ChatInterface vips={vips} />
      <button 
        onClick={onAdminLoginClick}
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Admin Login
      </button>
    </div>
  );
};
