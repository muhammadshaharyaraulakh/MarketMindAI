import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  InformationCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function AIAdvisorChat({ state, dispatch, portfolioStats, campaignStats }) {
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
- Best performing: Email Newsletter Nurture (22.38x ROAS)
- Needs attention: Snapchat Brand Viral (paused, 4.27x)

Answer questions about this data specifically. Be concise, data-driven, and actionable. Always reference specific campaign names and numbers from the data above.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [...messages, { role: 'user', parts: [{ text: textToSend }] }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const data = await response.json();
      const replyText = data.candidates[0].content.parts[0].text;

      dispatch({ type: 'ADD_CHAT_MESSAGE_V2', payload: { role: 'model', parts: [{ text: replyText }] } });
    } catch (error) {
      console.error(error);
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
    "Summarize this month's performance",
    "What's my best-performing audience segment?",
    "Generate a weekly report summary"
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

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* LEFT CHAT COLUMN */}
        <div className="w-full lg:w-[65%] flex flex-col bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-180px)] lg:h-auto min-h-[500px]">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFF1F0] border border-[#FF2D20]/20 rounded-xl flex items-center justify-center shrink-0">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#FF2D20]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] font-mona flex items-center gap-2">
                  AI Advisor
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </h3>
                <p className="text-[10px] font-semibold text-[#94A3B8]">Powered by Gemini + Campaign Data (RAG)</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
            {/* System Message */}
            <div className="flex justify-center mb-6">
              <div className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-xl text-[10px] font-semibold text-[#475569] shadow-sm max-w-sm text-center">
                I have access to your campaign data across Google, Meta, and Snapchat. Ask me anything about performance, optimization, or strategy.
              </div>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 shadow-sm text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#FF2D20] text-white rounded-xl rounded-tr-sm border border-[#FF2D20]' 
                    : 'bg-white text-[#0F172A] rounded-xl rounded-tl-sm border border-[#E2E8F0]'
                }`}>
                  {msg.parts[0].text}
                </div>
                <span className="text-[9px] font-bold text-[#94A3B8] mt-1.5 uppercase tracking-wide">
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
          <div className="bg-white border-t border-[#E2E8F0] p-4 shrink-0">
            {messages.length <= 2 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInputValue(s)}
                    className="shrink-0 bg-[#F8FAFC] hover:bg-[#FFF1F0] hover:text-[#FF2D20] hover:border-[#FF2D20]/30 border border-[#E2E8F0] text-[#475569] text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your campaigns..."
                rows={Math.min(3, Math.max(1, inputValue.split('\n').length))}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-4 pr-12 py-3 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF2D20] focus:ring-2 focus:ring-red-500/10 resize-none max-h-32"
              />
              <button 
                onClick={(e) => handleSendMessage(e)}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 w-8 h-8 bg-[#FF2D20] hover:bg-[#E5261A] text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <PaperAirplaneIcon className="w-4 h-4 stroke-2" />
              </button>
            </div>
            <div className="text-[9px] font-semibold text-[#94A3B8] text-center mt-2">
              Press Enter to send, Shift + Enter for new line.
            </div>
          </div>
        </div>

        {/* RIGHT CONTEXT COLUMN */}
        <div className="w-full lg:w-[35%] space-y-4 h-[calc(100vh-180px)] lg:h-auto overflow-y-auto no-scrollbar pb-10">
          <div className="flex items-center gap-2 mb-2">
            <InformationCircleIcon className="w-5 h-5 text-[#94A3B8]" />
            <h3 className="text-sm font-bold text-[#0F172A] font-mona">AI Context</h3>
          </div>

          {/* Section 1 - Campaigns in Context */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Campaigns in Context</span>
              <span className="text-[9px] font-bold bg-[#F8FAFC] text-[#475569] px-2 py-0.5 rounded border border-[#E2E8F0]">
                AI is analyzing {campaignStats.length} campaigns
              </span>
            </div>
            <div className="space-y-2">
              {campaignStats.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0F172A] truncate w-32 md:w-40">{c.name}</span>
                    <span className="text-[9px] font-bold text-[#94A3B8]">{c.platform}</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {c.roas}x ROAS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 - Quick Stats */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-3">Quick Stats</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                <span className="text-[9px] font-bold text-[#475569] uppercase block mb-0.5">Total Spend</span>
                <span className="text-sm font-bold text-[#0F172A]">${portfolioStats.totalSpend.toLocaleString()}/day</span>
              </div>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                <span className="text-[9px] font-bold text-[#475569] uppercase block mb-0.5">Blended ROAS</span>
                <span className="text-sm font-bold text-[#FF2D20]">{portfolioStats.roas}x</span>
              </div>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                <span className="text-[9px] font-bold text-[#475569] uppercase block mb-0.5">Active Campaigns</span>
                <span className="text-sm font-bold text-[#0F172A]">{campaignStats.length}</span>
              </div>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                <span className="text-[9px] font-bold text-[#475569] uppercase block mb-0.5">Total Ad Sets</span>
                <span className="text-sm font-bold text-[#0F172A]">{state.adSets.filter(a => !a.deletedAt).length}</span>
              </div>
            </div>
          </div>

          {/* Section 3 - Recent Alerts */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-3">Recent Alerts in Context</span>
            <div className="space-y-3">
              {alerts.slice(0, 2).map(a => (
                <div key={a.id} className="border-l-2 pl-3 border-[#FF2D20]">
                  <p className="text-[11px] font-bold text-[#0F172A] mb-0.5">{a.title}</p>
                  <p className="text-[10px] font-semibold text-[#475569] line-clamp-2">{a.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 - Vector DB Status */}
          <div className="bg-[#0F172A] border border-[#0F172A] rounded-xl p-5 shadow-sm text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#1E293B] rounded-full blur-xl opacity-50" />
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Vector DB Status</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Pinecone DB:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                  <span className="text-[10px] font-bold text-green-400">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Embeddings:</span>
                <span className="text-[10px] font-bold text-white">3,600 vectors indexed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Last sync:</span>
                <span className="text-[10px] font-bold text-white">2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
