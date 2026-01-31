import { Home, BookOpen, Dumbbell, Heart } from "lucide-react";
import { useState } from "react";

type TabId = "home" | "learn" | "practice" | "support";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Dumbbell },
  { id: "support", label: "Support", icon: Heart },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border px-4 pb-6 pt-3 safe-area-bottom backdrop-blur-lg bg-card/95"
      style={{ boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)' }}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                nav-pill flex-1 max-w-20 relative
                ${isActive 
                  ? "nav-pill-active text-primary" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <div className={`
                p-2.5 rounded-2xl transition-all duration-300
                ${isActive ? "bg-primary scale-110" : "hover:bg-muted"}
              `}
                style={isActive ? { boxShadow: 'var(--shadow-button-primary)' } : {}}>
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${isActive ? "text-primary-foreground scale-110" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-xs font-semibold mt-1 transition-all duration-200 ${isActive ? "font-extrabold scale-105" : ""}`}>
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full pulse-glow" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { TabId };
