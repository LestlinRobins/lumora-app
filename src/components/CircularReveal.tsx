import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState, useEffect } from "react";

interface CircularRevealProps {
  isRevealing: boolean;
  onRevealComplete?: () => void;
  children: ReactNode;
}

export function CircularReveal({
  isRevealing,
  onRevealComplete,
  children,
}: CircularRevealProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      setShouldShow(true);
      setIsAnimatingOut(false);
    }
  }, [isRevealing]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setShouldShow(false);
      }}
    >
      {!isAnimatingOut && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
        >
          {/* Multiple concentric circles that pulse and expand */}
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <motion.div
              key={`circle-${index}`}
              className="absolute rounded-full"
              style={{
                border: `${8 - index}px solid hsl(var(--primary))`,
                opacity: 0.4 - index * 0.05,
              }}
              initial={{
                width: 0,
                height: 0,
                scale: 0,
              }}
              animate={{
                width: ["0vw", "250vw"],
                height: ["0vw", "250vw"],
                scale: [0, 1.2, 1],
                opacity: [0, 0.6, 0.4, 0.2, 0],
              }}
              transition={{
                duration: 1.4,
                delay: index * 0.08,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            />
          ))}

          {/* Pulsing background circles for depth */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`bg-circle-${index}`}
              className="absolute rounded-full bg-primary/10"
              initial={{
                width: 0,
                height: 0,
              }}
              animate={{
                width: ["0vw", "300vw"],
                height: ["0vw", "300vw"],
                opacity: [0.3, 0.2, 0],
              }}
              transition={{
                duration: 1.6,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Main revealing content with clip-path and blur effect */}
          <motion.div
            className="absolute inset-0"
            initial={{
              clipPath: "circle(0% at 50% 50%)",
              filter: "blur(20px)",
            }}
            animate={{
              clipPath: [
                "circle(0% at 50% 50%)",
                "circle(20% at 50% 50%)",
                "circle(150% at 50% 50%)",
              ],
              filter: ["blur(20px)", "blur(10px)", "blur(0px)"],
            }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.43, 0.13, 0.23, 0.96],
              times: [0, 0.3, 1],
            }}
            onAnimationComplete={() => {
              setTimeout(() => {
                setIsAnimatingOut(true);
                if (onRevealComplete) {
                  onRevealComplete();
                }
              }, 100);
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
