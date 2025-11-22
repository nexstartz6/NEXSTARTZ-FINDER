import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Message } from '../types';

const CHAT_MODEL = 'gemini-3-pro-preview';

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am your supply chain assistant. How can I help you discover manufacturers or suppliers today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat
  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: CHAT_MODEL,
      config: {
        systemInstruction: "You are a helpful, professional AI assistant for a B2B supply chain app. Focus on business, manufacturing, retail, and wholesale topics.",
      }
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of response) {
        // @ts-ignore - SDK typing quirk for stream chunks
        const text = chunk.text || ''; 
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'system', 
        text: 'Sorry, I encountered an error processing your request.', 
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
       <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
         {messages.map((msg) => (
           <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
               ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-gold-500 text-slate-900'}`}>
               {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
             </div>
             
             <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-md
               ${msg.role === 'user' 
                 ? 'bg-slate-200 text-slate-800 rounded-tr-none' 
                 : msg.isError 
                   ? 'bg-red-100 text-red-700 border border-red-200'
                   : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
               {msg.text}
             </div>
           </div>
         ))}
         {isTyping && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-gold-500 text-slate-900 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
             </div>
             <div className="bg-white text-slate-500 p-3 rounded-2xl rounded-tl-none text-xs italic border border-slate-200">
                Thinking...
             </div>
           </div>
         )}
         <div ref={messagesEndRef} />
       </div>

       <div className="p-2 sm:p-4 bg-white/50 backdrop-blur-sm border-t border-slate-200">
         <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 max-w-3xl mx-auto">
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask about market trends, supplier verification..."
             className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all text-slate-900 placeholder:text-slate-500"
           />
           <button 
             type="submit" 
             disabled={!input.trim() || isTyping}
             className="bg-gold-500 text-slate-900 p-2 sm:p-3 rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50"
           >
             <Send className="w-5 h-5" />
           </button>
         </form>
       </div>
    </div>
  );
};