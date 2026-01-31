import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav, TabId } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { ArrowLeft, Mic, MicOff, Volume2, Send } from "lucide-react";
import { toast } from "sonner";

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

  const sendToGemini = async (text: string) => {
    setIsProcessing(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error("Gemini API key not configured. Please add your API key to the .env file.");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a friendly chat helper for children aged 8-13. Give EXTREMELY SHORT answers (1-2 sentences max, 15-20 words). Use simple words and be encouraging. User question: ${text}`
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

    // Index page uses internal tabs; pass desired tab via location.state
    navigate("/", { state: { tab } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {/* Header */}
      <Header />

      {/* White mask layer between video and chat (prevents chat from showing behind video) */}
      <div
        className="fixed top-10 left-0 right-0 z-30 bg-white pointer-events-none"
        style={{ height: '47vh' }}
      />

      {/* Avatar Video - Fixed at top, always visible */}
      <div className="fixed top-20 left-0 right-0 z-40 px-5 pt-0" style={{ height: '41vh' }}>
        <div className="max-w-lg mx-auto h-full">
          <div
            className="relative w-full h-full overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-white" />
            <video
              ref={videoRef}
              src="/avatar.mp4"
              loop
              muted
              playsInline
              className="relative w-full h-full object-contain p-4 pt-6"
              style={{ objectPosition: '51% 51%', transform: 'scale(1.63)' }}
            />

            {/* Status Overlay */}
            <div className="absolute top-4 right-4">
              {isPlaying && (
                <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Volume2 className="w-5 h-5 text-white animate-pulse" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-white">Speaking</span>
                </div>
              )}
              {isRecording && (
                <div className="flex items-center gap-2 bg-destructive/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white">Listening</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Main Content - Scrollable area that goes behind the video */}
      <main className="flex-1 pt-20 pb-[220px] overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          {/* Spacer to push content below the fixed video */}
          <div style={{ height: 'calc(41vh + 1rem)' }} />

          {/* Chat Messages */}
          <div className="px-5 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <h2 className="text-xl font-extrabold text-foreground mb-2">
                    Hi there! Want to talk or type? 
                  </h2>
                  <p className="text-sm text-muted-foreground font-semibold">
                    I’m listening!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
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

      {/* Input Area - Fixed at Bottom */}
      <div className="fixed bottom-[125px] left-0 right-0 z-[900] bg-card/95 backdrop-blur-lg px-5 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isRecording || isPlaying || isProcessing}
            className="flex-1 rounded-full"
          />
          <Button
            onClick={handleSendText}
            disabled={!inputText.trim() || isRecording || isPlaying || isProcessing}
            size="icon"
            className="rounded-full w-12 h-12"
            style={{ boxShadow: 'var(--shadow-button-primary)' }}
          >
            <Send className="w-5 h-5" />
          </Button>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isPlaying || isProcessing}
            size="icon"
            className={`rounded-full w-12 h-12 ${
              isRecording ? 'bg-destructive hover:bg-destructive/90' : ''
            }`}
            style={{ boxShadow: 'var(--shadow-button-primary)' }}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <BottomNav activeTab="chatbot" onTabChange={handleTabChange} />
    </div>
  );
}
