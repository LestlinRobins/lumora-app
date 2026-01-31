
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Heart, BookOpen, Star, Brain, Lock, CheckCircle2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LessonBalloon {
  id: number;
  title: string;
  type: "story" | "quiz" | "practice" | "lesson";
  icon: React.ElementType;
  color: string;
  shadowColor: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bottomPosition: string;
  leftPosition: string;
}

interface BalloonProps extends LessonBalloon {
  onClick?: () => void;
  className?: string;
}

function Balloon({ 
  title, 
  icon: Icon, 
  color, 
  shadowColor,
  isUnlocked, 
  isCompleted, 
  bottomPosition,
  leftPosition,
  onClick,
  className
}: BalloonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div 
      className={`absolute ${className || ''}`}
      style={{ 
        bottom: bottomPosition,
        left: leftPosition,
        transform: 'translateX(-50%)'
      }}
    >
      {/* String - Curly dangling "floating" string attached to knot */}
      <svg
        className="absolute top-[90%] left-1/2 -translate-x-1/2 overflow-visible"
        width="50"
        height="80"
        style={{ pointerEvents: 'none' }}
      >
        <path
          d={
            (title.length % 2 === 0)
              ? "M 25 0 C 45 15, 5 30, 25 45 S 40 70, 25 80" 
              : "M 25 0 C 5 15, 45 30, 25 45 S 10 70, 25 80"
          }
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
      </svg>

      {/* Balloon Shape */}
      <button
        onClick={isUnlocked ? onClick : undefined}
        onMouseDown={() => isUnlocked && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => isUnlocked && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        disabled={!isUnlocked}
        className={`
          relative transition-all duration-200 group flex flex-col items-center
          ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
        `}
      >
        <div className="relative">
          {/* Main Balloon Body (Oval) */}
          <div 
            className={`
              w-[5.5rem] h-[6.5rem] flex items-center justify-center relative z-20
              transition-all duration-200
              ${isUnlocked ? color : 'bg-muted'}
              ${isCompleted ? 'ring-4 ring-success/30' : ''}
            `}
            style={{
              borderRadius: '50% 50% 50% 50% / 45% 45% 55% 55%', // Balloon shape
              boxShadow: isPressed && isUnlocked
                ? `0 2px 0 0 ${shadowColor}`
                : isUnlocked 
                  ? `0 6px 0 0 ${shadowColor}`
                  : 'none',
              transform: isPressed && isUnlocked ? 'translateY(4px) scale(0.98)' : 'translateY(0)',
            }}
          >
            {/* Icon - Centered in the upper part mainly */}
            <div className="pb-2">
              {isUnlocked ? (
                <Icon 
                  className="w-10 h-10 text-white"
                  strokeWidth={2.5} 
                />
              ) : (
                <Lock className="w-8 h-8 text-muted-foreground" strokeWidth={2.5} />
              )}
            </div>
            
            {/* Shine effect */}
            {isUnlocked && (
              <div 
                className="absolute top-3 left-4 w-6 h-10 bg-white/20 rounded-full -rotate-12 blur-[1px]" 
              />
            )}
          </div>

          {/* Bow / Knot - Enhanced */}
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
            style={{
              transform: isPressed && isUnlocked ? 'translate(-50%, 4px)' : 'translate(-50%, 0)',
              transition: 'transform 0.2s'
            }}
          >
             {/* The Knot */}
             <div className={`w-2 h-2 ${isUnlocked ? color : 'bg-muted'} rounded-full`} />
             {/* The Bow Loops */}
             <div className="relative -mt-1.5 flex">
                <div className={`w-3 h-3 ${isUnlocked ? color : 'bg-muted'} rounded-full rounded-br-none -rotate-45 -mr-1`} />
                <div className={`w-3 h-3 ${isUnlocked ? color : 'bg-muted'} rounded-full rounded-bl-none rotate-45 -ml-1`} />
             </div>
          </div>

          {/* Side indicator (Play/Done) */}
          {isUnlocked && !isCompleted && (
            <div className="absolute -right-3 top-1/2 -translate-y-[60%] w-9 h-9 bg-accent rounded-full flex items-center justify-center z-30"
              style={{ 
                boxShadow: '0 3px 0 0 hsl(186, 100%, 33%)' 
              }}>
              <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" strokeWidth={0} />
            </div>
          )}

          {isCompleted && (
            <div className="absolute -right-3 top-1/2 -translate-y-[60%] w-9 h-9 bg-success rounded-full flex items-center justify-center z-30 scale-bounce"
              style={{ 
                boxShadow: '0 3px 0 0 hsl(145, 60%, 35%)' 
              }}>
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Label below */}
        <div className="text-center mt-4 max-w-[100px] z-30 relative">
          <p className={`text-xs font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {title}
          </p>
        </div>
      </button>
    </div>
  );
}

export function BalloonView() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [completedBalloons, setCompletedBalloons] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load completed balloons from localStorage
    const completed = JSON.parse(localStorage.getItem("completedBalloons") || "[]");
    setCompletedBalloons(completed);
  }, []);

  const handleBalloonClick = (balloon: LessonBalloon) => {
    if (balloon.isUnlocked) {
      navigate("/quiz", { 
        state: { 
          balloonId: balloon.id, 
          balloonTitle: balloon.title 
        } 
      });
    }
  };

  const resetAllProgress = () => {
    localStorage.removeItem("completedBalloons");
    setCompletedBalloons([]);
    toast.success("All progress has been reset! 🔄");
  };

  const balloons: LessonBalloon[] = [
    // Top - Completed (green)
    {
      id: 1,
      title: "Safe or Not?",
      type: "story",
      icon: BookOpen,
      color: "bg-green-500",
      shadowColor: "hsl(145, 60%, 35%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(1),
      bottomPosition: "1800px",
      leftPosition: "50%",
    },
    
    // Level 2 - Available
    {
      id: 2,
      title: "What Are Drugs?",
      type: "quiz",
      icon: Brain,
      color: "bg-secondary",
      shadowColor: "hsl(210, 90%, 40%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(2),
      bottomPosition: "1650px",
      leftPosition: "20%",
    },
    
    // Level 3 - Available
    {
      id: 3,
      title: "Say No",
      type: "practice",
      icon: Shield,
      color: "bg-primary",
      shadowColor: "hsl(265, 75%, 40%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(3),
      bottomPosition: "1500px",
      leftPosition: "75%",
    },
    
    // Level 4 - Available
    {
      id: 4,
      title: "Trusted Adults",
      type: "lesson",
      icon: Users,
      color: "bg-warm",
      shadowColor: "hsl(340, 85%, 50%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(4),
      bottomPosition: "1350px",
      leftPosition: "50%",
    },
    
    // Level 5 - Available
    {
      id: 5,
      title: "Feelings",
      type: "story",
      icon: Heart,
      color: "bg-accent",
      shadowColor: "hsl(185, 85%, 35%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(5),
      bottomPosition: "1200px",
      leftPosition: "25%",
    },
    
    // Level 6 - Available
    {
      id: 6,
      title: "Safe Places",
      type: "quiz",
      icon: Star,
      color: "bg-warm",
      shadowColor: "hsl(340, 85%, 50%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(6),
      bottomPosition: "1050px",
      leftPosition: "70%",
    },
    
    // Level 7 - NEW
    {
      id: 7,
      title: "Who Can Help Me?",
      type: "lesson",
      icon: Users,
      color: "bg-secondary",
      shadowColor: "hsl(210, 90%, 40%)",
      isUnlocked: true,
      isCompleted: completedBalloons.includes(7),
      bottomPosition: "900px",
      leftPosition: "35%",
    },
    
    // Level 8 - NEW
    {
      id: 8,
      title: "Good Secrets vs Bad Secrets",
      type: "story",
      icon: BookOpen,
      color: "bg-primary",
      shadowColor: "hsl(265, 75%, 40%)",
      isUnlocked: false,
      isCompleted: completedBalloons.includes(8),
      bottomPosition: "750px",
      leftPosition: "65%",
    },
    
    // Level 9 - NEW
    {
      id: 9,
      title: "What Would You Do Next?",
      type: "quiz",
      icon: Brain,
      color: "bg-accent",
      shadowColor: "hsl(185, 85%, 35%)",
      isUnlocked: false,
      isCompleted: completedBalloons.includes(9),
      bottomPosition: "600px",
      leftPosition: "50%",
    },
    
    // Level 10 - NEW
    {
      id: 10,
      title: "Leaving Is Okay",
      type: "practice",
      icon: Shield,
      color: "bg-success",
      shadowColor: "hsl(145, 60%, 35%)",
      isUnlocked: false,
      isCompleted: completedBalloons.includes(10),
      bottomPosition: "450px",
      leftPosition: "20%",
    },
    
    // Level 11 - NEW
    {
      id: 11,
      title: "Listen to Your Body",
      type: "lesson",
      icon: Heart,
      color: "bg-warm",
      shadowColor: "hsl(340, 85%, 50%)",
      isUnlocked: false,
      isCompleted: completedBalloons.includes(11),
      bottomPosition: "300px",
      leftPosition: "75%",
    },
    
    // Level 12 - NEW
    {
      id: 12,
      title: "When Friends Ask You To…",
      type: "story",
      icon: Users,
      color: "bg-secondary",
      shadowColor: "hsl(210, 90%, 40%)",
      isUnlocked: false,
      isCompleted: completedBalloons.includes(12),
      bottomPosition: "150px",
      leftPosition: "40%",
    },
    
    // Level 13 - NEW (Bottom)
    {
      id: 13,
      title: "You're Not in Trouble",
      type: "quiz",
      icon: Star,
      color: "bg-primary",
      shadowColor: "hsl(265, 75%, 40%)",
      isUnlocked: false,
      isCompleted: completedBalloons.includes(13),
      bottomPosition: "0px",
      leftPosition: "65%",
    },
  ];

  return (
    <div className="relative w-full px-5" style={{ minHeight: '1900px', paddingBottom: '150px' }}>
      {/* Reset Progress Button - Fixed at bottom right near balloons */}
      <Button
        onClick={resetAllProgress}
        className="fixed bottom-32 right-5 z-30 rounded-full w-14 h-14 shadow-lg"
        variant="secondary"
        size="icon"
        title="Reset all progress"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>

      {/* Sky background - Fixed to cover entire screen */}
      <div 
        className="fixed inset-0 z-0 overflow-hidden"
        style={{ 
          background: 'linear-gradient(to bottom, #dbeafe, #eff6ff)', // Baby blue gradient
        }}
      >
        {/* Clouds - Image Assets with Parallax - Moving UP slowly (negative Y) */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(-${scrollY * 0.2}px)` }}>
          <img src="/illustrations/cloud.png" alt="" className="absolute top-10 left-[10%] w-24 opacity-90 animate-pulse" style={{ animationDuration: '4s' }} />
          <img src="/illustrations/cloud1.png" alt="" className="absolute top-[250px] right-[15%] w-32 opacity-80 animate-pulse" style={{ animationDuration: '6s' }} />
          <img src="/illustrations/cloud.png" alt="" className="absolute top-[500px] left-[20%] w-20 opacity-85" />
          <img src="/illustrations/cloud1.png" alt="" className="absolute top-[800px] right-[30%] w-28 opacity-80" />
          <img src="/illustrations/cloud.png" alt="" className="absolute top-[1100px] left-[15%] w-26 opacity-85" />
          <img src="/illustrations/cloud1.png" alt="" className="absolute top-[1400px] right-[10%] w-24 opacity-90" />
          <img src="/illustrations/cloud.png" alt="" className="absolute top-[1700px] left-[25%] w-28 opacity-85" />
        </div>
      </div>

      {/* Balloons spread vertically like roadmap */}
      {balloons.map((balloon) => (
        <Balloon
          key={balloon.id}
          {...balloon}
          onClick={() => handleBalloonClick(balloon)}
          className="z-10"
        />
      ))}

      {/* Bottom Illustration - On Top of Strings */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-0 pointer-events-none z-20">
        <img 
          src="/illustrations/undraw_among-nature_2f9e.svg" 
          alt="Nature Illustration" 
          className="w-full max-w-md opacity-60"
        />
      </div>
    </div>
  );
}
