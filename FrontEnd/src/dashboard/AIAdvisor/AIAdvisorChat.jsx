import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  InformationCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  ClockIcon,
  XMarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AIAdvisorChat({ state, dispatch, portfolioStats, campaignStats }) {
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historySessions, setHistorySessions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const chatEndRef = useRef(null);
  const autoSentRef = useRef(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (location.state?.autoSend && !autoSentRef.current) {
      autoSentRef.current = true;
      handleSendMessage(null, location.state.autoSend);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.autoSend]);

  const handleSendMessage = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isLoading) return;

    setInputValue('');
    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chatbot/send', {
        message: textToSend,
        session_id: sessionId
      });

      if (response.data.success) {
        setSessionId(response.data.session_id);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.message.content
        }]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error connecting to AI Advisor: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadHistory = async () => {
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);
    try {
      const res = await axios.get('/api/chatbot/sessions');
      if(res.data.success) {
        setHistorySessions(res.data.sessions);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const restoreSession = async (id) => {
    setIsHistoryModalOpen(false);
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/chatbot/sessions/${id}/messages`);
      if(res.data.success) {
        setSessionId(id);
        const formatted = res.data.messages.map(m => ({
          role: m.role,
          content: m.content
        }));
        setMessages(formatted);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setInputValue('');
  };

  const suggestions = [
    "Why did my ROAS drop last week?",
    "Which campaign should I pause?",
    "Summarize this month's performance"
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px] w-full">
        {/* FULL WIDTH NATIVE CHAT CONTAINER */}
        <div className="w-full flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-100px)] min-h-[600px]">
          {/* Chat Header */}
          <div className="px-4 py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50 to-transparent rounded-full opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF2D20] to-[#E5261A] shadow-md rounded-2xl flex items-center justify-center shrink-0">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] font-mona flex items-center gap-2">
                  MarketMind AI
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </h3>
                <p className="text-xs font-medium text-[#64748B]">Connected to live campaign RAG • Context loaded</p>
              </div>
            </div>
            <div className="flex gap-3 relative z-10">
              {messages.length > 0 && (
                <button onClick={startNewChat} className="px-4 py-2 text-xs font-medium cursor-pointer bg-white/60 hover:bg-white border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition-colors shadow-sm">
                  New Chat
                </button>
              )}
              <button onClick={loadHistory} className="px-4 py-2 text-xs font-medium cursor-pointer bg-white/60 hover:bg-white border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#FF2D20] transition-colors shadow-sm">
                History
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6 bg-transparent no-scrollbar">

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-fadeIn`}>
                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF2D20] to-[#E5261A] shadow-sm flex items-center justify-center shrink-0 mt-1">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`px-5 py-3.5 shadow-sm text-[14px] font-medium leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-[#0F172A] text-white rounded-2xl rounded-tr-sm border border-[#0F172A]' 
                      : 'bg-white text-[#1E293B] rounded-2xl rounded-tl-sm border border-[#E2E8F0]'
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#94A3B8] mt-2 uppercase tracking-wide px-11">
                  {msg.role === 'user' ? 'You' : 'MarketMind AI'}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white text-[#0F172A] px-4 py-3 rounded-xl rounded-tl-sm border border-[#E2E8F0] shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="bg-transparent px-4 md:px-12 py-6 pb-8 shrink-0">
            {messages.length <= 2 && (
              <div className="flex justify-center gap-3 flex-wrap mb-6 max-w-4xl mx-auto">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInputValue(s)}
                    className="bg-white hover:bg-[#FFF1F0] hover:text-[#FF2D20] hover:border-[#FF2D20]/30 border border-[#E2E8F0] text-[#475569] text-xs font-medium px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm flex items-center gap-2"
                  >
                    <LightBulbIcon className="w-4 h-4 text-[#FF2D20]/70 group-hover:text-[#FF2D20]" />
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-center max-w-5xl mx-auto">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MarketMind AI anything about your campaigns..."
                rows={Math.min(4, Math.max(1, inputValue.split('\n').length))}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-5 pr-16 py-4 text-sm font-light text-[#0F172A] focus:outline-none focus:border-[#FF2D20] focus:ring-4 focus:ring-red-500/10 resize-none overflow-hidden max-h-40 shadow-sm"
              />
              <button 
                onClick={(e) => handleSendMessage(e)}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FF2D20] hover:bg-[#E5261A] text-white rounded-xl flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
              >
                <PaperAirplaneIcon className="w-5 h-5 stroke-2 -ml-0.5" />
              </button>
            </div>
            <div className="text-[10px] font-medium text-[#94A3B8] text-center mt-3 max-w-5xl mx-auto">
              MarketMind AI can make mistakes. Consider verifying important metrics against your dashboard. Press Enter to send, Shift + Enter for new line.
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsHistoryModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <h3 className="font-bold text-[#0F172A]">
                  Chat History
                </h3>
                <button onClick={() => setIsHistoryModalOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-32">
                    <span className="w-6 h-6 border-2 border-[#FF2D20] border-t-transparent rounded-full animate-spin"></span>
                  </div>
                ) : historySessions.length === 0 ? (
                  <p className="text-center text-[#64748B] py-8 text-sm">No previous conversations found.</p>
                ) : (
                  <div className="space-y-3">
                    {historySessions.map(session => (
                      <button 
                        key={session.id}
                        onClick={() => restoreSession(session.id)}
                        className="w-full text-left p-4 rounded-xl border border-[#E2E8F0] hover:border-[#FF2D20]/50 hover:bg-[#FFF1F0]/50 transition-colors group flex justify-between items-center cursor-pointer"
                      >
                        <div>
                          <h4 className="font-semibold text-sm text-[#1E293B] group-hover:text-[#FF2D20] transition-colors">{session.title}</h4>
                          <p className="text-xs text-[#94A3B8] mt-1">{new Date(session.updated_at).toLocaleDateString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
