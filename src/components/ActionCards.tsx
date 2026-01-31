import { useState } from "react";
import { Check, X, MessageCircle, Users, ChevronRight, Star } from "lucide-react";

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  shadowColor: string;
  iconBgColor: string;
  progress?: number;
  delay?: number;
  onClick?: () => void;
}

export function ActionCard({
  title,
  subtitle,
  icon,
  bgColor,
  shadowColor,
  iconBgColor,
  progress = 0,
  delay = 0,
  onClick,
}: ActionCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        w-full text-left p-4 rounded-2xl transition-all duration-150
        ${bgColor}
      `}
      style={{
        animation: `popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms forwards`,
        boxShadow: isPressed 
          ? `0 2px 0 0 ${shadowColor}` 
          : `0 4px 0 0 ${shadowColor}`,
        transform: isPressed ? "translateY(2px)" : "translateY(0)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div 
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBgColor}`}
          style={{ boxShadow: `inset 0 -2px 0 0 rgba(0,0,0,0.1)` }}
        >
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-card-foreground truncate">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium truncate">
            {subtitle}
          </p>
          
          {/* Progress bar */}
          {progress > 0 && (
            <div className="mt-2 h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground/30 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        <ChevronRight className="w-6 h-6 text-foreground/40 flex-shrink-0" />
      </div>
    </button>
  );
}

export function ActionCardList() {
  const cards = [
    {
      title: "Safe or Not?",
      subtitle: "Tap to spot safe situations",
      icon: (
        <div className="flex -space-x-1">
          <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
          <X className="w-5 h-5 text-primary-foreground opacity-60" strokeWidth={3} />
        </div>
      ),
      bgColor: "bg-card",
      shadowColor: "hsl(145, 65%, 35%)",
      iconBgColor: "bg-primary",
      progress: 40,
    },
    {
      title: "Practice Saying No",
      subtitle: "Learn confident responses",
      icon: <MessageCircle className="w-7 h-7 text-secondary-foreground" strokeWidth={2.5} />,
      bgColor: "bg-card",
      shadowColor: "hsl(210, 85%, 45%)",
      iconBgColor: "bg-secondary",
      progress: 20,
    },
    {
      title: "Trusted Adults",
      subtitle: "Who helps keep you safe",
      icon: <Users className="w-7 h-7 text-warm-foreground" strokeWidth={2.5} />,
      bgColor: "bg-card",
      shadowColor: "hsl(350, 80%, 55%)",
      iconBgColor: "bg-warm",
      progress: 0,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Today's Activities</h2>
        <div className="flex items-center gap-1 text-accent-foreground bg-accent/30 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold">25 XP</span>
        </div>
      </div>
      
      {/* Cards */}
      {cards.map((card, index) => (
        <ActionCard
          key={card.title}
          {...card}
          delay={index * 100}
          onClick={() => console.log(`Clicked: ${card.title}`)}
        />
      ))}
    </div>
  );
}
