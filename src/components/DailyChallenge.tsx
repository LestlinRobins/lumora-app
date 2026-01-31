import { Trophy, Target, Sparkles, Award } from "lucide-react";

export function DailyChallenge() {
  return (
    <div 
      className="mx-5 p-5 rounded-[1.75rem] bg-primary/15 border-2 border-primary/30 pop-in relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/15 rounded-full blur-2xl" />
      
      <div className="relative flex items-center gap-4">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center relative"
          style={{ boxShadow: 'var(--shadow-button-primary)' }}>
          <Target className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
          <div className="absolute -top-1 -right-1 scale-bounce">
            <Sparkles className="w-5 h-5 text-accent fill-accent" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-foreground">Today's Goal</span>
            <div className="pulse-glow">
              <span className="text-lg">🎯</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-semibold mt-0.5">
            Complete 2 learning activities
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-primary">1/2</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="relative mt-4 h-3.5 bg-card rounded-full overflow-hidden border-2 border-primary/20">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-700 relative"
          style={{ width: "50%" }}
        >
          {/* Shine effect on progress bar */}
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RewardBadge() {
  return (
    <div className="mx-5 mt-4 flex items-center gap-3 bg-warm/15 p-4 rounded-2xl border-2 border-warm/30 slide-up">
      <div className="w-12 h-12 bg-warm rounded-full flex items-center justify-center relative"
        style={{ boxShadow: 'var(--shadow-warm)' }}>
        <Award className="w-6 h-6 text-warm-foreground" strokeWidth={2.5} />
        <div className="absolute inset-0 bg-white/20 rounded-full" />
      </div>
      <div className="flex-1">
        <p className="text-base font-extrabold text-foreground">You're doing amazing!</p>
        <p className="text-sm text-muted-foreground font-semibold">Keep learning to unlock new badges</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl rotate-bounce" style={{ display: 'inline-block' }}>🌟</span>
        <span className="text-xs font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded-full">+5 XP</span>
      </div>
    </div>
  );
}
