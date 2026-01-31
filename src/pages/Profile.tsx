import { Header } from "@/components/Header";
import { User, Heart } from "lucide-react";
import { BottomNav, TabId } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleTabChange = (tab: TabId) => {
    if (tab !== "profile") {
      navigate("/", { state: { tab } });
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ overflowX: 'hidden' }}>
      <main className="pb-28 pt-20">
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
      <BottomNav activeTab="profile" onTabChange={handleTabChange} />
    </div>
  );
}
