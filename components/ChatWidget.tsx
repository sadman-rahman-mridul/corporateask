import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'স্বাগতম Corporate Ask এ! কিভাবে আপনাকে সাহায্য করতে পারি?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([...messages, { type: 'user', text: inputText }]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'ধন্যবাদ আপনার মেসেজের জন্য। আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 mb-4"
          >
            {/* Header */}
            <div className="bg-brand-red p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare size={18} />
                 </div>
                 <div>
                    <h3 className="font-bold text-sm">Corporate Ask Support</h3>
                    <p className="text-xs text-red-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.type === 'user' 
                      ? 'bg-brand-red text-white self-end rounded-br-none' 
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100 self-start rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-brand-red"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                type="submit"
                className="w-9 h-9 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-brand-redHover transition"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-red text-white rounded-full shadow-lg shadow-red-500/40 flex items-center justify-center transition-colors hover:bg-brand-redHover"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;