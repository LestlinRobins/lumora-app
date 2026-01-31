import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ActionCardList } from "@/components/ActionCards";
import { BalloonView } from "@/components/BalloonView";
import { RewardBadge } from "@/components/DailyChallenge";
import { MessageCircle } from "lucide-react";

function NestContent() {
  return (
    <main className="pb-28 pt-0">
      <Header />
      
      {/* Balloon interaction for home */}
      <div className="mt-6">
        <BalloonView />
      </div>
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


export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("nest");
  const navigate = useNavigate();

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") {
      navigate("/profile");
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "nest":
        return <NestContent />;
      case "chatbot":
        return <ChatbotContent />;
      case "tips":
        return <SafeTipsContent />;
      default:
        return <NestContent />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ overflowX: 'hidden' }}>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
