import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ActionCardList } from "@/components/ActionCards";
import { BalloonView } from "@/components/BalloonView";
import { RewardBadge } from "@/components/DailyChallenge";
import { SafeTipsContent } from "@/components/SafeTipsContent";
import { MessageCircle } from "lucide-react";
import { FlyingCarrotsOverlay, getPendingCarrotReward, clearPendingCarrotReward, triggerCarrotAnimation } from "@/components/FlyingCarrots";

function NestContent() {
  return (
    <main className="pb-28 pt-20">
      <Header />
      
      {/* Balloon interaction for home */}
      <div>
        <BalloonView />
      </div>
    </main>
  );
}

function ChatbotContent() {
  return (
    <main className="pb-28 pt-20">
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

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("nest");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("lumora_user_data");
    if (!userData) {
      navigate("/onboarding");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      // Optional: clear state to prevent stuck tab on refresh if desired, 
      // but keeping it is usually fine.
      // navigate(location.pathname, { replace: true, state: {} }); 
    }
  }, [location]);

  // Check for pending carrot reward and trigger animation
  useEffect(() => {
    const reward = getPendingCarrotReward();
    if (reward) {
      // Small delay to ensure page is rendered and balloon is visible
      const timer = setTimeout(() => {
        // Find the balloon element
        const balloonEl = document.querySelector(`[data-balloon-id="${reward.balloonId}"]`);
        if (balloonEl) {
          const rect = balloonEl.getBoundingClientRect();
          triggerCarrotAnimation(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            reward.amount
          );
        } else {
          // Fallback: animate from center of screen
          triggerCarrotAnimation(
            window.innerWidth / 2,
            window.innerHeight / 2,
            reward.amount
          );
        }
        clearPendingCarrotReward();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") {
      navigate("/profile");
    } else if (tab === "chatbot") {
      navigate("/chat");
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
      <FlyingCarrotsOverlay />
    </div>
  );
}
