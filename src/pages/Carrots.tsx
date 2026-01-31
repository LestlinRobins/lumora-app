import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav, TabId } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCarrots } from "@/lib/carrots";
import { Trophy, Star, Target, Sparkles, Gift, Medal, Crown, Rocket, Heart, Shield, Lock } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  carrotsRequired: number;
  color: string;
  unlocked: boolean;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  carrotsCost: number;
  icon: React.ElementType;
  color: string;
}

export default function Carrots() {
  const navigate = useNavigate();
  const [carrots, setCarrots] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    setCarrots(getCarrots());
    const completed = JSON.parse(localStorage.getItem("completedBalloons") || "[]");
    setCompletedLessons(completed);
  }, []);

  const achievements: Achievement[] = [
    {
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: Star,
      carrotsRequired: 10,
      color: "bg-yellow-500",
      unlocked: completedLessons.length >= 1,
    },
    {
      id: "curious-mind",
      title: "Curious Mind",
      description: "Complete 3 lessons",
      icon: Sparkles,
      carrotsRequired: 30,
      color: "bg-purple-500",
      unlocked: completedLessons.length >= 3,
    },
    {
      id: "safety-hero",
      title: "Safety Hero",
      description: "Complete 5 lessons",
      icon: Shield,
      carrotsRequired: 50,
      color: "bg-blue-500",
      unlocked: completedLessons.length >= 5,
    },
    {
      id: "knowledge-seeker",
      title: "Knowledge Seeker",
      description: "Earn 100 carrots",
      icon: Target,
      carrotsRequired: 100,
      color: "bg-green-500",
      unlocked: carrots >= 100,
    },
    {
      id: "champion",
      title: "Champion",
      description: "Complete 7 lessons",
      icon: Trophy,
      carrotsRequired: 70,
      color: "bg-orange-500",
      unlocked: completedLessons.length >= 7,
    },
    {
      id: "superstar",
      title: "Superstar",
      description: "Earn 200 carrots",
      icon: Crown,
      carrotsRequired: 200,
      color: "bg-pink-500",
      unlocked: carrots >= 200,
    },
  ];

  const rewards: Reward[] = [
    {
      id: "badge-collector",
      title: "Badge Collector",
      description: "A special badge for your profile!",
      carrotsCost: 50,
      icon: Medal,
      color: "bg-amber-500",
    },
    {
      id: "rocket-boost",
      title: "Rocket Boost",
      description: "Extra energy for learning!",
      carrotsCost: 75,
      icon: Rocket,
      color: "bg-red-500",
    },
    {
      id: "kindness-heart",
      title: "Kindness Heart",
      description: "Share love with friends!",
      carrotsCost: 100,
      icon: Heart,
      color: "bg-rose-500",
    },
    {
      id: "mystery-gift",
      title: "Mystery Gift",
      description: "A surprise awaits you!",
      carrotsCost: 150,
      icon: Gift,
      color: "bg-indigo-500",
    },
  ];

  const totalPossibleCarrots = 13 * 20; // 13 lessons × 20 carrots each
  const progressPercentage = Math.min((carrots / totalPossibleCarrots) * 100, 100);

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") {
      navigate("/profile");
      return;
    }
    if (tab === "chatbot") {
      navigate("/chat");
      return;
    }
    if (tab === "tips") {
      navigate("/tips");
      return;
    }
    navigate("/", { state: { tab } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-background pb-32">
      <Header />
      
      <main className="pt-20 px-5">
        <div className="max-w-lg mx-auto space-y-6">
          
          {/* Carrot Balance Card */}
          <Card className="p-6 bg-gradient-to-br from-orange-100 to-amber-50 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-orange-700">Your Carrots</h2>
                <p className="text-sm text-orange-600/80 font-medium">Keep learning to earn more!</p>
              </div>
              <div className="text-5xl">🥕</div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-orange-600">{carrots}</span>
              <span className="text-lg text-orange-500 font-semibold">carrots</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-orange-700">
                <span>Progress to Master</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-orange-200" />
            </div>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center bg-purple-50 border-purple-200">
              <div className="text-2xl font-black text-purple-600">{completedLessons.length}</div>
              <div className="text-xs font-semibold text-purple-500">Lessons Done</div>
            </Card>
            <Card className="p-4 text-center bg-blue-50 border-blue-200">
              <div className="text-2xl font-black text-blue-600">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-xs font-semibold text-blue-500">Achievements</div>
            </Card>
            <Card className="p-4 text-center bg-green-50 border-green-200">
              <div className="text-2xl font-black text-green-600">{13 - completedLessons.length}</div>
              <div className="text-xs font-semibold text-green-500">To Explore</div>
            </Card>
          </div>

          {/* Achievements Section */}
          <div>
            <h3 className="text-lg font-extrabold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card 
                    key={achievement.id}
                    className={`p-4 transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-white border-2 border-green-300 shadow-lg' 
                        : 'bg-gray-100 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        achievement.unlocked ? achievement.color : 'bg-gray-300'
                      }`}>
                        {achievement.unlocked ? (
                          <Icon className="w-5 h-5 text-white" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${
                          achievement.unlocked ? 'text-foreground' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Rewards Shop Section */}
          <div>
            <h3 className="text-lg font-extrabold text-foreground mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Rewards Shop
              <span className="text-xs font-medium text-muted-foreground ml-auto">Coming Soon!</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                const canAfford = carrots >= reward.carrotsCost;
                return (
                  <Card 
                    key={reward.id}
                    className="p-4 bg-white/50 border-dashed border-2 border-gray-200"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${reward.color} opacity-50`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-600">{reward.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{reward.description}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-400">
                      <span>🥕</span>
                      <span>{reward.carrotsCost}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Motivational Message */}
          
        </div>
      </main>

      <BottomNav activeTab="nest" onTabChange={handleTabChange} />
    </div>
  );
}
