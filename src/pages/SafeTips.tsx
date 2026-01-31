import { useNavigate } from "react-router-dom";
import { BottomNav, TabId } from "@/components/BottomNav";
import { SafeTipsContent } from "@/components/SafeTipsContent";

export default function SafeTips() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background" 
      style={{ 
        overflowX: "hidden",
        background: 'linear-gradient(to bottom, #adcffcff, #eff6ff)' // Baby blue gradient from Nest
      }}
    >
      {/* Clouds Overlay - "A little bit" of cloud bg */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
         <img src="/illustrations/cloud.png" alt="" className="absolute top-20 -left-10 w-24 opacity-80 animate-pulse" style={{ animationDuration: '4s' }} />
         <img src="/illustrations/cloud1.png" alt="" className="absolute top-40 -right-5 w-32 opacity-70 animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10">
        <SafeTipsContent />
      </div>
      <BottomNav activeTab="tips" onTabChange={handleTabChange} />
    </div>
  );
}
