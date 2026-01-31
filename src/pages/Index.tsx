import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ActionCardList } from "@/components/ActionCards";
import { DailyChallenge, RewardBadge } from "@/components/DailyChallenge";
import { BookOpen, Dumbbell, Heart, Lightbulb } from "lucide-react";

function HomeContent() {
  return (
    <main className="pb-28 pt-2">
      <Header />
      
      {/* Daily challenge section */}
      <div className="mt-4">
        <DailyChallenge />
      </div>
      
      {/* Main action cards */}
      <div className="mt-6">
        <ActionCardList />
      </div>
      
      {/* Reward encouragement */}
      <RewardBadge />
      
      {/* Safety tip card - Drug awareness education */}
      <div className="mx-5 mt-6 p-5 bg-secondary/12 rounded-[1.75rem] border-2 border-secondary/30 slide-up relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/15 rounded-full blur-2xl" />
        
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: 'var(--shadow-button-secondary)' }}>
            <Lightbulb className="w-6 h-6 text-secondary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-base font-extrabold text-foreground">Safety Tip 💡</p>
            <p className="text-sm text-muted-foreground font-semibold mt-1.5 leading-relaxed">
              A trusted adult is someone who makes you feel safe, listens to you, and helps you make good choices. They could be a parent, teacher, or family member!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function PlaceholderContent({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <main className="pb-28 pt-6 px-5 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center mb-6 bounce-in"
        style={{ boxShadow: 'var(--shadow-button-primary)' }}>
        <Icon className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
      <p className="text-base text-muted-foreground font-semibold mt-3 text-center max-w-xs">
        More fun activities coming soon! 🎉
      </p>
      <div className="mt-6 px-6 py-3 bg-primary rounded-full text-white font-bold text-sm"
        style={{ boxShadow: 'var(--shadow-button-primary)' }}>
        Stay tuned!
      </div>
    </main>
  );
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "learn":
        return <PlaceholderContent title="Learn" icon={BookOpen} />;
      case "practice":
        return <PlaceholderContent title="Practice" icon={Dumbbell} />;
      case "support":
        return <PlaceholderContent title="Support" icon={Heart} />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
