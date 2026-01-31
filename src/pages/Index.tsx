import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ActionCardList } from "@/components/ActionCards";
import { RewardBadge } from "@/components/DailyChallenge";
import { MessageCircle, User, Heart } from "lucide-react";

function NestContent() {
  return (
    <main className="pb-28 pt-0">
      <Header />
      
      {/* Main learning roadmap */}
      <div className="mt-6">
        <ActionCardList />
      </div>
      
      {/* Reward encouragement */}
      <RewardBadge />
    </main>
  );
}

function ChatbotContent() {
  return (
    <main className="pb-28 pt-0">
      <Header />
      <div className="px-5 flex flex-col items-center justify-center min-h-[60vh] mt-12">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 bounce-in"
          style={{ boxShadow: 'var(--shadow-button-primary)' }}>
          <MessageCircle className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">Chat Helper</h2>
        <p className="text-base text-muted-foreground font-semibold mt-3 text-center max-w-xs">
          Coming soon! A friendly helper to talk to 💬
        </p>
      </div>
    </main>
  );
}

function SafeTipsContent() {
  return (
    <main className="pb-28 pt-0">
      <Header />
      
      {/* Safe tips roadmap (copy of main roadmap) */}
      <div className="mt-6">
        <ActionCardList />
      </div>
      
      {/* Reward encouragement */}
      <RewardBadge />
    </main>
  );
}

function ProfileContent() {
  return (
    <main className="pb-28 pt-0">
      <Header />
      <div className="px-5 mt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-warm rounded-full flex items-center justify-center mb-4 bounce-in"
            style={{ boxShadow: 'var(--shadow-warm)' }}>
            <User className="w-12 h-12 text-warm-foreground" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">About Us</h2>
          <p className="text-sm text-muted-foreground font-semibold mt-2 text-center">
            You're doing great! 🌟
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-card rounded-2xl border-2 border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Achievements</p>
                <p className="text-xs text-muted-foreground font-semibold">1 activity completed</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-card rounded-2xl border-2 border-border">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-warm" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-bold text-foreground">You're Safe Here</p>
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  This is your safe space to learn and grow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("nest");

  const renderContent = () => {
    switch (activeTab) {
      case "nest":
        return <NestContent />;
      case "chatbot":
        return <ChatbotContent />;
      case "tips":
        return <SafeTipsContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <NestContent />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ overflowX: 'hidden' }}>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
