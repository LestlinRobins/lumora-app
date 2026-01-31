import { Header } from "@/components/Header";
import { ActionCardList } from "@/components/ActionCards";
import { RewardBadge } from "@/components/DailyChallenge";

export function SafeTipsContent() {
  return (
    <main className="pb-28 pt-20">
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
