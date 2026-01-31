import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Lottie from "lottie-react";
import trophyAnimation from "@/animations/Trophy.json";
import championAnimation from "@/animations/Champion.json";
import celebrationAnimation from "@/animations/Celebration balloon confetti animation.json";
import sadStarAnimation from "@/animations/Sad Star.json";
import cryingEmojiAnimation from "@/animations/Crying emoji.json";

interface QuizQuestion {
  id: number;
  illustration: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Quiz data for each balloon
const quizData: Record<number, QuizQuestion> = {
  1: {
    id: 1,
    illustration: "/illustrations/undraw_among-nature_2f9e.svg",
    question: "Is it safe to accept candy from a stranger?",
    options: ["Yes, always!", "No, never", "Only if they seem nice", "Only if my friend says yes"],
    correctAnswer: 1
  },
  2: {
    id: 2,
    illustration: "/illustrations/cloud.png",
    question: "What are drugs?",
    options: ["Only medicine from a doctor", "Substances that change how your body works", "Vitamins", "Food"],
    correctAnswer: 1
  },
  3: {
    id: 3,
    illustration: "/illustrations/cloud1.png",
    question: "If someone offers you something that makes you uncomfortable, what should you do?",
    options: ["Say 'No' firmly and walk away", "Accept it to be polite", "Keep it a secret", "Try it first"],
    correctAnswer: 0
  },
  4: {
    id: 4,
    illustration: "/illustrations/undraw_among-nature_2f9e.svg",
    question: "Who is a trusted adult?",
    options: ["Anyone older than you", "Parents, teachers, or caregivers you know well", "Anyone who gives you gifts", "Only police officers"],
    correctAnswer: 1
  },
  5: {
    id: 5,
    illustration: "/illustrations/cloud.png",
    question: "If you feel scared or uncomfortable, what should you do?",
    options: ["Keep it to yourself", "Tell a trusted adult right away", "Hide and wait", "Ignore the feeling"],
    correctAnswer: 1
  },
  6: {
    id: 6,
    illustration: "/illustrations/cloud1.png",
    question: "Where is a safe place?",
    options: ["Anywhere with toys", "Places with trusted adults who care for you", "Any public place", "Anywhere with strangers"],
    correctAnswer: 1
  },
  7: {
    id: 7,
    illustration: "/illustrations/undraw_among-nature_2f9e.svg",
    question: "Who can help you when you need it?",
    options: ["Only your parents", "Parents, teachers, school counselors, or trusted family members", "Anyone on the internet", "Only older children"],
    correctAnswer: 1
  },
  8: {
    id: 8,
    illustration: "/illustrations/cloud.png",
    question: "What's the difference between good and bad secrets?",
    options: ["Good secrets are surprises that make people happy, bad secrets make you feel uncomfortable", "All secrets are good", "Bad secrets are birthday surprises", "There's no difference"],
    correctAnswer: 0
  },
  9: {
    id: 9,
    illustration: "/illustrations/cloud1.png",
    question: "What would you do if a friend asks you to try something unsafe?",
    options: ["Do it to keep them as a friend", "Say 'No' and tell a trusted adult", "Keep it secret", "Try it just once"],
    correctAnswer: 1
  },
  10: {
    id: 10,
    illustration: "/illustrations/undraw_among-nature_2f9e.svg",
    question: "Is it okay to leave a situation that makes you feel unsafe?",
    options: ["No, it's rude", "Yes, always trust your feelings and leave", "Only if someone tells you to", "Never"],
    correctAnswer: 1
  },
  11: {
    id: 11,
    illustration: "/illustrations/cloud.png",
    question: "What does 'listen to your body' mean?",
    options: ["Only listen when you're hungry", "Pay attention to feelings of discomfort or fear", "Ignore strange feelings", "Only listen to others"],
    correctAnswer: 1
  },
  12: {
    id: 12,
    illustration: "/illustrations/cloud1.png",
    question: "What should you do when friends pressure you to do something wrong?",
    options: ["Go along with it", "Stand firm and say 'No,' real friends will respect you", "Do it to fit in", "Keep it secret"],
    correctAnswer: 1
  },
  13: {
    id: 13,
    illustration: "/illustrations/undraw_among-nature_2f9e.svg",
    question: "If something bad happens, are you in trouble?",
    options: ["Yes, always", "No, telling a trusted adult will help keep you safe", "Yes, if you tell someone", "Only sometimes"],
    correctAnswer: 1
  },
};

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const balloonId = location.state?.balloonId || 1;
  const balloonTitle = location.state?.balloonTitle || "Quiz";
  
  const quiz = quizData[balloonId];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Randomly select an animation for this quiz session
  const successAnimation = useMemo(() => {
    const animations = [
      trophyAnimation,
      championAnimation,
      celebrationAnimation
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  }, [balloonId]); // Re-randomize when balloonId changes

  // Randomly select an error animation for this quiz session
  const errorAnimation = useMemo(() => {
    const animations = [
      sadStarAnimation,
      cryingEmojiAnimation
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  }, [balloonId]); // Re-randomize when balloonId changes

  // Haptic feedback pattern
  const buildingPattern = () => {
    if (navigator.vibrate) {
      const pattern = [
        25, 250, 30, 220, 35, 200, 40, 180, 45, 160, 50, 140, 55, 120, 60, 100,
        65, 90, 70, 80, 75, 70, 300, 120,
      ];
      navigator.vibrate(pattern);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      toast.error("Please select an answer!");
      return;
    }

    const correct = selectedOption === quiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    buildingPattern(); // Trigger haptic feedback for both success and failure

    if (correct) {
      // Save completion to localStorage
      const completedBalloons = JSON.parse(localStorage.getItem("completedBalloons") || "[]");
      if (!completedBalloons.includes(balloonId)) {
        completedBalloons.push(balloonId);
        localStorage.setItem("completedBalloons", JSON.stringify(completedBalloons));
      }
      setTimeout(() => {
        navigate("/");
      }, 2000); // Navigate back after 2 seconds
    } else {
      // Hide animation and clear selection after 2 seconds
      setTimeout(() => {
        setShowResult(false);
        setSelectedOption(null);
      }, 2000);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Full Screen Lottie Animation Overlay - Success */}
      {showResult && isCorrect && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
          <div className="w-full h-full max-w-2xl flex items-center justify-center p-8">
            <Lottie 
              animationData={successAnimation} 
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%', maxHeight: '80vh' }}
            />
          </div>
        </div>
      )}

      {/* Full Screen Lottie Animation Overlay - Error */}
      {showResult && !isCorrect && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
          <div className="w-full h-full max-w-2xl flex items-center justify-center p-8">
            <Lottie 
              animationData={errorAnimation} 
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%', maxHeight: '80vh' }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-extrabold text-foreground">{balloonTitle}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8 px-5">
        <div className="max-w-lg mx-auto">
          {/* Illustration */}
          <div className="mb-8 flex justify-center">
            <div 
              className="w-full max-w-xs h-48 bg-muted rounded-3xl flex items-center justify-center overflow-hidden"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <img 
                src={quiz.illustration} 
                alt="Quiz illustration" 
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Question */}
          <Card className="p-6 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="text-xl font-bold text-foreground mb-6">
              {quiz.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedOption(index)}
                  disabled={showResult}
                  className={`
                    w-full p-4 rounded-2xl text-left font-semibold text-base
                    transition-all duration-200
                    ${selectedOption === index 
                      ? showResult
                        ? isCorrect
                          ? 'bg-success text-success-foreground ring-4 ring-success/30'
                          : 'bg-destructive text-destructive-foreground ring-4 ring-destructive/30'
                        : 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                    }
                    ${showResult && index === quiz.correctAnswer && selectedOption !== quiz.correctAnswer
                      ? 'bg-success text-success-foreground ring-4 ring-success/30'
                      : ''
                    }
                    ${!showResult ? 'cursor-pointer active:scale-[0.98]' : 'cursor-not-allowed'}
                  `}
                  style={{
                    boxShadow: selectedOption === index && !showResult
                      ? '0 5px 0 0 hsl(265 75% 45%)'
                      : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {index === quiz.correctAnswer && (
                          <CheckCircle2 className="w-6 h-6 flex-shrink-0 ml-2" />
                        )}
                        {selectedOption === index && !isCorrect && (
                          <X className="w-6 h-6 flex-shrink-0 ml-2" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Submit/Retry Button */}
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-lg font-bold rounded-2xl"
              style={{ boxShadow: 'var(--shadow-button-primary)' }}
            >
              Check Answer
            </Button>
          ) : !isCorrect ? (
            <Button
              onClick={handleRetry}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-accent hover:bg-accent/90"
              style={{ boxShadow: 'var(--shadow-button-accent)' }}
            >
              Try Again
            </Button>
          ) : (
            <Card className="p-6 bg-success/10 border-success/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: 'var(--shadow-success)' }}>
                  <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-success mb-1">Awesome!</h3>
                  <p className="text-sm text-foreground font-semibold">
                    Returning to your journey...
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
