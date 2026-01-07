import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, SendHorizonal, Loader2, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// TODO: Replace with your Make.com webhook URL
const WEBHOOK_URL = 'https://hook.eu1.make.com/d7p51kbr34g7rz7v1nijj3mn2wvq486b';

const MAX_MESSAGES = 5;
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Perguntas recorrentes
const QUICK_QUESTIONS = [
  'Onde são os treinos?',
  'Como posso inscrever o meu filho?',
  'Quem são os treinadores da formação?',
  'A partir de que idade podem entrar?'
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

interface RateLimitData {
  count: number;
  cooldownUntil: number | null;
}

interface ChatWidgetProps {
  // This component is self-contained and manages its own open/close state
}

export const ChatWidget = ({}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitData>({ count: 0, cooldownUntil: null });
  const [remainingCooldown, setRemainingCooldown] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hcpdl-chat-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading chat history:', error);
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }

    // Load rate limit data
    const savedRateLimit = localStorage.getItem('hcpdl-chat-ratelimit');
    if (savedRateLimit) {
      try {
        const data: RateLimitData = JSON.parse(savedRateLimit);
        // Check if cooldown has expired
        if (data.cooldownUntil && data.cooldownUntil > Date.now()) {
          setRateLimit(data);
        } else {
          // Reset if cooldown expired
          setRateLimit({ count: 0, cooldownUntil: null });
          localStorage.removeItem('hcpdl-chat-ratelimit');
        }
      } catch (error) {
        console.error('Error loading rate limit:', error);
      }
    }
  }, []);

  const initializeWelcomeMessage = () => {
    const welcomeMsg: Message = {
      id: Date.now().toString(),
      text: 'Olá! Como posso ajudar? Pode escolher uma pergunta abaixo ou escrever a sua própria.',
      sender: 'bot',
      timestamp: Date.now()
    };
    setMessages([welcomeMsg]);
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('hcpdl-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Save rate limit to localStorage
  useEffect(() => {
    if (rateLimit.count > 0 || rateLimit.cooldownUntil) {
      localStorage.setItem('hcpdl-chat-ratelimit', JSON.stringify(rateLimit));
    }
  }, [rateLimit]);

  // Update remaining cooldown timer
  useEffect(() => {
    if (!rateLimit.cooldownUntil) {
      setRemainingCooldown(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, rateLimit.cooldownUntil! - Date.now());
      setRemainingCooldown(remaining);

      if (remaining === 0) {
        // Cooldown expired, reset
        setRateLimit({ count: 0, cooldownUntil: null });
        localStorage.removeItem('hcpdl-chat-ratelimit');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [rateLimit.cooldownUntil]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkRateLimit = (): boolean => {
    // Check if in cooldown
    if (rateLimit.cooldownUntil && rateLimit.cooldownUntil > Date.now()) {
      const remainingMinutes = Math.ceil((rateLimit.cooldownUntil - Date.now()) / 1000 / 60);
      toast.error(`Limite de mensagens atingido. Tente novamente em ${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}.`);
      return false;
    }

    // Check if reached limit
    if (rateLimit.count >= MAX_MESSAGES) {
      const cooldownUntil = Date.now() + COOLDOWN_TIME;
      setRateLimit({ count: MAX_MESSAGES, cooldownUntil });
      toast.error('Atingiu o limite de 5 mensagens. Aguarde 5 minutos para continuar.');
      return false;
    }

    return true;
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    // Check rate limit
    if (!checkRateLimit()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Increment message count
    setRateLimit(prev => ({ ...prev, count: prev.count + 1 }));

    try {
      // Call Make.com webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Try to parse as JSON, fallback to plain text
      let botReply: string;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        botReply = data.reply || data.message || 'Desculpe, não consegui processar a sua mensagem.';
      } else {
        // Handle plain text response
        botReply = await response.text();
      }

      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: 'bot',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');

      // Add error message from bot
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Por favor, tente novamente mais tarde.',
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Auto-send after setting the value
    setTimeout(() => sendMessage(question), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatCooldownTime = (ms: number): string => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const clearChatHistory = () => {
    // Clear only chat history, keep rate limit data
    localStorage.removeItem('hcpdl-chat-history');
    initializeWelcomeMessage();
    toast.success('Histórico de conversas limpo!');
  };

  const isInCooldown = rateLimit.cooldownUntil && rateLimit.cooldownUntil > Date.now();

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group border-2 border-black"
          aria-label="Abrir chat"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-50 sm:bg-black/60"
              onClick={() => setIsOpen(false)}
              style={{ 
                WebkitTapHighlightColor: 'transparent'
              }}
            />

            {/* Chat Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 w-screen h-screen sm:bottom-0 sm:inset-auto sm:right-4 sm:w-96 sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              style={{
                maxHeight: '100vh',
                maxWidth: '100vw'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gradient-to-r from-yellow-500 to-yellow-600 sm:rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                  <h3 className="font-semibold text-sm sm:text-base text-black">Chat de Suporte</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-black hover:bg-black/20 rounded-full p-1 transition-colors"
                  aria-label="Fechar chat"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Rate Limit Warning */}
              {isInCooldown && (
                <div className="bg-red-50 border-b border-red-200 p-2 sm:p-3 flex items-center gap-2 flex-shrink-0">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <p className="text-xs sm:text-sm text-red-700">
                    Limite atingido. Aguarde {formatCooldownTime(remainingCooldown)}
                  </p>
                </div>
              )}

              {/* Message Counter and Clear Button */}
              {!isInCooldown && (
                <div className="bg-yellow-50 border-b border-yellow-200 p-2 sm:p-2 flex items-center justify-between px-3 sm:px-4 flex-shrink-0">
                  <p className="text-xs sm:text-xs text-yellow-700">
                    Mensagens: {rateLimit.count}/{MAX_MESSAGES}
                  </p>
                  {messages.length >= 1 && (
                    <button
                      onClick={clearChatHistory}
                      className="text-xs sm:text-xs text-yellow-700 hover:text-yellow-900 flex items-center gap-1 hover:bg-yellow-100 px-2 py-1 sm:px-2 sm:py-1 rounded transition-colors"
                      aria-label="Limpar conversa"
                    >
                      <Trash2 className="h-3 w-3 sm:h-3 sm:w-3" />
                      <span className="whitespace-nowrap">Limpar</span>
                    </button>
                  )}
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-black text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      <p
                        className={`text-[10px] sm:text-xs mt-1 ${
                          message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="border-t border-b p-2 landscape:p-1.5 sm:p-3 bg-gray-50 flex-shrink-0">
                <p className="text-[10px] sm:text-xs text-gray-600 mb-1.5 landscape:mb-1 sm:mb-2 font-medium px-1">Perguntas Rápidas:</p>
                <div className="grid grid-cols-2 landscape:grid-cols-4 gap-1.5 landscape:gap-1 sm:gap-2">
                  {QUICK_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isLoading || isInCooldown}
                      className="text-[10px] landscape:text-[9px] sm:text-xs px-2 py-1.5 landscape:px-1.5 landscape:py-1 sm:px-3 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left leading-tight"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-2 sm:p-4 bg-white sm:rounded-b-2xl flex-shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escreva a sua mensagem..."
                    disabled={isLoading || isInCooldown}
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm border-2 border-yellow-500 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim() || isLoading || isInCooldown}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-black p-2 rounded-full transition-colors disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px] sm:min-w-[40px]"
                    aria-label="Enviar mensagem"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : (
                      <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
