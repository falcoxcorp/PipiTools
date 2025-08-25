import React, { useState, useRef, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Overlay, Popover, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaTelegram, 
  FaRocket, 
  FaLock, 
  FaCoins, 
  FaGem,
  FaStar,
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaMagic
} from 'react-icons/fa';
import { BsTwitterX, BsStars, BsDot, BsLightningFill } from 'react-icons/bs';
import { GiToken, GiArtificialIntelligence } from 'react-icons/gi';
import { SiBinance } from 'react-icons/si';
import { motion } from 'framer-motion';
import PipitoolsData from './Pipitools.json';
import "./Footer.css";

const Footer = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [messages, setMessages] = useState([
        { 
            text: "Hello! I'm PipiBot, your AI assistant powered by PipiTools. How can I help you today?", 
            sender: 'bot',
            special: true
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const messagesEndRef = useRef(null);
    const [target, setTarget] = useState(null);
    const [showPopover, setShowPopover] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);

    const DEEPSEEK_API_KEY = 'sk-7f64b20fb5a548a1b2c911bbc4a1473c';
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const pulseInterval = setInterval(() => {
            setIsPulsing(prev => !prev);
        }, 3000);

        return () => clearInterval(pulseInterval);
    }, []);

    const detectLanguage = async (text) => {
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: "Detect the language of the following text and respond only with the ISO language code (e.g. 'es', 'en', 'fr', etc.). Just return the code."
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 5
                })
            });

            const data = await response.json();
            const detectedLang = data.choices[0]?.message?.content?.trim() || 'en';
            setCurrentLanguage(detectedLang);
            return detectedLang;
        } catch (error) {
            console.error("Error detecting language:", error);
            return 'en';
        }
    };

    const translateText = async (text, targetLang) => {
        if (!text.trim() || targetLang === 'en') return text;
        
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: `Translate the following text to ${targetLang} language. Preserve formatting, line breaks and emojis. Only return the translation.`
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            return data.choices[0]?.message?.content || text;
        } catch (error) {
            console.error("Error translating text:", error);
            return text;
        }
    };

    const findRelevantJsonAnswer = (question) => {
        const lowerQuestion = question.toLowerCase();
        
        const directMatch = PipitoolsData.predefinedQuestions.find(q => 
            lowerQuestion.includes(q.question.toLowerCase().split(' ')[0]) ||
            q.question.toLowerCase().includes(lowerQuestion.split(' ')[0])
        );
        
        if (directMatch) return directMatch.answer;
        
        const keywords = {
            'pipitools': 'What is PipiTools?',
            'vision': 'What is your vision?',
            'token': 'How does the Token Creator work?',
            'fairlaunch': 'How do I create a Fairlaunch?',
            'launchpad': 'How do I create a Launchpad?',
            'staking': 'How does Staking work?',
            'follow': 'Where can I follow you?',
            'create': 'How do I create a Fairlaunch?',
            'project': 'What is PipiTools?',
            'start': 'What is PipiTools?',
            'how': 'How do I create a Fairlaunch?',
            'crear': 'How do I create a Fairlaunch?',
            'proyecto': 'What is PipiTools?'
        };
        
        for (const [keyword, questionKey] of Object.entries(keywords)) {
            if (lowerQuestion.includes(keyword)) {
                const found = PipitoolsData.predefinedQuestions.find(q => q.question === questionKey);
                if (found) return found.answer;
            }
        }
        
        return null;
    };

    const generateFriendlyResponse = async (question, jsonAnswer, language) => {
        try {
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: language === 'en' 
                                ? "You are PipiBot. Rewrite this information in a friendly, engaging way while keeping all technical details accurate. Use emojis when appropriate. Maintain the original language and never mention DeepSeek."
                                : "Eres PipiBot. Reescribe esta información de manera amigable y atractiva manteniendo todos los detalles técnicos precisos. Usa emojis cuando sea apropiado. Mantén el idioma original y nunca menciones DeepSeek."
                        },
                        {
                            role: "user",
                            content: `Question: ${question}\n\nOriginal content: ${jsonAnswer}\n\nGenerate improved response:`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            let botResponse = data.choices[0]?.message?.content || jsonAnswer;
            return botResponse.replace(/DeepSeek/gi, 'PipiTools');
        } catch (error) {
            console.error("Error generating friendly response:", error);
            return jsonAnswer;
        }
    };

    const handlePredefinedQuestion = async (question) => {
        const detectedLang = await detectLanguage(question);
        const jsonAnswer = findRelevantJsonAnswer(question);
        
        if (jsonAnswer) {
            setLoading(true);
            setAiThinking(true);
            
            try {
                let translatedAnswer = detectedLang === 'en' 
                    ? jsonAnswer 
                    : await translateText(jsonAnswer, detectedLang);
                
                const friendlyResponse = await generateFriendlyResponse(question, translatedAnswer, detectedLang);
                
                setMessages(prev => [...prev, { 
                    text: friendlyResponse, 
                    sender: 'bot',
                    predefinedAnswer: true
                }]);
            } catch (error) {
                console.error("Error processing predefined question:", error);
                const errorMessage = { 
                    text: detectedLang === 'en' 
                        ? "Sorry, I'm having trouble answering your question." 
                        : "Lo siento, estoy teniendo problemas para responder tu pregunta.",
                    sender: 'bot',
                    isError: true
                };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setLoading(false);
                setAiThinking(false);
            }
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { text: inputMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);
        setAiThinking(true);

        try {
            const detectedLang = await detectLanguage(inputMessage);
            const jsonAnswer = findRelevantJsonAnswer(inputMessage);
            let botResponse;
            
            if (jsonAnswer) {
                let translatedAnswer = detectedLang === 'en' 
                    ? jsonAnswer 
                    : await translateText(jsonAnswer, detectedLang);
                
                botResponse = await generateFriendlyResponse(inputMessage, translatedAnswer, detectedLang);
            } else {
                const response = await fetch(DEEPSEEK_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            {
                                role: "system",
                                content: detectedLang === 'en' 
                                    ? "You are PipiBot, a helpful assistant for PipiTools crypto platform. Provide accurate, concise responses in English only. Use emojis when appropriate. Never mention DeepSeek."
                                    : `Eres PipiBot, un asistente útil para la plataforma crypto PipiTools. Proporciona respuestas precisas y concisas en ${detectedLang} solamente. Usa emojis cuando sea apropiado. Nunca menciones DeepSeek.`
                            },
                            {
                                role: "user",
                                content: inputMessage
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });

                const data = await response.json();
                botResponse = data.choices[0]?.message?.content || "";
                botResponse = botResponse.replace(/DeepSeek/gi, 'PipiTools');
            }

            const botMessage = { 
                text: botResponse, 
                sender: 'bot',
                aiGenerated: true
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error calling API:", error);
            const errorMessage = { 
                text: currentLanguage === 'en' 
                    ? "Sorry, I'm having trouble processing your request. Please try again later." 
                    : "Lo siento, estoy teniendo problemas para procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
                sender: 'bot',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setAiThinking(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const iconHover = {
        scale: 1.3,
        y: -5,
        transition: { 
            type: "spring", 
            stiffness: 500, 
            damping: 8,
            duration: 0.3
        }
    };
    
    const linkHover = {
        scale: 1.08,
        color: "#ffd700",
        textShadow: "0 0 8px rgba(255, 215, 0, 0.7)",
        transition: { 
            duration: 0.3,
            ease: "easeOut"
        }
    };

    const pulseAnimation = {
        scale: [1, 1.05, 1],
        opacity: [0.9, 1, 0.9],
        transition: { 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const floatingAnimation = {
        y: [0, -15, 0],
        rotate: [0, 2, -2, 0],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const sparkleHover = {
        scale: 1.5,
        rotate: 15,
        transition: { duration: 0.3 }
    };

    const aiPulse = {
        scale: [1, 1.1, 1],
        boxShadow: [
            '0 0 0 0 rgba(29, 161, 242, 0.4)',
            '0 0 0 10px rgba(29, 161, 242, 0)',
            '0 0 0 0 rgba(29, 161, 242, 0)'
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
        }
    };

    const aiThinkingAnimation = {
        rotate: [0, 10, -10, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const socialLinks = [
        { icon: <BsTwitterX />, url: 'https://twitter.com/KING_PIPI_LOL', className: "twitter-icon" },
        { icon: <FaWhatsapp />, url: 'https://chat.whatsapp.com/DizddEZuabG9yVLLwNLkIu', className: "whatsapp-icon" },
        { icon: <FaTelegram />, url: 'https://t.me/PIPI_LOL', className: "telegram-icon" }
    ];

    const footerLinks = [
        { icon: <FaRocket />, text: 'Create a launchpad', url: '/launchpads/launchpad' },
        { icon: <SiBinance />, text: 'Create a fairlaunch', url: '/launchpads/fairlaunch' },
        { icon: <BsStars />, text: 'Launchpads List', url: '/launchpads/launchpad-list' },
        { icon: <FaLock />, text: 'Create a Lock', url: '/lock/create' },
        { icon: <FaCoins />, text: 'Lock List', url: '/lock/tokens' },
        { icon: <GiToken />, text: 'Create a Token', url: '/token' },
        { icon: <FaGem />, text: 'PipiSwap', url: 'https://pipiswap.finance/' },
        { icon: <FaCoins />, text: 'Staking', url: 'https://pipitool.com/staking/create' },
        { icon: <FaStar />, text: 'Official Website', url: 'https://cryptopipi.lol/' },
        { icon: <FaGem />, text: 'Roulette', url: 'https://roulette.pipitools.finance/' }
    ];

    return (
        <>
            <Card className="footer gradient-bg text-white" style={{ overflow: 'hidden' }}>
                <Container fluid>
                    <Row className="justify-content-center py-3">
                        <Col xs={12}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <div className="footer-links d-flex flex-wrap justify-content-center align-items-center">
                                    {footerLinks.map((link, index) => (
                                        <React.Fragment key={index}>
                                            <motion.div 
                                                whileHover={linkHover}
                                                whileTap={{ scale: 0.95 }}
                                                className="link-item mx-3 my-2"
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ 
                                                    duration: 0.5,
                                                    delay: index * 0.05 + 0.3
                                                }}
                                            >
                                                <motion.span 
                                                    className="link-icon"
                                                    whileHover={{ rotate: 15 }}
                                                >
                                                    {link.icon}
                                                </motion.span>
                                                <Link 
                                                    to={link.url} 
                                                    target={link.url.startsWith('http') ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                    className="link-text"
                                                >
                                                    {link.text}
                                                </Link>
                                            </motion.div>
                                            {index < footerLinks.length - 1 && (
                                                <motion.span 
                                                    className="separator mx-1 d-none d-md-inline"
                                                    animate={{ 
                                                        opacity: [0.4, 0.8, 0.4],
                                                        scale: [0.9, 1.1, 0.9]
                                                    }}
                                                    transition={{ 
                                                        duration: 3, 
                                                        repeat: Infinity,
                                                        delay: index * 0.05
                                                    }}
                                                >
                                                    <BsDot />
                                                </motion.span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </motion.div>
                        </Col>
                    </Row>

                    {/* Mobile Social Icons - shown only on mobile */}
                    <Row className="justify-content-center py-2 d-md-none">
                        <Col xs={12} className="text-center">
                            <Card className="social-icons-container glass-effect p-2 mx-auto" style={{ borderRadius: '50px', maxWidth: 'fit-content' }}>
                                <div className="d-flex">
                                    {socialLinks.map((social, index) => (
                                        <motion.div 
                                            key={index}
                                            whileHover={iconHover}
                                            whileTap={{ scale: 0.8 }}
                                            className="mx-2"
                                        >
                                            <Link 
                                                to={social.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={`social-icon ${social.className}`}
                                            >
                                                <motion.span
                                                    whileHover={{
                                                        rotate: [0, 10, -10, 0],
                                                        transition: { duration: 0.6 }
                                                    }}
                                                >
                                                    {social.icon}
                                                </motion.span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="justify-content-center py-2">
                        <Col xs={12} className="text-center">
                            <motion.div 
                                className="copyright-text"
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                © {new Date().getFullYear()}{' '}
                                <motion.span 
                                    whileHover={{ 
                                        scale: 1.15,
                                        textShadow: "0 0 15px rgba(255, 215, 0, 0.8)"
                                    }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Link to='/' className="highlight">Pipitools.finance</Link>
                                </motion.span>{' '}
                                <motion.span
                                    animate={{ 
                                        rotate: [0, 360],
                                        scale: [1, 1.3, 1],
                                        y: [0, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        ease: "easeInOut"
                                    }}
                                    style={{ display: 'inline-block' }}
                                >
                                    🚀
                                </motion.span>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>

                {/* Desktop Social Icons - shown only on desktop */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="social-icons-bottom-right d-none d-md-flex"
                    style={{
                        position: 'absolute',
                        right: '100px',
                        bottom: '20px'
                    }}
                >
                    <Card className="social-icons-container glass-effect p-2" style={{ borderRadius: '50px' }}>
                        <div className="d-flex">
                            {socialLinks.map((social, index) => (
                                <motion.div 
                                    key={index}
                                    whileHover={iconHover}
                                    whileTap={{ scale: 0.8 }}
                                    className="mx-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 15,
                                        delay: index * 0.1
                                    }}
                                >
                                    <Link 
                                        to={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`social-icon ${social.className}`}
                                    >
                                        <motion.span
                                            whileHover={{
                                                rotate: [0, 10, -10, 0],
                                                transition: { duration: 0.6 }
                                            }}
                                        >
                                            {social.icon}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </Card>

            <div className="ai-chatbot-container">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                    <motion.div
                        animate={isPulsing ? aiPulse : {}}
                        transition={{ duration: 2 }}
                    >
                        <Button 
                            variant="primary" 
                            className="rounded-circle p-3 ai-assistant-btn"
                            style={{
                                width: '80px',
                                height: '80px',
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 1000,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                background: 'linear-gradient(135deg, #1da1f2 0%, #0d8ecf 100%)',
                                border: 'none'
                            }}
                            onClick={() => setShowChatbot(!showChatbot)}
                            ref={setTarget}
                            onMouseEnter={() => setShowPopover(true)}
                            onMouseLeave={() => setShowPopover(false)}
                        >
                            <motion.div
                                animate={aiThinking ? aiThinkingAnimation : {}}
                                style={{ position: 'relative' }}
                            >
                                <motion.img 
                                    src="https://photos.pinksale.finance/file/pinksale-logo-upload/1744347955474-8a5087d513cfa95ac82786fe3053ec72.png" 
                                    alt="AI Assistant"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        border: '2px solid white'
                                    }}
                                    whileHover={{ rotate: 10 }}
                                />
                                <motion.div 
                                    className="ai-status-indicator"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.8, 1, 0.8],
                                        backgroundColor: aiThinking ? '#ff5722' : '#4caf50'
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity
                                    }}
                                />
                            </motion.div>
                        </Button>
                    </motion.div>

                    <Overlay
                        target={target}
                        show={showPopover}
                        placement="left"
                    >
                        <Popover id="popover-chatbot" className="ai-popover">
                            <Popover.Header as="h3" className="d-flex align-items-center">
                                <GiArtificialIntelligence className="mr-2" />
                                PipiBot Assistant
                                <motion.span
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity
                                    }}
                                    className="ml-2"
                                >
                                    <BsLightningFill color="#ffd700" />
                                </motion.span>
                            </Popover.Header>
                            <Popover.Body>
                                <motion.div
                                    animate={{
                                        backgroundPosition: ['0% 0%', '100% 100%']
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "linear"
                                    }}
                                    style={{
                                        background: 'linear-gradient(45deg, #f3ec78, #af4261, #1da1f2, #23d5ab)',
                                        backgroundSize: '300% 300%',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Powered by PipiTools AI
                                </motion.div>
                            </Popover.Body>
                        </Popover>
                    </Overlay>
                </motion.div>

                {showChatbot && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="chatbot-window"
                        style={{
                            position: 'fixed',
                            bottom: '110px',
                            right: '20px',
                            width: '380px',
                            maxWidth: '90vw',
                            height: '550px',
                            maxHeight: '70vh',
                            borderRadius: '20px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1001,
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
                        }}
                    >
                        {/* ... rest of your chatbot code remains the same ... */}
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default Footer;