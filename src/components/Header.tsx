interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ 
  title = "Sensei", 
  subtitle = "Let's practice making safe choices!" 
}: HeaderProps) {
  return (
    <header className="relative pt-6 pb-4 px-5 bg-gradient-to-b from-primary/10 to-transparent">
      {/* Decorative circles */}
      <div className="absolute top-2 right-4 w-16 h-16 bg-accent/30 rounded-full blur-xl" />
      <div className="absolute top-8 right-12 w-8 h-8 bg-secondary/20 rounded-full blur-lg" />
      
      <div className="relative flex items-center gap-4">
        {/* Mascot container */}
        <div className="float">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-button">
            <span className="text-2xl">🛡️</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Streak indicator (gamification element) */}
      <div className="mt-4 flex items-center gap-2 bg-accent/20 w-fit px-3 py-1.5 rounded-full">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-bold text-accent-foreground">3 day streak!</span>
      </div>
    </header>
  );
}
