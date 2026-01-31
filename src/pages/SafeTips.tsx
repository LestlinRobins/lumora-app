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
    <div className="min-h-screen bg-background" style={{ overflowX: "hidden" }}>
      <SafeTipsContent />
      <BottomNav activeTab="tips" onTabChange={handleTabChange} />
    </div>
  );
}
