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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border px-4 pb-6 pt-2 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                nav-pill flex-1 max-w-20
                ${isActive 
                  ? "nav-pill-active text-primary" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <div className={`
                p-2 rounded-xl transition-all duration-200
                ${isActive ? "bg-primary/15" : ""}
              `}>
                <Icon 
                  className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-xs font-semibold ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { TabId };
