import { useState } from "react";
import { Shield, MessageCircle, Users, Star, Brain, Heart, BookOpen, Lock, CheckCircle2, Play, Hand, DoorOpen, Feather, Smile, Frown, Meh, ThumbsDown } from "lucide-react";

interface TipContent {
  title: string;
  text?: string;
  subText?: string;
  type: 'simple' | 'examples' | 'feelings' | 'icons' | 'mascot' | 'contrast';
  examples?: string[];
  illustration?: string;
  contrastExamples?: { label: string; ok: boolean }[];
  icons?: { icon: any; label: string }[];
}

interface TipNode {
  id: number;
  title: string;
  icon: any;
  color: string;
  shadowColor: string;
  position: "left" | "center" | "right";
  content: TipContent;
}

function LessonCircle({ 
  title, 
  icon, 
  color, 
  shadowColor, 
  isCompleted,
  position,
  onClick 
}: {
  title: string;
  icon: any;
  color: string;
  shadowColor: string;
  isCompleted: boolean;
  position: "left" | "center" | "right";
  onClick: () => void;
}) {
  const [isPressed, setIsPressed] = useState(false);
  
  const positionClass = {
    left: "mr-auto ml-8",
    center: "mx-auto",
    right: "ml-auto mr-8"
  }[position];

  return (
    <div className={`relative ${positionClass} w-fit`}>
      <button
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className="relative flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer group"
      >
        {/* Main lesson circle */}
        <div 
          className={`
            w-20 h-20 rounded-full flex items-center justify-center relative
            transition-all duration-500
            ${isCompleted ? 'bg-purple-500' : color}
            ${isCompleted ? 'ring-4 ring-purple-300' : ''}
          `}
          style={{
            boxShadow: isPressed
              ? `0 2px 0 0 ${isCompleted ? '#7c3aed' : shadowColor}`
              : `0 6px 0 0 ${isCompleted ? '#7c3aed' : shadowColor}`,
            transform: isPressed ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          <div className="relative text-white">
            {icon}
            {isCompleted && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white scale-bounce">
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>

        {/* Title */}
        <div className="text-center max-w-[120px]">
          <p className={`text-xs font-bold text-foreground group-hover:scale-105 transition-transform`}>
            {title}
          </p>
        </div>
      </button>
    </div>
  );
}

function PathConnector({ 
  fromPosition, 
  toPosition 
}: { 
  fromPosition: "left" | "center" | "right";
  toPosition: "left" | "center" | "right";
}) {
  const positions = { left: 80, center: 150, right: 220 };
  const startX = positions[fromPosition];
  const endX = positions[toPosition];
  const height = 64; 

  const path = `M ${startX} 0 Q ${startX} 30, ${(startX + endX) / 2} ${height / 2} T ${endX} ${height}`;

  return (
    <div className="relative w-full h-16 overflow-visible">
      <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 300 64" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="grey" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}

import Lottie from "lottie-react";

// ... existing interfaces ...

export function ActionCardList() {
  const [activeTipId, setActiveTipId] = useState<number | null>(null);
  const [completedTips, setCompletedTips] = useState<number[]>([1]); 
  const [isClosing, setIsClosing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  const [celebrationText, setCelebrationText] = useState("");

  // Haptics (same idea as Quiz)
  const buildingPattern = () => {
    if (navigator.vibrate) {
      const pattern = [
        25, 250, 30, 220, 35, 200, 40, 180, 45, 160, 50, 140, 55, 120, 60, 100,
        65, 90, 70, 80, 75, 70, 300, 120,
      ];
      navigator.vibrate(pattern);
    }
  };

  // Two medium-length pulses for "wrong" (requested)
  const wrongPattern = () => {
    if (navigator.vibrate) {
      navigator.vibrate([160, 90, 160]);
    }
  };

  const animationFiles = [
    "Celebration balloon confetti animation.json", 
    "Champion.json", 
    "Trophy.json"
  ];

  const phrases = [
    "Yayyy, that's one more tip learnt!", 
    "You're getting safer every day!", 
    "Awesome job!", 
    "You are a safety superstar!",
    "Great work!"
  ];

  // ... tips array ...
  const tips: TipNode[] = [
    {
      id: 1,
      title: "If Someone Offers You Something",
      icon: <Shield className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-blue-500",
      shadowColor: "#2563eb",
      position: "center",
      content: {
        type: "examples",
        title: "If Someone Offers You Something",
        text: "You don’t have to take anything you don’t recognize or feel unsure about.",
        examples: ["No thank you, I don’t want that.", "I need to ask my grown-up first."],
        illustration: "/illustrations/say no.svg"
      }
    },
    {
      id: 2,
      title: "Pressure Is Not Okay",
      icon: <Hand className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-orange-500",
      shadowColor: "#ea580c",
      position: "left",
      content: {
        type: "examples",
        title: "Pressure Is Not Okay",
        text: "If someone keeps asking or pushing you, it’s okay to say no and step away.",
        examples: ["Please stop asking me.", "I don’t want to do this."],
        illustration: "/illustrations/say no.svg"
      }
    },
    {
      id: 3,
      title: "Secrets That Feel Wrong",
      icon: <Lock className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-indigo-500",
      shadowColor: "#4f46e5",
      position: "right",
      content: {
        type: "examples",
        title: "Secrets That Feel Wrong",
        text: "You should never keep a secret that makes you feel scared or uncomfortable.",
        examples: ["I need to tell someone about this.", "This doesn’t feel okay to keep secret."],
        illustration: "/illustrations/what are drugs.svg"
      }
    },
    {
      id: 4,
      title: "You Can Walk Away",
      icon: <DoorOpen className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-green-500",
      shadowColor: "#16a34a",
      position: "center",
      content: {
        type: "examples",
        title: "You Can Walk Away",
        text: "Leaving a situation is always a safe choice when something feels wrong.",
        examples: ["I’m going to go now.", "I don’t want to stay here."],
        illustration: "/illustrations/safe places.svg"
      }
    },
    {
      id: 5,
      title: "Ask a Safe Grown-Up",
      icon: <Users className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-yellow-400",
      shadowColor: "#ca8a04",
      position: "left",
      content: {
        type: "examples",
        title: "Ask a Safe Grown-Up",
        text: "Talking to a trusted adult can help keep you safe.",
        examples: ["Can I talk to you about something?", "Something happened that made me uncomfortable."],
        illustration: "/illustrations/safe places.svg"
      }
    },
    {
      id: 6,
      title: "You’re Not in Trouble",
      icon: <Star className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-pink-500",
      shadowColor: "#db2777",
      position: "right",
      content: {
        type: "examples",
        title: "You’re Not in Trouble",
        text: "Even if you’re confused or already said yes, you can still ask for help.",
        examples: ["I didn’t know what to do.", "I need help with something."],
        illustration: "/illustrations/feelings.svg"
      }
    },
    {
      id: 7,
      title: "Trust How You Feel",
      icon: <Heart className="w-9 h-9" strokeWidth={2.5} />,
      color: "bg-teal-500",
      shadowColor: "#0d9488",
      position: "center",
      content: {
        type: "examples",
        title: "Trust How You Feel",
        text: "If your body or feelings say something is wrong, it’s okay to listen to that.",
        examples: ["I don’t feel comfortable.", "I want to stop."],
        illustration: "/illustrations/feelings.svg"
      }
    }
  ];

  const handleTipClick = (id: number) => {
    if (navigator.vibrate) navigator.vibrate(20);
    setActiveTipId(id);
    setIsClosing(false);
    setShowCelebration(false);
  };

  const handleGotIt = async () => {
    buildingPattern();
    // Select random animation and text
    const randomAnim = animationFiles[Math.floor(Math.random() * animationFiles.length)];
    const randomText = phrases[Math.floor(Math.random() * phrases.length)];
    
    setCelebrationText(randomText);

    try {
        const response = await fetch(`/animations/${randomAnim}`);
        if(response.ok) {
            const json = await response.json();
            setCelebrationData(json);
            setShowCelebration(true);
            
            // Show celebration for 3 seconds, then slide out with celebration still visible
            setTimeout(() => {
                setIsClosing(true);
                // Cleanup after slide completes
                setTimeout(() => {
                  if (activeTipId !== null && !completedTips.includes(activeTipId)) {
                    setCompletedTips(prev => [...prev, activeTipId]);
                  }
                  setActiveTipId(null);
                  setIsClosing(false);
                  setShowCelebration(false);
                  setCelebrationData(null);
                }, 450);
            }, 3000);
        } else {
            // Fallback if fetch fails
            handleClose(true);
        }
    } catch (e) {
        console.error("Failed to load animation", e);
        handleClose(true);
    }
  };

  const handleClose = (markCompleted = false) => {
    if (markCompleted) {
      buildingPattern();
    } else {
      wrongPattern();
    }
    setIsClosing(true);
    setTimeout(() => {
      if (markCompleted && activeTipId !== null && !completedTips.includes(activeTipId)) {
        setCompletedTips(prev => [...prev, activeTipId]);
      }
      setActiveTipId(null);
      setIsClosing(false);
      setShowCelebration(false);
      setCelebrationData(null); 
    }, 450);
  };

  const activeTip = tips.find(t => t.id === activeTipId);

  return (
    <div className="px-5 relative">
      <div className="flex items-center justify-between mb-6 -mt-4">
        <h2 className="text-2xl font-black text-foreground">Let's Keep You Safe</h2>
      </div>
      
      <div className="relative py-4 pb-20">
        {tips.map((tip, index) => (
          <div key={tip.id} className="relative z-10">
            <LessonCircle
              title={tip.title}
              icon={tip.icon}
              color={tip.color}
              shadowColor={tip.shadowColor}
              isCompleted={completedTips.includes(tip.id)}
              position={tip.position}
              onClick={() => handleTipClick(tip.id)}
            />
            {index < tips.length - 1 && (
              <PathConnector fromPosition={tip.position} toPosition={tips[index + 1].position} />
            )}
          </div>
        ))}
      </div>

      {/* Full Screen Tip View */}
      {activeTipId && (
        <div 
          className={`
            fixed inset-0 z-[100] bg-background
            transition-all duration-400 ease-in-out
            ${isClosing ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'}
          `}
        >
          {/* Close / Back Button */}
          <button 
            onClick={() => handleClose(false)} 
            className={`absolute top-6 left-6 p-2 rounded-full bg-muted/30 hover:bg-muted text-muted-foreground transition-all z-10 ${showCelebration ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {/* Tip Content */}
          <div className={`w-full h-full flex flex-col items-center justify-start p-6 pt-20 pb-8 overflow-y-auto transition-opacity duration-300 ${showCelebration ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
              {/* Big Icon or Illustration */}
              {activeTip.content.illustration ? (
                 <div className="w-full max-w-xs h-40 bg-muted/20 rounded-3xl flex items-center justify-center overflow-hidden mb-2 shadow-sm">
                    <img 
                      src={activeTip.content.illustration} 
                      alt={activeTip.title}
                      className="w-full h-full object-contain p-2"
                    />
                 </div>
              ) : (
                <div className={`w-32 h-32 shrink-0 rounded-full flex items-center justify-center ${activeTip.color} text-white shadow-2xl bounce-in`}>
                  <div style={{ transform: 'scale(1.5)' }}>
                    {activeTip.icon}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-foreground tracking-tight leading-tight">{activeTip.content.title}</h3>
                
                {activeTip.content.text && (
                  <p className="text-xl font-medium text-muted-foreground leading-relaxed px-2">
                    {activeTip.content.text}
                  </p>
                )}
              </div>

              {/* Dynamic Content */}
              {activeTip.content.type === 'examples' && activeTip.content.examples && (
                <div className="flex flex-col gap-3 w-full">
                  {activeTip.content.examples.map((ex, i) => (
                    <div key={i} className="bg-muted/30 p-4 rounded-2xl font-bold text-lg text-foreground border-2 border-transparent hover:border-primary/20 transition-all">
                      "{ex}"
                    </div>
                  ))}
                </div>
              )}

              {activeTip.content.type === 'contrast' && activeTip.content.contrastExamples && (
                <div className="flex flex-col gap-3 w-full">
                  {activeTip.content.contrastExamples.map((item, i) => (
                    <div key={i} className={`p-4 rounded-2xl font-bold text-lg border-2 flex justify-between items-center ${item.ok ? 'bg-green-50/50 border-green-200 text-green-800' : 'bg-red-50/50 border-red-200 text-red-800'}`}>
                      <span>{item.label}</span>
                      <span className="text-2xl">{item.ok ? '🎁' : '🤫'}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTip.content.type === 'feelings' && (
                <div className="grid grid-cols-2 gap-4 w-full">
                   {['Okay', 'Confused', 'Uncomfy', 'Unsafe'].map((emote, i) => (
                     <div key={i} className={`p-4 rounded-2xl bg-${['green','yellow','orange','red'][i]}-100 text-${['green','yellow','orange','red'][i]}-700 font-bold text-lg shadow-sm transform hover:scale-105 transition-transform`}>
                       {emote}
                     </div>
                   ))}
                </div>
              )}

              {activeTip.content.type === 'icons' && activeTip.content.icons && (
                <div className="flex gap-6 justify-center flex-wrap">
                   {activeTip.content.icons.map((item, i) => (
                     <div key={i} className="flex flex-col items-center gap-2">
                       <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent-foreground">
                         {item.icon}
                       </div>
                       <span className="text-sm font-bold text-muted-foreground">{item.label}</span>
                     </div>
                   ))}
                </div>
              )}
              
              {activeTip.content.type === 'simple' && activeTip.content.illustration && (
                 <div className="text-6xl animate-pulse">
                    {activeTip.title.includes("Leaving") ? "🏃💨" : "⭐"}
                 </div>
              )}

              {/* Got it Button - Fixed at bottom */}
              <div className="w-full pt-6 pb-4">
                 <button 
                   onClick={handleGotIt}
                   className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 active:scale-95 transition-transform"
                 >
                   Got it!
                 </button>
              </div>
            </div>
          </div>

          {/* Celebration Content - Same Page */}
          <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${showCelebration ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-full max-w-md flex flex-col items-center text-center">
              <div className="w-64 h-64 mb-6 shrink-0">
                {celebrationData && (
                  <Lottie 
                    animationData={celebrationData}
                    loop={true}
                    autoplay={true}
                  />
                )}
              </div>
              <h2 className="text-3xl font-black text-foreground mb-3 px-4 leading-tight animate-in slide-in-from-bottom-4 duration-500 delay-150">
                {celebrationText}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
