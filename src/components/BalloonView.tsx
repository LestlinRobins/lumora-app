
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Users, Heart, BookOpen, Star, Brain, Lock, Play } from "lucide-react";

// ... (interfaces and Balloon component remain same)

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
  isNextBalloon?: boolean;
  shouldExplode?: boolean;
}

function Balloon({ 
  id,
  title, 
  icon: Icon, 
  color, 
  shadowColor,
  isUnlocked, 
  isCompleted, 
  bottomPosition,
  leftPosition,
  onClick,
  className,
  isNextBalloon,
  shouldExplode
}: BalloonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);

  // If currently exploding, we show the "Inflated" look but animating
  // If completed and (not exploding or already exploded), we show "Deflated"
  // If not completed, show "Inflated"

  const isExploding = shouldExplode && !hasExploded;
  const showDeflated = isCompleted && (!shouldExplode || hasExploded);

  return (
    <div 
      className={`absolute ${className || ''}`}
      data-balloon-id={id}
      style={{ 
        bottom: bottomPosition,
        left: leftPosition,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Purple halo for next balloon */}
      {isNextBalloon && !isCompleted && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          style={{
            width: '140px',
            height: '160px',
            background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse-halo 2s ease-in-out infinite',
          }}
        />
      )}
      
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
        onClick={isUnlocked && !isCompleted ? onClick : undefined}
        onMouseDown={() => isUnlocked && !isCompleted && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => isUnlocked && !isCompleted && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        disabled={!isUnlocked || isCompleted}
        className={`
          relative transition-all duration-500 group flex flex-col items-center
          ${isUnlocked && !isCompleted ? 'cursor-pointer' : 'cursor-not-allowed'}
          ${showDeflated ? 'opacity-70' : !isUnlocked ? 'opacity-60' : ''}
        `}
      >
        <div 
           className={`relative transition-transform duration-500 ${showDeflated ? 'scale-75' : ''} ${isExploding ? 'animate-balloon-pop' : ''}`}
           onAnimationEnd={() => {
             if (isExploding) setHasExploded(true);
           }}
        >
          {/* Main Balloon Body (Oval) - Deflated when completed */}
          <div 
            className={`
              flex items-center justify-center relative z-20
              transition-all duration-500
              ${showDeflated ? 'bg-gray-400' : isUnlocked ? color : 'bg-muted'}
            `}
            style={{
              width: showDeflated ? '4.5rem' : '5.5rem',
              height: showDeflated ? '5rem' : '6.5rem',
              borderRadius: showDeflated 
                ? '45% 45% 50% 50% / 40% 40% 60% 60%' // More deflated shape
                : '50% 50% 50% 50% / 45% 45% 55% 55%', // Normal balloon shape
              boxShadow: showDeflated
                ? '0 3px 0 0 hsl(0, 0%, 50%)'
                : isPressed && isUnlocked
                  ? `0 2px 0 0 ${shadowColor}`
                  : isUnlocked 
                    ? `0 6px 0 0 ${shadowColor}`
                    : 'none',
              transform: isPressed && isUnlocked && !isCompleted ? 'translateY(4px) scale(0.98)' : 'translateY(0)',
            }}
          >
            {/* Icon - Star for completed, normal icon otherwise */}
            <div className="pb-2">
              {showDeflated ? (
                <Star 
                  className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce-star"
                  strokeWidth={2} 
                />
              ) : isUnlocked ? (
                <Icon 
                  className="w-10 h-10 text-white"
                  strokeWidth={2.5} 
                />
              ) : (
                <Lock className="w-8 h-8 text-muted-foreground" strokeWidth={2.5} />
              )}
            </div>
            
            {/* Shine effect - dimmer when completed */}
            {isUnlocked && (
              <div 
                className={`absolute top-3 left-4 w-6 h-10 rounded-full -rotate-12 blur-[1px] transition-opacity duration-500 ${showDeflated ? 'bg-white/10' : 'bg-white/20'}`}
              />
            )}
            
            {/* Wrinkle lines for deflated balloon */}
            {showDeflated && (
              <>
                <div className="absolute top-6 left-3 w-3 h-[1px] bg-gray-500/30 rotate-[-20deg]" />
                <div className="absolute top-10 right-4 w-4 h-[1px] bg-gray-500/30 rotate-[15deg]" />
                <div className="absolute bottom-8 left-5 w-3 h-[1px] bg-gray-500/30 rotate-[-10deg]" />
              </>
            )}
          </div>

          {/* Bow / Knot - Enhanced */}
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
            style={{
              transform: isPressed && isUnlocked && !isCompleted ? 'translate(-50%, 4px)' : 'translate(-50%, 0)',
              transition: 'transform 0.2s'
            }}
          >
             {/* The Knot */}
             <div className={`w-2 h-2 ${showDeflated ? 'bg-gray-400' : isUnlocked ? color : 'bg-muted'} rounded-full`} />
             {/* The Bow Loops */}
             <div className="relative -mt-1.5 flex">
                <div className={`w-3 h-3 ${showDeflated ? 'bg-gray-400' : isUnlocked ? color : 'bg-muted'} rounded-full rounded-br-none -rotate-45 -mr-1`} />
                <div className={`w-3 h-3 ${showDeflated ? 'bg-gray-400' : isUnlocked ? color : 'bg-muted'} rounded-full rounded-bl-none rotate-45 -ml-1`} />
             </div>
          </div>

          {/* Side indicator (Play) - only for unlocked, not completed */}
          {isUnlocked && !isCompleted && (
            <div className="absolute -right-3 top-1/2 -translate-y-[60%] w-9 h-9 bg-accent rounded-full flex items-center justify-center z-30"
              style={{ 
                boxShadow: '0 3px 0 0 hsl(186, 100%, 33%)' 
              }}>
              <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" strokeWidth={0} />
            </div>
          )}
        </div>

        {/* Label below */}
        <div className="text-center mt-4 max-w-[100px] z-30 relative">
          <p className={`text-xs font-bold ${showDeflated ? 'text-gray-500' : isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {title}
          </p>
        </div>
      </button>
      
      {/* Exploding Shards - Only visible during explosion */}
      {isExploding && (
        <>
          {[...Array(8)].map((_, i) => (
             <div 
               key={i}
               className={`absolute top-1/2 left-1/2 w-3 h-3 ${color} rounded-sm`}
               style={{
                 animation: `shard-fly-${i} 0.4s ease-out forwards`,
                 zIndex: 30
               }}
             />
          ))}
        </>
      )}

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes pulse-halo {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.7;
          }
        }
        @keyframes bounce-star {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-bounce-star {
          animation: bounce-star 1.5s ease-in-out infinite;
        }
        @keyframes balloon-pop {
           0% { transform: scale(1); opacity: 1; }
           50% { transform: scale(1.2); opacity: 1; }
           100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-balloon-pop {
           animation: balloon-pop 0.3s ease-out forwards;
        }

        /* Shard Animations */
        @keyframes shard-fly-0 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-150%, -150%) scale(0.5); } }
        @keyframes shard-fly-1 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(50%, -150%) scale(0.5); } }
        @keyframes shard-fly-2 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(150%, -50%) scale(0.5); } }
        @keyframes shard-fly-3 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(50%, 50%) scale(0.5); } }
        @keyframes shard-fly-4 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, 150%) scale(0.5); } }
        @keyframes shard-fly-5 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-150%, 50%) scale(0.5); } }
        @keyframes shard-fly-6 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-120%, -100%) rotate(45deg) scale(0.5); } }
        @keyframes shard-fly-7 { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(120%, -20%) rotate(-45deg) scale(0.5); } }
      `}</style>
    </div>
  );
}

export function BalloonView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [completedBalloons, setCompletedBalloons] = useState<number[]>([]);
  const [justPoppedId, setJustPoppedId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load completed balloons from localStorage
    const completed = JSON.parse(localStorage.getItem("completedBalloons") || "[]");
    setCompletedBalloons(completed);

    // Check if we just completed a balloon
    if (location.state?.justCompleted) {
        setJustPoppedId(location.state.justCompleted);
        // Clear the state so it doesn't pop again on refresh/nav
        navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleBalloonClick = (balloon: LessonBalloon) => {
    if (balloon.isUnlocked && !balloon.isCompleted) {
      navigate("/quiz", { 
        state: { 
          balloonId: balloon.id, 
          balloonTitle: balloon.title 
        } 
      });
    }
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

  const nextBalloonId = balloons.find(
    (b) => b.isUnlocked && !completedBalloons.includes(b.id)
  )?.id;

  return (
    <div className="relative w-full px-5" style={{ minHeight: '1900px', paddingBottom: '150px', marginTop: '40px' }}>
      {/* Sky background - Fixed to cover entire screen */}
      <div 
        className="fixed inset-0 z-0 overflow-hidden"
        style={{ 
          background: 'linear-gradient(to bottom, #87b8f8ff, #eff6ff)', // Baby blue gradient
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
          isCompleted={completedBalloons.includes(balloon.id)}
          onClick={() => handleBalloonClick(balloon)}
          isNextBalloon={balloon.id === nextBalloonId}
          shouldExplode={balloon.id === justPoppedId}
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
