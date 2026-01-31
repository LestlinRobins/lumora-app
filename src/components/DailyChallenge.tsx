import { Trophy, Target, Sparkles } from "lucide-react";

export function DailyChallenge() {
  return (
    <div 
      className="mx-5 p-4 rounded-2xl bg-gradient-to-r from-accent/40 to-accent/20 border-2 border-accent/50"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-yellow">
          <Target className="w-6 h-6 text-accent-foreground" strokeWidth={2.5} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-accent-foreground">Daily Goal</span>
            <Sparkles className="w-4 h-4 text-accent-foreground animate-pulse-soft" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Complete 2 activities today
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-accent-foreground">1/2</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-3 bg-card rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: "50%" }}
        />
      </div>
    </div>
  );
}

export function RewardBadge() {
  return (
    <div className="mx-5 mt-4 flex items-center gap-3 bg-warm/10 p-3 rounded-xl border border-warm/20">
      <div className="w-10 h-10 bg-warm/20 rounded-full flex items-center justify-center">
        <Trophy className="w-5 h-5 text-warm" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">You're doing great!</p>
        <p className="text-xs text-muted-foreground">Keep learning to unlock new badges</p>
      </div>
      <span className="text-2xl">🌟</span>
    </div>
  );
}
