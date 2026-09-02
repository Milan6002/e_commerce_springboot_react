import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const AiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hi! I'm your Personal Shopping Assistant. How can I help you find the perfect bag today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setIsTyping(true);

        try {
            const response = await axios.post("https://e-commerce-springboot-react-8i4i.onrender.com/api/ai/chat", { message: userMessage });
            setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I am having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Very basic markdown parser to handle **bold** text securely without external libraries
    const renderMessageText = (text) => {
        if (!text) return null;
        
        const parts = text.split(/(\*\*.*?\*\*)/g);
        
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="fixed bottom-0 right-0 z-5" style={{ margin: '2rem' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white border-round-xl shadow-6 flex flex-column overflow-hidden mb-3"
                        style={{ width: '350px', height: '450px' }}
                    >
                        {/* Header */}
                        <div className="bg-primary p-3 flex justify-content-between align-items-center">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-sparkles text-xl"></i>
                                <h3 className="m-0 text-white font-semibold">AI Assistant</h3>
                            </div>
                            <Button icon="pi pi-times" rounded text className="text-white hover:bg-white-alpha-20 w-2rem h-2rem" onClick={() => setIsOpen(false)} />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow-1 p-3 overflow-y-auto surface-50 flex flex-column gap-3">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div 
                                        className={`p-2 border-round-2xl max-w-22rem line-height-3 shadow-1 ${msg.sender === 'user' ? 'bg-primary text-white border-noround-br' : 'bg-white text-700 border-noround-bl'}`}
                                        style={{ fontSize: '0.95rem' }}
                                    >
                                        {msg.sender === 'user' ? msg.text : renderMessageText(msg.text)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-content-start">
                                    <div className="bg-white p-2 border-round-2xl border-noround-bl shadow-1 flex gap-1 align-items-center" style={{ width: '60px', height: '40px' }}>
                                        <div className="w-1rem h-1rem border-circle bg-primary-300 animation-iteration-infinite animation-duration-1000 fadein" />
                                        <div className="w-1rem h-1rem border-circle bg-primary-400 animation-iteration-infinite animation-duration-1000 fadein" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1rem h-1rem border-circle bg-primary-500 animation-iteration-infinite animation-duration-1000 fadein" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-2 bg-white border-top-1 surface-border">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <InputText 
                                    className="flex-grow-1 border-round-3xl" 
                                    placeholder="Type a message..." 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoComplete="off"
                                />
                                <Button 
                                    type="submit"
                                    icon="pi pi-send" 
                                    rounded 
                                    disabled={!input.trim() || isTyping}
                                    className="p-button-primary"
                                />
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex justify-content-end"
                >
                    <Button 
                        icon="pi pi-comment" 
                        size="large"
                        rounded 
                        className="shadow-6 p-button-primary w-4rem h-4rem" 
                        onClick={() => setIsOpen(true)}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default AiChatbot;
