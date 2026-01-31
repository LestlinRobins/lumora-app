import { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";
import { getCarrots, onCarrotsChanged } from "@/lib/carrots";

interface HeaderProps {
  title?: string;
  coins?: number;
}

export function Header({ 
  title = "Lumora", 
  coins
}: HeaderProps) {
  const [carrots, setCarrots] = useState<number>(() => getCarrots());

  useEffect(() => {
    setCarrots(getCarrots());
    return onCarrotsChanged(setCarrots);
  }, []);

  const displayCoins = useMemo(() => {
    return typeof coins === "number" ? coins : carrots;
  }, [coins, carrots]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 pb-3 px-5 bg-card border-b-2 border-border">
      <div className="flex items-center justify-between">
        {/* App name on the left */}
        <h1 className="text-xl font-extrabold text-primary tracking-tight">
          Nest
        </h1>
        
        {/* Right side: Coins + Profile */}
        <div className="flex items-center gap-3">
          {/* Carrots */}
          <div 
            data-carrot-target
            className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full border-2 border-accent/40"
          >
            <span className="text-base">🥕</span>
            <span className="text-sm font-extrabold text-foreground">{displayCoins}</span>
          </div>
          
          {/* Profile icon */}
          <button className="w-9 h-9 bg-primary rounded-full flex items-center justify-center btn-bouncy"
            style={{ boxShadow: 'var(--shadow-button-primary)' }}>
            <User className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
