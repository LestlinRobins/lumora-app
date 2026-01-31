import { BottomNav, TabId } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, ChevronRight, Plus, Sparkles, BookOpen, Award, Crown, Target, Users, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Achievement {
  id: number;
  icon: React.ElementType;
  name: string;
  color: string;
  earned: boolean;
  size?: 'small' | 'large';
}

interface TrustedPerson {
  id: number;
  name: string;
  role: string;
  icon: React.ElementType;
  color: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [level] = useState(3);
  const [progressPoints] = useState(1240);
  const [nextLevelPoints] = useState(1500);
  
  const achievements: Achievement[] = [
    { id: 1, icon: Sparkles, name: "First Steps", color: "hsl(265 75% 60%)", earned: true, size: 'large' },
    { id: 2, icon: BookOpen, name: "Knowledge", color: "hsl(210 90% 60%)", earned: true, size: 'small' },
    { id: 3, icon: Shield, name: "Protected", color: "hsl(185 85% 55%)", earned: true, size: 'small' },
    { id: 4, icon: Target, name: "Focused", color: "hsl(280 70% 65%)", earned: false, size: 'small' },
    { id: 5, icon: Crown, name: "Champion", color: "hsl(340 85% 70%)", earned: false, size: 'large' },
  ];

  const guardians: TrustedPerson[] = [
    { id: 1, name: "Mom", role: "Parent", icon: Users, color: "hsl(340 85% 70%)" },
    { id: 2, name: "Mr. Johnson", role: "Teacher", icon: Users, color: "hsl(210 90% 60%)" },
  ];

  const handleTabChange = (tab: TabId) => {
    if (tab !== "profile") {
      navigate("/");
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const progressPercentage = Math.round((progressPoints / nextLevelPoints) * 100);

  return (
    <div className="min-h-screen bg-[#FAFBFC] relative overflow-hidden">
      {/* Architectural grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(265 75% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(265 75% 60%) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <main className="pb-28 pt-6 px-5 relative z-10">
        {/* Clean Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground font-semibold mt-1">Track your progress</p>
          </div>
          <button
            onClick={() => console.log('Settings')}
            className="w-11 h-11 bg-card rounded-xl flex items-center justify-center border-2 border-border transition-all hover:bg-muted"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <Settings className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-6 mb-6 border-2 border-border relative overflow-hidden"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          
          {/* Accent shape */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/10 rounded-full" />
          
          <div className="relative flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center"
                style={{ boxShadow: "0 6px 16px hsl(265 75% 60% / 0.25)" }}>
                <Shield className="w-10 h-10 text-primary-foreground" strokeWidth={2.5} />
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-accent rounded-lg flex items-center justify-center border-2 border-card"
                style={{ boxShadow: "0 2px 8px hsl(185 85% 55% / 0.3)" }}>
                <span className="text-xs font-black text-accent-foreground">{level}</span>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-foreground mb-1">SafetyHero</h2>
              <p className="text-sm text-muted-foreground font-semibold">Level {level} Guardian</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Progress to Level {level + 1}</span>
              <span className="text-xs font-bold text-primary">{progressPoints} / {nextLevelPoints}</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <p className="text-[11px] text-muted-foreground font-semibold mt-2">
              {nextLevelPoints - progressPoints} points to next level
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-foreground">Achievements</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {earnedCount} / {achievements.length}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-card border-2' 
                        : 'bg-muted border-2 border-transparent opacity-40'
                    }`}
                    style={{
                      borderColor: achievement.earned ? achievement.color : 'transparent',
                      boxShadow: achievement.earned ? `0 4px 12px ${achievement.color}40` : 'none',
                    }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: achievement.earned ? achievement.color : 'hsl(var(--muted-foreground))' }}
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className={`text-[9px] font-bold text-center leading-tight ${
                    achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trusted People */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-foreground">Trusted People</h3>
            <span className="text-xs font-semibold text-muted-foreground">{guardians.length} people</span>
          </div>

          <div className="space-y-3">
            {guardians.map((guardian) => {
              const Icon = guardian.icon;
              return (
                <div
                  key={guardian.id}
                  className="bg-card rounded-2xl p-4 border-2 border-border flex items-center gap-3"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: guardian.color }}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-foreground truncate">{guardian.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{guardian.role}</p>
                  </div>

                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-success" strokeWidth={2.5} />
                  </div>
                </div>
              );
            })}

            {/* Add button */}
            <button
              onClick={() => console.log('Add trusted person')}
              className="w-full bg-secondary/10 rounded-2xl p-4 border-2 border-dashed border-secondary/40 flex items-center justify-center gap-2.5 transition-all hover:bg-secondary/15 active:scale-[0.98]"
            >
              <div className="w-9 h-9 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-secondary" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-secondary">Add Trusted Person</span>
            </button>
          </div>
        </div>

        {/* Settings */}
        <button
          onClick={() => console.log('Settings')}
          className="w-full bg-card rounded-2xl px-4 py-4 border-2 border-border flex items-center justify-between transition-all hover:bg-muted active:scale-[0.99]"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-foreground">Settings & Preferences</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
        </button>
      </main>
      
      <BottomNav activeTab="profile" onTabChange={handleTabChange} />
    </div>
  );
}
