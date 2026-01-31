import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ActionCardList } from "@/components/ActionCards";
import { DailyChallenge, RewardBadge } from "@/components/DailyChallenge";
import { BookOpen, Dumbbell, Heart } from "lucide-react";

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
      
      {/* Quick tip */}
      <div className="mx-5 mt-6 p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-bold text-foreground">Quick Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              A trusted adult is someone who makes you feel safe and listens to you.
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
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        More activities coming soon! 🎉
      </p>
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
