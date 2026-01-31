import { BottomNav, TabId } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, ChevronRight, Plus, BookOpen, Award, Crown, Target, Users, TrendingUp, Zap, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Achievement {
  id: number;
  icon: React.ElementType;
  name: string;
  description: string;
  progress?: number;
  earned: boolean;
  color: string;
}

interface TrustedPerson {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [level] = useState(3);
  const [progressPoints] = useState(1240);
  const [nextLevelPoints] = useState(1500);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [scratchedAchievements, setScratchedAchievements] = useState<Set<number>>(new Set());
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [paintSplashes, setPaintSplashes] = useState<Array<{id: number; x: number; y: number}>>([]);
  
  // Animated number counter
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = progressPoints / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= progressPoints) {
        setAnimatedPoints(progressPoints);
        clearInterval(timer);
      } else {
        setAnimatedPoints(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [progressPoints]);
  
  const achievements: Achievement[] = [
    { id: 1, icon: Star, name: "First Steps", description: "Begin your safety journey", earned: true, color: "#fbbf24" },
    { id: 2, icon: BookOpen, name: "Knowledge Seeker", description: "Complete 5 learning modules", earned: true, color: "#60a5fa" },
    { id: 3, icon: Shield, name: "Protected", description: "Set up your trust network", earned: true, color: "#34d399" },
    { id: 4, icon: Target, name: "Stay Focused", description: "7 day streak", progress: 65, earned: false, color: "#f472b6" },
    { id: 5, icon: Crown, name: "Safety Champion", description: "Master all lessons", progress: 40, earned: false, color: "#a78bfa" },
    { id: 6, icon: Zap, name: "Quick Learner", description: "Complete in record time", progress: 0, earned: false, color: "#fb923c" },
  ];

  const guardians: TrustedPerson[] = [
    { id: 1, name: "Mom", role: "Parent", initials: "M", color: "#ec4899" },
    { id: 2, name: "Mr. Johnson", role: "Teacher", initials: "MJ", color: "#3b82f6" },
  ];

  const handleTabChange = (tab: TabId) => {
    if (tab !== "profile") {
      navigate("/");
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const progressPercentage = Math.round((progressPoints / nextLevelPoints) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50/50 to-fuchsia-50/30 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a855f7 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Fluid animated gradient blobs */}
      <div className="absolute top-20 -right-20 w-80 h-80 bg-purple-300/20 blur-3xl" 
        style={{ 
          animation: 'morph 12s ease-in-out infinite, float 8s ease-in-out infinite',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
        }} />
      <div className="absolute bottom-40 -left-20 w-96 h-96 bg-violet-300/15 blur-3xl" 
        style={{ 
          animation: 'morph 15s ease-in-out infinite reverse, float 10s ease-in-out infinite 1s',
          borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%'
        }} />
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-fuchsia-300/10 blur-3xl" 
        style={{ 
          animation: 'morph 10s ease-in-out infinite, float 7s ease-in-out infinite 2s',
          borderRadius: '70% 30% 50% 50% / 60% 40% 60% 40%'
        }} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes paintSplash {
          0% { 
            clip-path: circle(0% at 50% 50%);
            transform: scale(0.8) rotate(-5deg);
            opacity: 0;
          }
          50% {
            clip-path: circle(60% at 50% 50%);
            transform: scale(1.1) rotate(2deg);
          }
          100% { 
            clip-path: circle(100% at 50% 50%);
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes sketchDraw {
          0% { 
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          100% { 
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes stickerPeel {
          0% {
            transform: perspective(400px) rotateX(0deg);
            box-shadow: 0 0 0 rgba(0,0,0,0);
          }
          50% {
            transform: perspective(400px) rotateX(10deg) translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          100% {
            transform: perspective(400px) rotateX(0deg);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
        }
        @keyframes cardFlip {
          0% { transform: perspective(600px) rotateY(0deg); }
          100% { transform: perspective(600px) rotateY(180deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes stamp {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes paperTexture {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
        @keyframes crayonStroke {
          0% { 
            width: 0%;
            opacity: 0;
          }
          100% { 
            width: 100%;
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scratchReveal {
          0% { opacity: 1; clip-path: inset(0 0 0 0); }
          100% { opacity: 0; clip-path: inset(0 0 100% 0); }
        }
      ` }} />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-40 blur-sm"
        style={{ animation: 'floatSoft 6s ease-in-out infinite' }} />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-violet-400 rounded-full opacity-30 blur-sm"
        style={{ animation: 'floatSoft 8s ease-in-out infinite 1s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-fuchsia-400 rounded-full opacity-35 blur-sm"
        style={{ animation: 'floatSoft 7s ease-in-out infinite 2s' }} />
      
      {/* Particle system */}
      {paintSplashes.map((splash) => (
        <div
          key={particle.id}
          className="fixed w-3 h-3 rounded-full pointer-events-none z-50"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            boxShadow: `0 0 20px ${particle.color}`,
            animation: 'particle-float 2s ease-out forwards',
            '--tx': `${Math.random() * 200 - 100}px`,
            '--ty': `${Math.random() * -200 - 100}px`,
          } as React.CSSProperties}
        />
      ))}
      
      <main className="pb-28 pt-6 px-4 max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6" style={{ animation: 'paintSplash 0.8s ease-out' }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {/* Hand-drawn badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white mb-3 relative"
                style={{ 
                  animation: 'stamp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  boxShadow: '0 2px 8px rgba(168,85,247,0.15), inset 0 -2px 0 rgba(168,85,247,0.1)',
                  border: '3px solid #a855f7',
                  borderRadius: '50% 45% 55% 50%',
                  transform: 'rotate(-2deg)'
                }}>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />
                <span className="text-sm font-black text-purple-600 tracking-wide" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>Level {level}</span>
                {/* Stamp circles */}
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-purple-600" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1" style={{ textShadow: '2px 2px 0 rgba(168,85,247,0.1)' }}>
                SafetyHero
              </h1>
              <p className="text-sm text-slate-500 font-medium">Guardian in Training</p>
            </div>
            <button
              onClick={() => console.log('Settings')}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{ 
                boxShadow: "0 4px 12px rgba(168,85,247,0.15)",
                border: '2px solid #e9d5ff',
                transform: 'rotate(3deg)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(-3deg) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(3deg) scale(1)'}
            >
              <Settings className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </button>
          </div>

          {/* Hero Collectible Card */}
          <div className="bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 rounded-3xl p-6 mb-5 relative overflow-hidden"
            style={{ 
              animation: 'stickerPeel 1s ease-out',
              boxShadow: "0 8px 24px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
              border: '4px solid white',
              transform: 'rotate(-0.5deg)'
            }}>
            {/* Corner decorations - like collectible cards */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-white/40 rounded-tl-xl" />
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-white/40 rounded-tr-xl" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-white/40 rounded-bl-xl" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-white/40 rounded-br-xl" />
            
            {/* Watercolor effect */}
            <div className="absolute inset-0 rounded-3xl" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
              mixBlendMode: 'overlay'
            }} />
            
            <div className="relative flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center"
                style={{ 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  border: '3px solid rgba(255,255,255,0.5)',
                  animation: 'wiggle 2s ease-in-out infinite'
                }}>
                <Shield className="w-9 h-9 text-purple-600" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-xs font-medium mb-1">Total Points</p>
                <p className="text-white text-3xl font-bold tabular-nums">
                  {animatedPoints.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Progress Bar with crayon effect */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-xs font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Next Level</span>
                <span className="text-white text-sm font-black px-2 py-0.5 bg-white/20 rounded-full" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm relative"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                <div 
                  className="h-full bg-white rounded-full relative"
                  style={{ 
                    width: `${progressPercentage}%`,
                    boxShadow: '0 2px 8px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.8)',
                    animation: 'crayonStroke 1.5s ease-out forwards'
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    style={{ 
                      animation: 'shimmer 2s linear infinite',
                      backgroundSize: '200% 100%'
                    }} />
                </div>
              </div>
              <p className="text-white/70 text-xs mt-1.5 font-semibold">
                {nextLevelPoints - progressPoints} points to go!
              </p>
            </div>
          </div>

          {/* Stats Stickers */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-2xl p-4 relative"
              style={{ 
                boxShadow: "0 4px 12px rgba(168,85,247,0.15), inset 0 -2px 0 rgba(168,85,247,0.05)",
                animation: 'stickerPeel 0.8s ease-out 0.2s both',
                border: '3px solid #f3e8ff',
                transform: 'rotate(1deg)'
              }}>
              {/* Sticker shine */}
              <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-white/60 to-transparent rounded-full" />
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mb-3"
                style={{ 
                  border: '2px solid #e9d5ff',
                  animation: 'bounce 2s ease-in-out infinite'
                }}>
                <TrendingUp className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
              </div>
              <p className="text-slate-900 text-2xl font-black mb-0.5">{earnedCount}</p>
              <p className="text-slate-500 text-xs font-bold">Completed</p>
            </div>
            <div className="bg-white rounded-2xl p-4 relative"
              style={{ 
                boxShadow: "0 4px 12px rgba(168,85,247,0.15), inset 0 -2px 0 rgba(168,85,247,0.05)",
                animation: 'stickerPeel 0.8s ease-out 0.3s both',
                border: '3px solid #fae8ff',
                transform: 'rotate(-1deg)'
              }}>
              {/* Sticker shine */}
              <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-br from-white/60 to-transparent rounded-full" />
              <div className="w-11 h-11 bg-fuchsia-100 rounded-xl flex items-center justify-center mb-3"
                style={{ 
                  border: '2px solid #fae8ff',
                  animation: 'bounce 2s ease-in-out infinite 0.3s'
                }}>
                <Award className="w-6 h-6 text-fuchsia-600" strokeWidth={2.5} />
              </div>
              <p className="text-slate-900 text-2xl font-black mb-0.5">{achievements.length - earnedCount}</p>
              <p className="text-slate-500 text-xs font-bold">In Progress</p>
            </div>
          </div>

        </div>

        {/* Achievements - Trading Cards Collection */}
        <div className="mb-5" style={{ animation: 'paintSplash 1s ease-out 0.4s both' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900" style={{ textShadow: '2px 2px 0 rgba(168,85,247,0.1)' }}>Achievement Cards</h2>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border-2 border-purple-200"
              style={{ animation: 'wiggle 3s ease-in-out infinite', transform: 'rotate(-1deg)' }}>
              <Sparkles className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-black text-purple-600">{earnedCount} / {achievements.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progressBar = achievement.progress !== undefined;
              const isScratched = scratchedAchievements.has(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className="bg-white rounded-2xl p-4 relative overflow-hidden"
                  style={{ 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08), inset 0 -2px 0 rgba(168,85,247,0.05)",
                    animation: `stickerPeel 0.6s ease-out ${0.5 + index * 0.1}s both`,
                    border: `3px solid ${achievement.earned ? achievement.color + '40' : '#e2e8f0'}`,
                    transform: index % 2 === 0 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)'
                  }}
                  onClick={(e) => {
                    if (!achievement.earned && !isScratched) {
                      setScratchedAchievements(prev => new Set([...prev, achievement.id]));
                      setPaintSplashes(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
                      setTimeout(() => setPaintSplashes(prev => prev.slice(1)), 800);
                    }
                  }}
                >
                  {/* Card corner notch like trading cards */}
                  {achievement.earned && (
                    <div className="absolute top-0 right-0 w-0 h-0" style={{
                      borderLeft: '16px solid transparent',
                      borderTop: `16px solid ${achievement.color}`,
                    }} />
                  )}
                  
                  {/* Sticker shine effect */}
                  {achievement.earned && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-white/40 to-transparent rounded-full"
                      style={{ animation: 'shimmer 3s ease-in-out infinite' }} />
                  )}
                  
                  <div className="flex items-start gap-3 relative">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                      style={{
                        backgroundColor: achievement.earned ? `${achievement.color}20` : '#f8fafc',
                        border: `3px solid ${achievement.earned ? achievement.color : '#cbd5e1'}`,
                        animation: achievement.earned ? 'bounce 3s ease-in-out infinite' : 'none'
                      }}
                    >
                      <Icon 
                        className="w-7 h-7" 
                        strokeWidth={2.5}
                        style={{ color: achievement.earned ? achievement.color : '#94a3b8' }}
                      />
                      
                      {/* Scratch-off overlay for locked achievements */}
                      {!achievement.earned && !isScratched && (
                        <div 
                          className="absolute inset-0 rounded-xl flex items-center justify-center cursor-pointer"
                          style={{
                            background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <span className="text-xs font-black text-white">?</span>
                        </div>
                      )}
                      
                      {/* Scratch reveal animation */}
                      {!achievement.earned && isScratched && (
                        <div 
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                            animation: 'scratchReveal 0.6s ease-out forwards'
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-black text-slate-900">{achievement.name}</h3>
                        {achievement.earned && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: achievement.color,
                              animation: 'stamp 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
                            }}>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={2}>
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">{achievement.description}</p>
                      {progressBar && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Progress</span>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ 
                              backgroundColor: `${achievement.color}20`,
                              color: achievement.color
                            }}>{achievement.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden relative"
                            style={{ border: '2px solid #e2e8f0' }}>
                            <div 
                              className="h-full rounded-full relative"
                              style={{ 
                                width: `${achievement.progress}%`,
                                backgroundColor: achievement.color,
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 0 8px ${achievement.color}40`,
                                animation: 'crayonStroke 1s ease-out forwards'
                              }}
                            >
                              {/* Glitter effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                style={{ 
                                  animation: 'shimmer 2s linear infinite',
                                  backgroundSize: '200% 100%'
                                }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Network - Name Badges */}
        <div className="mb-5" style={{ animation: 'paintSplash 1s ease-out 0.6s both' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900" style={{ textShadow: '2px 2px 0 rgba(168,85,247,0.1)' }}>Trust Network</h2>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border-2 border-green-200"
              style={{ animation: 'wiggle 3s ease-in-out infinite 0.5s', transform: 'rotate(1deg)' }}>
              <div className="w-2 h-2 rounded-full bg-green-500" style={{ animation: 'bounce 2s ease-in-out infinite' }} />
              <span className="text-xs font-black text-green-600">{guardians.length} Active</span>
            </div>
          </div>

          <div className="space-y-3">
            {guardians.map((guardian, index) => (
              <div
                key={guardian.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 relative"
                style={{ 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08), inset 0 -2px 0 rgba(34,197,94,0.05)",
                  animation: `stickerPeel 0.6s ease-out ${0.7 + index * 0.1}s both`,
                  border: `3px solid ${guardian.color}40`,
                  transform: index % 2 === 0 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)'
                }}
              >
                {/* Name badge style */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 relative"
                  style={{ 
                    backgroundColor: guardian.color,
                    color: 'white',
                    border: '3px solid white',
                    boxShadow: `0 4px 12px ${guardian.color}40, inset 0 2px 0 rgba(255,255,255,0.3)`,
                    animation: 'wiggle 3s ease-in-out infinite'
                  }}>
                  {guardian.initials}
                  {/* Badge pin effect */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full" style={{ backgroundColor: guardian.color, border: '2px solid white' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900">{guardian.name}</p>
                  <p className="text-xs text-slate-500 font-bold">{guardian.role}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ border: '2px solid #bbf7d0', animation: 'bounce 2s ease-in-out infinite 0.2s' }}>
                  <Shield className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
              </div>
            ))}

            <button
              onClick={() => console.log('Add trusted person')}
              className="w-full bg-purple-50 border-3 border-dashed rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
              style={{ 
                border: '3px dashed #c084fc',
                animation: 'wiggle 4s ease-in-out infinite',
                transform: 'rotate(-0.5deg)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0.5deg) scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-0.5deg) scale(1)'}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
                style={{ border: '3px solid #e9d5ff' }}>
                <Plus className="w-6 h-6 text-purple-600" strokeWidth={3} />
              </div>
              <span className="text-sm font-black text-purple-600">Add Guardian</span>
            </button>
          </div>
        </div>

        {/* Settings */}
        <button
          onClick={() => console.log('Settings')}
          className="w-full bg-white rounded-2xl px-4 py-4 flex items-center justify-between transition-all duration-300 active:scale-95"
          style={{ 
            boxShadow: "0 4px 12px rgba(168,85,247,0.12), inset 0 -2px 0 rgba(168,85,247,0.05)",
            animation: 'stickerPeel 0.6s ease-out 0.8s both',
            border: '3px solid #e9d5ff',
            transform: 'rotate(0.5deg)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(-0.5deg) scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0.5deg) scale(1)'}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center"
              style={{ border: '2px solid #e9d5ff', animation: 'wiggle 3s ease-in-out infinite' }}>
              <Settings className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black text-slate-900">Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
        </button>
      </main>
      
      <BottomNav activeTab="profile" onTabChange={handleTabChange} />
    </div>
  );
}
