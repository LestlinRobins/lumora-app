import { User } from "lucide-react";

interface HeaderProps {
  title?: string;
  coins?: number;
}

export function Header({ 
  title = "Lumora", 
  coins = 50 
}: HeaderProps) {
  return (
    <header className="relative pt-4 pb-3 px-5 bg-card border-b-2 border-border">
      <div className="flex items-center justify-between">
        {/* App name on the left */}
        <h1 className="text-xl font-extrabold text-primary tracking-tight">
          {title}
        </h1>
        
        {/* Gold coins in center */}
        <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full border-2 border-accent/40">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-black"
            style={{ boxShadow: 'var(--shadow-button-accent)' }}>
            🪙
          </div>
          <span className="text-sm font-extrabold text-foreground">{coins}</span>
        </div>
        
        {/* Profile icon on the right */}
        <button className="w-9 h-9 bg-primary rounded-full flex items-center justify-center btn-bouncy"
          style={{ boxShadow: 'var(--shadow-button-primary)' }}>
          <User className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
