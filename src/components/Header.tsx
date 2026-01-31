interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ 
  title = "Lumora", 
  subtitle = "Learn to stay safe and make smart choices!" 
}: HeaderProps) {
  return (
    <header className="relative pt-6 pb-4 px-5 bg-primary/10">
      {/* Decorative floating circles */}
      <div className="absolute top-2 right-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />
      <div className="absolute top-8 right-12 w-12 h-12 bg-secondary/15 rounded-full blur-xl float" />
      
      <div className="relative flex items-center gap-4">
        {/* Mascot container - Friendly Shield Character */}
        <div className="float">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center relative"
            style={{ boxShadow: 'var(--shadow-button-primary)' }}>
            <span className="text-3xl">🛡️</span>
            {/* Sparkle effect */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center pulse-glow">
              <span className="text-xs">✨</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-sm font-semibold text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Streak indicator (gamification element) */}
      <div className="mt-4 flex items-center gap-2 bg-accent/25 w-fit px-4 py-2 rounded-full border-2 border-accent/40 bounce-in">
        <span className="text-xl wiggle" style={{ display: 'inline-block' }}>🔥</span>
        <span className="text-sm font-bold text-foreground">3 day streak!</span>
        <span className="text-xs font-semibold text-accent-foreground bg-accent px-2 py-0.5 rounded-full">Keep going!</span>
      </div>
    </header>
  );
}
