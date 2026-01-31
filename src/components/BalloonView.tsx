import { useState } from "react";
import { Shield, Users, Heart, BookOpen, Star, Brain, Lock, CheckCircle2, Play } from "lucide-react";

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
  onClick 
}: BalloonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div 
      className="absolute"
      style={{ 
        bottom: bottomPosition,
        left: leftPosition,
        transform: 'translateX(-50%)'
      }}
    >
      {/* String connecting to bottom - Curly/Wavy */}
      <svg
        className="absolute top-full left-1/2 -translate-x-1/2 overflow-visible"
        width="40"
        height={parseInt(bottomPosition) > 0 ? parseInt(bottomPosition) : 100}
        style={{ pointerEvents: 'none' }}
      >
        <path
          d={`M 20 0 Q ${20 + (Math.random() > 0.5 ? 15 : -15)} ${parseInt(bottomPosition) / 2} 20 ${bottomPosition}`}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.4"
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
  const balloons: LessonBalloon[] = [
    // Top - Completed (green)
    {
      id: 1,
      title: "Safe or Not?",
      type: "story",
      icon: BookOpen,
      color: "bg-success",
      shadowColor: "hsl(145, 60%, 35%)",
      isUnlocked: true,
      isCompleted: true,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
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
      isCompleted: false,
      bottomPosition: "0px",
      leftPosition: "65%",
    },
  ];

  return (
    <div className="relative w-full px-5" style={{ minHeight: '2100px', paddingBottom: '200px' }}>
      {/* Sky background - full page */}
      <div 
        className="absolute inset-0 -z-10 rounded-3xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(to bottom, hsl(200 100% 85%), hsl(200 100% 95%))'
        }}
      >
        {/* Clouds */}
        <div className="absolute top-20 left-[10%] w-24 h-12 bg-white/50 rounded-full blur-md animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[250px] right-[15%] w-32 h-14 bg-white/40 rounded-full blur-md animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[500px] left-[20%] w-20 h-10 bg-white/45 rounded-full blur-md" />
        <div className="absolute top-[800px] right-[30%] w-28 h-12 bg-white/35 rounded-full blur-md" />
        <div className="absolute top-[1100px] left-[15%] w-26 h-11 bg-white/38 rounded-full blur-md" />
        <div className="absolute top-[1400px] right-[10%] w-24 h-12 bg-white/42 rounded-full blur-md" />
        <div className="absolute top-[1700px] left-[25%] w-28 h-13 bg-white/36 rounded-full blur-md" />
      </div>

      {/* Balloons spread vertically like roadmap */}
      {balloons.map((balloon) => (
        <Balloon
          key={balloon.id}
          {...balloon}
          onClick={() => console.log(`Clicked: ${balloon.title}`)}
        />
      ))}

      {/* Bottom Illustration */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-10">
        <img 
          src="/illustrations/undraw_among-nature_2f9e.svg" 
          alt="Nature Illustration" 
          className="w-full max-w-sm opacity-90"
        />
      </div>
    </div>
  );
}
