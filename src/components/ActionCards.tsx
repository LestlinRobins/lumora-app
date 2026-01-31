import { useState } from "react";
import { Shield, MessageCircle, Users, Star, Brain, Heart, BookOpen, Lock, CheckCircle2, Play } from "lucide-react";

interface LessonNode {
  id: number;
  title: string;
  type: "story" | "quiz" | "practice" | "lesson";
  icon: React.ReactNode;
  color: string;
  shadowColor: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  position: "left" | "center" | "right";
}

interface LessonNodeProps extends LessonNode {
  onClick?: () => void;
}

function LessonCircle({ 
  title, 
  type, 
  icon, 
  color, 
  shadowColor, 
  isUnlocked, 
  isCompleted,
  position,
  onClick 
}: LessonNodeProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const positionClass = {
    left: "mr-auto ml-8",
    center: "mx-auto",
    right: "ml-auto mr-8"
  }[position];

  return (
    <div className={`relative ${positionClass} w-fit`}>
      <button
        onClick={isUnlocked ? onClick : undefined}
        onMouseDown={() => isUnlocked && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => isUnlocked && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        disabled={!isUnlocked}
        className={`
          relative flex flex-col items-center gap-2 transition-all duration-200
          ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
        `}
      >
        {/* Main lesson circle */}
        <div 
          className={`
            w-20 h-20 rounded-full flex items-center justify-center relative
            transition-all duration-200
            ${isUnlocked ? color : 'bg-muted'}
            ${isCompleted ? 'ring-4 ring-success/30' : ''}
          `}
          style={{
            boxShadow: isPressed && isUnlocked
              ? `0 2px 0 0 ${shadowColor}`
              : isUnlocked 
                ? `0 6px 0 0 ${shadowColor}`
                : 'none',
            transform: isPressed && isUnlocked ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          {/* Icon or lock */}
          {isUnlocked ? (
            <div className="relative">
              {icon}
              {/* Completion checkmark */}
              {isCompleted && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white scale-bounce">
                  <CheckCircle2 className="w-4 h-4 text-success-foreground" strokeWidth={3} />
                </div>
              )}
            </div>
          ) : (
            <Lock className="w-8 h-8 text-muted-foreground" strokeWidth={2.5} />
          )}
          
          {/* Shine effect */}
          {isUnlocked && (
            <div className="absolute inset-0 bg-white/20 rounded-full" />
          )}
        </div>

        {/* Lesson title */}
        <div className="text-center max-w-[100px]">
          <p className={`text-xs font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {title}
          </p>
          {type && isUnlocked && (
            <p className="text-[10px] font-semibold text-muted-foreground capitalize mt-0.5">
              {type}
            </p>
          )}
        </div>

        {/* Play indicator for active lesson */}
        {isUnlocked && !isCompleted && (
          <div className="absolute -right-2 top-6 w-8 h-8 bg-accent rounded-full flex items-center justify-center pulse-glow"
            style={{ boxShadow: 'var(--shadow-button-accent)' }}>
            <Play className="w-4 h-4 text-accent-foreground fill-current ml-0.5" strokeWidth={0} />
          </div>
        )}
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
  // Calculate positions for the path
  const positions = {
    left: 80,    // 32px margin + 40px (half of circle)
    center: 150, // Center of container (assuming ~300px width)
    right: 220,  // Right side
  };

  const startX = positions[fromPosition];
  const endX = positions[toPosition];
  const height = 48; // Height of the connector

  // Create a smooth curved path
  const controlPointOffset = 30;
  const path = `M ${startX} 0 Q ${startX} ${controlPointOffset}, ${(startX + endX) / 2} ${height / 2} T ${endX} ${height}`;

  return (
    <div className="relative w-full h-12 overflow-visible">
      <svg 
        className="absolute top-0 left-0 w-full h-full overflow-visible" 
        style={{ minWidth: '300px' }}
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
      >
        {/* Dotted path for visual guide */}
        <path
          d={path}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          strokeDasharray="6 4"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

export function ActionCardList() {
  const lessons: LessonNode[] = [
    {
      id: 1,
      title: "Safe or Not Safe?",
      type: "story",
      icon: <BookOpen className="w-9 h-9 text-primary-foreground" strokeWidth={2.5} />,
      color: "bg-primary",
      shadowColor: "hsl(265, 75%, 45%)",
      isUnlocked: true,
      isCompleted: true,
      position: "center",
    },
    {
      id: 2,
      title: "What Are Drugs?",
      type: "quiz",
      icon: <Brain className="w-9 h-9 text-secondary-foreground" strokeWidth={2.5} />,
      color: "bg-secondary",
      shadowColor: "hsl(210, 90%, 45%)",
      isUnlocked: true,
      isCompleted: false,
      position: "left",
    },
    {
      id: 3,
      title: "Say No Practice",
      type: "practice",
      icon: <Shield className="w-9 h-9 text-accent-foreground" strokeWidth={2.5} />,
      color: "bg-accent",
      shadowColor: "hsl(185, 85%, 40%)",
      isUnlocked: true,
      isCompleted: false,
      position: "right",
    },
    {
      id: 4,
      title: "Trusted Adults",
      type: "lesson",
      icon: <Users className="w-9 h-9 text-warm-foreground" strokeWidth={2.5} />,
      color: "bg-warm",
      shadowColor: "hsl(340, 85%, 55%)",
      isUnlocked: false,
      isCompleted: false,
      position: "center",
    },
    {
      id: 5,
      title: "Feelings Check",
      type: "story",
      icon: <Heart className="w-9 h-9 text-success-foreground" strokeWidth={2.5} />,
      color: "bg-success",
      shadowColor: "hsl(145, 60%, 40%)",
      isUnlocked: false,
      isCompleted: false,
      position: "left",
    },
    {
      id: 6,
      title: "Safety Quiz",
      type: "quiz",
      icon: <Star className="w-9 h-9 text-primary-foreground" strokeWidth={2.5} />,
      color: "bg-primary",
      shadowColor: "hsl(265, 75%, 45%)",
      isUnlocked: false,
      isCompleted: false,
      position: "right",
    },
  ];

  return (
    <div className="px-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-foreground">Learning Path</h2>
        <div className="flex items-center gap-1.5 text-accent-foreground bg-accent px-3 py-1.5 rounded-full border-2 border-accent/30 scale-bounce">
          <Star className="w-5 h-5 fill-current" />
          <span className="text-sm font-bold">35 XP</span>
        </div>
      </div>
      
      {/* Roadmap - Fixed height to prevent navbar jumping */}
      <div className="relative py-4" style={{ minHeight: '600px' }}>
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="pop-in" style={{ animationDelay: `${index * 100}ms` }}>
            <LessonCircle
              {...lesson}
              onClick={() => console.log(`Clicked: ${lesson.title}`)}
            />
            {index < lessons.length - 1 && (
              <PathConnector 
                fromPosition={lesson.position} 
                toPosition={lessons[index + 1].position} 
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 p-4 bg-muted/50 rounded-2xl border-2 border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-foreground">Your Progress</span>
          <span className="text-sm font-extrabold text-primary">1/6 Complete</span>
        </div>
        <div className="h-2.5 bg-card rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: "16.67%" }}
          />
        </div>
      </div>
    </div>
  );
}
