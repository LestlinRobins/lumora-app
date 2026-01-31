import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { addCarrots } from "@/lib/carrots";

interface CarrotReward {
  id: string;
  amount: number;
  balloonId: number;
  startX: number;
  startY: number;
}

interface FlyingCarrot {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  delay: number;
}

const STORAGE_KEY = "lumora:pending-carrot-reward";

export function setPendingCarrotReward(amount: number, balloonId: number) {
  const reward = { amount, balloonId, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reward));
}

export function getPendingCarrotReward(): { amount: number; balloonId: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const reward = JSON.parse(stored);
    // Only valid for 10 seconds
    if (Date.now() - reward.timestamp > 10000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { amount: reward.amount, balloonId: reward.balloonId };
  } catch {
    return null;
  }
}

export function clearPendingCarrotReward() {
  localStorage.removeItem(STORAGE_KEY);
}

export function FlyingCarrotsOverlay() {
  const [carrots, setCarrots] = useState<FlyingCarrot[]>([]);
  const [showAmount, setShowAmount] = useState<{ amount: number; show: boolean }>({ amount: 0, show: false });

  const triggerAnimation = useCallback((startX: number, startY: number, amount: number) => {
    // Find header carrot icon position
    const headerCarrot = document.querySelector("[data-carrot-target]");
    let targetX = window.innerWidth - 80;
    let targetY = 28;
    
    if (headerCarrot) {
      const rect = headerCarrot.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // Create multiple flying carrots
    const numCarrots = Math.min(Math.ceil(amount / 25), 5); // 1-5 carrots based on amount
    const newCarrots: FlyingCarrot[] = [];
    
    for (let i = 0; i < numCarrots; i++) {
      newCarrots.push({
        id: `${Date.now()}-${i}`,
        x: startX + (Math.random() - 0.5) * 40,
        y: startY + (Math.random() - 0.5) * 40,
        targetX,
        targetY,
        delay: i * 100,
      });
    }

    setCarrots(newCarrots);
    setShowAmount({ amount, show: false });

    // Show the amount after carrots reach target and add to localStorage
    setTimeout(() => {
      addCarrots(amount);
      setShowAmount({ amount, show: true });
    }, 600 + numCarrots * 100);

    // Clear carrots after animation
    setTimeout(() => {
      setCarrots([]);
    }, 1000 + numCarrots * 100);

    // Hide amount popup
    setTimeout(() => {
      setShowAmount({ amount: 0, show: false });
    }, 2000 + numCarrots * 100);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ startX: number; startY: number; amount: number }>;
      if (e.detail) {
        triggerAnimation(e.detail.startX, e.detail.startY, e.detail.amount);
      }
    };

    window.addEventListener("lumora:trigger-carrot-animation", handler);
    return () => window.removeEventListener("lumora:trigger-carrot-animation", handler);
  }, [triggerAnimation]);

  if (carrots.length === 0 && !showAmount.show) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Flying carrots */}
      {carrots.map((carrot) => (
        <div
          key={carrot.id}
          className="absolute text-3xl"
          style={{
            left: carrot.x,
            top: carrot.y,
            animation: `flyToTarget 0.6s ease-in-out ${carrot.delay}ms forwards`,
            "--target-x": `${carrot.targetX - carrot.x}px`,
            "--target-y": `${carrot.targetY - carrot.y}px`,
          } as React.CSSProperties}
        >
          🥕
        </div>
      ))}

      {/* Amount popup at header */}
      {showAmount.show && (
        <div
          className="absolute right-4 top-12 bg-accent text-white px-3 py-1.5 rounded-full font-extrabold text-sm animate-bounce shadow-lg"
          style={{ animation: "popIn 0.3s ease-out, fadeOut 0.3s ease-out 1.2s forwards" }}
        >
          +{showAmount.amount} 🥕
        </div>
      )}

      <style>{`
        @keyframes flyToTarget {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--target-x) * 0.5), calc(var(--target-y) * 0.5 - 50px)) scale(1.3) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(0.5) rotate(360deg);
            opacity: 0.8;
          }
        }
        
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

export function triggerCarrotAnimation(startX: number, startY: number, amount: number) {
  window.dispatchEvent(
    new CustomEvent("lumora:trigger-carrot-animation", {
      detail: { startX, startY, amount },
    })
  );
}
