import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  InformationCircleIcon,
  KeyIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

export default function AIAdvisorChat({ state, dispatch, portfolioStats, campaignStats }) {
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [tempKeyInput, setTempKeyInput] = useState('');
  const chatEndRef = useRef(null);

  const { messages, isLoading, geminiApiKey } = state.chat;
  const { alerts } = state.insights;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (location.state?.autoSend) {
      // Auto-populate the input or send immediately
      setInputValue(location.state.autoSend);
      // Remove the state so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSaveKey = () => {
    dispatch({ type: 'SET_GEMINI_KEY', payload: tempKeyInput });
  };

  const handleSendMessage = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isLoading) return;

    if (!geminiApiKey) {
      alert("Please configure your Gemini API Key first.");
      return;
    }

    setInputValue('');
    dispatch({ type: 'ADD_CHAT_MESSAGE_V2', payload: { role: 'user', parts: [{ text: textToSend }] } });
    dispatch({ type: 'SET_CHAT_LOADING', payload: true });

    try {
      const activeCampaignsContext = campaignStats.map(c => ({
        name: c.name,
        platform: c.platform,
        status: c.status,
        roas: c.roas,
        spend: c.totalSpend,
        revenue: c.totalRevenue
      }));

      const adSetsContext = state.adSets.filter(a => !a.deletedAt).map(a => ({
        name: a.name,
        campaignId: a.campaignId,
        platform: a.platform,
        status: a.status,
        budget: a.budget,
        spendToday: a.spendToday
      }));

      const systemPrompt = `You are MarketMind AI Advisor, an expert digital marketing analyst. You have access to the following live campaign data:

ACTIVE CAMPAIGNS:
${JSON.stringify(activeCampaignsContext, null, 2)}

AD SETS DATA:
${JSON.stringify(adSetsContext, null, 2)}

ANALYTICS SUMMARY:
- Total daily spend: $${portfolioStats.totalSpend}
- Blended ROAS: ${portfolioStats.roas}x
- Best performing: Meta Retargeting Q2 (22.38x ROAS)
- Needs attention: Snapchat Brand Viral (paused, 4.27x)

Answer questions about this data specifically. Be concise, data-driven, and actionable. Always reference specific campaign names and numbers from the data above.`;

      // The Gemini API strictly requires the conversation to start with a 'user' role.
      // We must strip out the initial 'model' greeting from the UI state before sending.
      const apiMessages = messages.filter((m, idx) => !(idx === 0 && m.role === 'model'));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [...apiMessages, { role: 'user', parts: [{ text: textToSend }] }]
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Gemini API Error Payload:", errData);
        throw new Error(errData.error?.message || 'API Request Failed');
      }

      const data = await response.json();
      const replyText = data.candidates[0].content.parts[0].text;

      dispatch({ type: 'ADD_CHAT_MESSAGE_V2', payload: { role: 'model', parts: [{ text: replyText }] } });
    } catch (error) {
      console.error("Chat API Error:", error);
      dispatch({ type: 'ADD_CHAT_MESSAGE_V2', payload: { role: 'model', parts: [{ text: `Error connecting to Gemini: ${error.message}` }] } });
    } finally {
      dispatch({ type: 'SET_CHAT_LOADING', payload: false });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "Why did my ROAS drop last week?",
    "Which campaign should I pause?",
    "Summarize this month's performance"
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      {!geminiApiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KeyIcon className="w-5 h-5 text-yellow-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-yellow-900">API Key Required</p>
              <p className="text-[10px] font-semibold text-yellow-700 mt-0.5">Please provide your Gemini API key to enable live AI responses.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="password" 
              placeholder="AIzaSy..."
              value={tempKeyInput}
              onChange={(e) => setTempKeyInput(e.target.value)}
              className="px-3 py-1.5 border border-yellow-300 rounded-lg text-xs font-mono w-full sm:w-64 focus:outline-none focus:border-yellow-500 bg-white"
            />
            <button onClick={handleSaveKey} className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm whitespace-nowrap">
              Save Key
            </button>
          </div>
        </div>
      )}

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
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6 bg-transparent no-scrollbar">
            {/* System Message */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#E2E8F0]/50 border border-[#CBD5E1]/50 px-5 py-2.5 rounded-full text-xs font-medium text-[#475569] max-w-md text-center flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4 text-[#94A3B8]" />
                I have full access to your campaign data. Ask me anything.
              </div>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-fadeIn`}>
                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF2D20] to-[#E5261A] shadow-sm flex items-center justify-center shrink-0 mt-1">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`px-5 py-3.5 shadow-sm text-[14px] font-medium leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-[#0F172A] text-white rounded-2xl rounded-tr-sm border border-[#0F172A]' 
                      : 'bg-white text-[#1E293B] rounded-2xl rounded-tl-sm border border-[#E2E8F0]'
                  }`}>
                    {msg.parts[0].text}
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
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-5 pr-16 py-4 text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D20] focus:ring-4 focus:ring-red-500/10 resize-none max-h-40 shadow-sm"
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
    </motion.div>
  );
}
