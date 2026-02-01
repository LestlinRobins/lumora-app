import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCarrots, onCarrotsChanged } from "@/lib/carrots";
import { hapticLight } from "@/lib/haptics";


interface HeaderProps {
  title?: string;
  coins?: number;
}

export function Header({ 
  title = "Lumora", 
  coins
}: HeaderProps) {
  const navigate = useNavigate();
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
        {/* App name with logo on the left */}
        <div className="flex items-center gap-2">
          <img src="/nest.jpeg" alt="Nest" className="w-8 h-8 rounded-full object-cover" />
          <h1 className="text-xl font-extrabold text-primary tracking-tight">
            Nest
          </h1>
        </div>
        
        {/* Right side: Carrots (clickable) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-carrot-target
            onClick={() => {
              hapticLight();
              navigate("/carrots");
            }}
            className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full border-2 border-accent/40 hover:bg-accent/25 transition-colors"
            aria-label="Open carrots"
            title="Carrots"
          >
            <span className="text-base">🥕</span>
            <span className="text-sm font-extrabold text-foreground">{displayCoins}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
