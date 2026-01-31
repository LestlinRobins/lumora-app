import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav, TabId } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ArrowLeft, Mic, MicOff, Volume2, Send } from "lucide-react";
import { toast } from "sonner";
import { hapticLight } from "@/lib/haptics";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chat() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start/Stop video ONLY during audio playback (not recording)
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  const startRecording = async () => {
    try {
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        toast.success("Listening... 🎤");
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          text: transcript,
          sender: "user",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        // Send to Gemini and get response
        await sendToGemini(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        console.error("Speech recognition error:", event.error);
        toast.error("Could not recognize speech. Please try again.");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // API Key rotation - cycles through available keys
  const getNextApiKey = (): string => {
    const keys = [
      import.meta.env.VITE_GEMINI_API_KEY1,
      import.meta.env.VITE_GEMINI_API_KEY2,
      import.meta.env.VITE_GEMINI_API_KEY3,
    ].filter(key => key && key !== 'your_gemini_api_key_here');
    
    if (keys.length === 0) {
      // Fallback to single key
      const singleKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (singleKey && singleKey !== 'your_gemini_api_key_here') {
        return singleKey;
      }
      throw new Error("No Gemini API keys configured.");
    }
    
    // Get current index from localStorage and rotate
    const currentIndex = parseInt(localStorage.getItem("gemini_key_index") || "0", 10);
    const nextIndex = (currentIndex + 1) % keys.length;
    localStorage.setItem("gemini_key_index", String(nextIndex));
    
    return keys[currentIndex];
  };

  const SYSTEM_PROMPT = `You are a child-friendly educational chatbot designed to teach children and teenagers about drug awareness, safety, and healthy life choices.

Your personality:
- Friendly, calm, caring, and supportive
- Use simple language suitable for ages 8–16
- Never sound scary, threatening, or preachy
- Encourage curiosity, questions, and healthy decision-making
- Speak like a kind teacher or older sibling

Your purpose:
- Educate users about what drugs are and why some substances can be harmful
- Explain effects in a non-graphic, age-appropriate way
- Promote healthy alternatives like sports, hobbies, friendships, and creativity
- Help children say "no" confidently and safely
- Encourage seeking help from trusted adults when needed

STRICT SAFETY RULES (Very Important):
- NEVER explain how to use, prepare, buy, hide, or distribute drugs
- NEVER give dosage information or instructions of any kind
- NEVER describe how drugs feel in an enjoyable or detailed sensory way
- NEVER encourage experimentation
- NEVER ask follow-up questions that increase curiosity about drug use
- NEVER assume the user has used drugs

If the user asks about drugs:
- Focus on health effects, risks, and long-term consequences
- Use simple examples (school, sports, family, friends)
- Emphasize safety and well-being over punishment

If the user sounds confused, scared, or pressured:
- Respond with reassurance and emotional support
- Encourage talking to a trusted adult (parent, teacher, counselor)
- Remind them they are not in trouble

If the user asks something unsafe or inappropriate:
- Gently refuse without mentioning rules or policies
- Redirect the conversation to safety, learning, or healthy choices
- Use phrases like: "I can't help with that, but I can help you understand why staying safe matters."

Tone rules:
- Use short sentences (1-2 sentences max, 15-25 words)
- Avoid medical jargon
- Avoid fear-based messaging
- Use positive reinforcement

Always end answers with encouragement, reassurance, or a healthy alternative.`;

  const sendToGemini = async (text: string) => {
    setIsProcessing(true);
    
    try {
      const apiKey = getNextApiKey();

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser message: ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const botResponseText = data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I didn't understand that. Can you try asking again?";

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // Convert response to speech
      await textToSpeech(botResponseText);
    } catch (error) {
      console.error("Error communicating with Gemini:", error);
      
      // Fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment! 💭",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error("Could not get response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const textToSpeech = async (text: string) => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Softer, child-friendly voice settings
      utterance.rate = 0.85; // Slower speech
      utterance.pitch = 1.1; // Slightly higher pitch for friendliness
      utterance.volume = 0.7; // Softer volume
      
      // Try to use a female voice (typically softer)
      const voices = synth.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Google US English')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error("Could not play audio response");
      };

      synth.speak(utterance);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      toast.error("Could not play audio");
    }
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    await sendToGemini(userMessage.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") {
      navigate("/profile");
      return;
    }

    if (tab === "chatbot") {
      navigate("/chat");
      return;
    }

    if (tab === "tips") {
      navigate("/tips");
      return;
    }

    // Index page uses internal tabs; pass desired tab via location.state
    navigate("/", { state: { tab } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      {/* White mask layer between video and chat (prevents chat from showing behind video) */}
      <div
        className="fixed top-10 left-0 right-0 z-30  pointer-events-none"
        style={{ height: '28vh' }}
      />

      {/* Avatar Video - Fixed at top, reduced size */}
      <div className="fixed top-24 left-0 right-0 z-40 px-5 pt-0 " style={{ height: '30vh' }}>
        <div className="max-w-lg mx-auto h-full">
          <div
            className="relative w-full h-full overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-white" />
            <video
              ref={videoRef}
              src="/avatar.mp4"
              loop
              muted
              playsInline
              className="relative w-full h-full object-contain p-2"
              style={{ objectPosition: '51% 51%', transform: 'scale(1.5)' }}
            />

            {/* Status Overlay */}
            <div className="absolute top-2 right-2">
              {isPlaying && (
                <div className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Volume2 className="w-4 h-4 text-white animate-pulse" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-white">Speaking</span>
                </div>
              )}
              {isRecording && (
                <div className="flex items-center gap-1.5 bg-destructive/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-white">Listening</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Main Content - Scrollable area that goes behind the video */}
      <main className="flex-1 pt-20 pb-[200px] overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          {/* Spacer to push content below the fixed video */}
          <div style={{ height: 'calc(25vh + 0.5rem)' }} />

          {/* Chat Messages */}
          <div className="px-5 py-20 space-y-3 top-12">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <h2 className="text-lg font-extrabold text-foreground mb-2">
                    Hi there! Want to talk or type? 
                  </h2>
                  <p className="text-sm text-muted-foreground font-semibold">
                    Tap the mic button to start talking!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-[80%] p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      }`}
                    >
                      <p className="text-sm font-semibold">{message.text}</p>
                    </Card>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <Card className="bg-card p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Input Area - Fixed at Bottom - Mic-focused design */}
      <div className="fixed bottom-[90px] left-0 right-0 z-[900] bg-white px-5 py-4">
        <div className="max-w-lg mx-auto">
          {/* Main Mic Button - Large and centered */}
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={() => {
                hapticLight();
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
              disabled={isPlaying || isProcessing}
              size="icon"
              className={`rounded-full w-16 h-16 transition-all duration-300 ${
                isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 scale-110 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              style={{ 
                boxShadow: isRecording 
                  ? '0 0 30px rgba(239, 68, 68, 0.5)' 
                  : 'var(--shadow-button-primary)' 
              }}
            >
              {isRecording ? (
                <MicOff className="w-7 h-7" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </Button>
            <span className="text-xs font-bold text-muted-foreground">
              {isRecording ? "Tap to stop" : "Tap to speak"}
            </span>
          </div>

          {/* Text input row - Secondary */}
          <div className="flex items-center gap-2 mt-3 mb-4">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Or type here..."
              disabled={isRecording || isPlaying || isProcessing}
              className="flex-1 rounded-full h-10 text-sm"
            />
            <Button
              onClick={() => {
                hapticLight();
                handleSendText();
              }}
              disabled={!inputText.trim() || isRecording || isPlaying || isProcessing}
              size="icon"
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
              style={{ boxShadow: 'var(--shadow-button-primary)' }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav activeTab="chatbot" onTabChange={handleTabChange} />
    </div>
  );
}
