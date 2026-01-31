
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import Lottie from "lottie-react";
import celebrationAnimation from "../../public/animations/Celebration balloon confetti animation.json";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Load initial state from localStorage if available
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("lumora_user_data");
    const initial = saved ? JSON.parse(saved) : {
      name: "",
      avatar: "",
      guardianName: "",
      guardianPhone: "",
    };
    return initial;
  });

  const [errors, setErrors] = useState({
    name: "",
    avatar: "",
    guardianPhone: "",
    guardianName: "",
  });

  const avatars = [
    "/illustrations/undraw_male-avatar_1.svg",
    "/illustrations/undraw_male-avatar_2.svg",
    "/illustrations/undraw_a-woman-avatar1.svg",
    "/illustrations/undraw_a-woman-avata2.svg",
    "/illustrations/undraw_among-nature_2f9e.svg", 
  ];

  const validateStep = (currentStep: number): boolean => {
    const newErrors = { name: "", avatar: "", guardianPhone: "", guardianName: "" };
    let isValid = true;

    if (currentStep === 0) {
      if (!formData.name.trim()) {
        newErrors.name = "We need to know what to call you!";
        isValid = false;
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name needs to be a bit longer!";
        isValid = false;
      }
    }

    if (currentStep === 1) {
      if (!formData.avatar) {
        newErrors.avatar = "Please pick a hero look!";
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!formData.guardianName.trim()) {
          newErrors.guardianName = "What's their name?";
          isValid = false;
      }
      if (!formData.guardianPhone.trim()) {
        newErrors.guardianPhone = "We need a number to keep you safe!";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.guardianPhone.replace(/\D/g, ''))) {
        newErrors.guardianPhone = "That doesn't look like a real phone number.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
    //   hapticLight(); // Assuming haptics not available in this context yet, can add if needed
      if (navigator.vibrate) navigator.vibrate(10);
      setStep(step + 1);
    } else {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
  };

  const handleBack = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    if (navigator.vibrate) navigator.vibrate(20);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("lumora_user_data", JSON.stringify(formData));
      setIsSubmitting(false);
      setStep(step + 1); // Move to success screen
    }, 1500);
  };

  const screens = [
    // Screen 0: Name Input
    <div
      key="screen-0"
      className="max-w-md w-full flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center mb-8"
      >
          <img src="/illustrations/nest2.png" alt="Name" className="w-32 opacity-100" />
      </motion.div>

      <motion.h1
        className="text-3xl font-bold text-center mb-2 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Welcome to Nest!
      </motion.h1>
      
      <motion.p
        className="text-muted-foreground text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Let’s get you ready! What should we call you?
      </motion.p>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setErrors({ ...errors, name: "" });
          }}
          placeholder="Your Hero Name"
          className="h-14 text-lg rounded-2xl bg-white border-2 border-border focus:border-primary px-6 shadow-sm mb-2 text-center font-bold text-primary"
          autoFocus
        />
        {errors.name && (
            <motion.p 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-destructive mt-2 text-center font-medium"
            >
            {errors.name}
            </motion.p>
        )}
      </motion.div>

      <AnimatePresence>
        {formData.name.trim().length >= 2 && (
          <motion.div
            className="w-full mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button
              onClick={handleNext}
              className="w-full h-14 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all btn-bouncy bg-primary hover:bg-primary/90 text-white"
            >
              Next Step
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,

    // Screen 1: Avatar Selection
    <div
      key="screen-1"
      className="max-w-md w-full flex flex-col items-center justify-center px-6"
    >
        <div className="absolute top-6 left-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
                <ArrowLeft className="w-6 h-6 text-muted-foreground" />
            </Button>
        </div>

      <motion.h1
        className="text-3xl font-bold text-center mb-2 mt-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Pick Your Style
      </motion.h1>
      
      <motion.p
        className="text-muted-foreground text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Choose an avatar that represents you!
      </motion.p>

      <motion.div
        className="grid grid-cols-2 gap-4 w-full mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
          {avatars.map((avatar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setFormData({ ...formData, avatar });
                    setErrors({ ...errors, avatar: "" });
                    if (navigator.vibrate) navigator.vibrate(5);
                }}
                className={`relative bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center aspect-square ${
                    formData.avatar === avatar 
                    ? "border-primary shadow-lg ring-2 ring-primary/20 bg-primary/5" 
                    : "border-transparent shadow-sm hover:border-primary/30"
                }`}
              >
                  <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-20 h-20 object-contain" />
                  {formData.avatar === avatar && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                          <Check size={14} strokeWidth={3} />
                      </div>
                  )}
              </motion.div>
          ))}
      </motion.div>

      <AnimatePresence>
        {formData.avatar && (
            <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Button
                onClick={handleNext}
                className="w-full h-14 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all btn-bouncy bg-primary hover:bg-primary/90 text-white"
                >
                Looks Good!
                </Button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>,

    // Screen 2: Guardian Info
    <div
      key="screen-2"
      className="max-w-md w-full flex flex-col items-center justify-center px-6"
    >
        <div className="absolute top-6 left-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
                <ArrowLeft className="w-6 h-6 text-muted-foreground" />
            </Button>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center mb-6"
      >
          <img src="/illustrations/phone.svg" alt="Phone" className="w-40 opacity-80" />
      </motion.div>

      <motion.h1
        className="text-3xl font-bold text-center mb-2 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Stay Safe
      </motion.h1>
      
      <motion.p
        className="text-muted-foreground text-center mb-8 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Who should we call in case of an emergency?
      </motion.p>

      <motion.div
        className="w-full space-y-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div>
            <label className="text-sm font-semibold text-muted-foreground ml-2 mb-1 block">Their Name</label>
            <Input
            value={formData.guardianName}
            onChange={(e) => {
                setFormData({ ...formData, guardianName: e.target.value });
                setErrors({ ...errors, guardianName: "" });
            }}
            placeholder="e.g. Mom, Dad, Unty Rose"
            className="h-14 text-lg rounded-2xl bg-white border-2 border-border focus:border-primary px-6"
            />
            {errors.guardianName && <p className="text-xs text-destructive mt-1 ml-2">{errors.guardianName}</p>}
        </div>

        <div>
            <label className="text-sm font-semibold text-muted-foreground ml-2 mb-1 block">Phone Number</label>
            <div className="flex gap-2">
                <div className="h-14 w-16 flex items-center justify-center bg-muted rounded-2xl border-2 border-transparent font-bold text-muted-foreground">
                    +91
                </div>
                <Input
                type="tel"
                value={formData.guardianPhone}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, guardianPhone: val });
                    setErrors({ ...errors, guardianPhone: "" });
                }}
                placeholder="98765 43210"
                className="h-14 text-lg rounded-2xl bg-white border-2 border-border focus:border-primary px-6 font-mono tracking-wide"
                />
            </div>
            {errors.guardianPhone && <p className="text-xs text-destructive mt-1 ml-2">{errors.guardianPhone}</p>}
        </div>
      </motion.div>

      <div className="w-full mt-8 h-14">
        <AnimatePresence>
            {!isSubmitting && formData.guardianName && formData.guardianPhone.length === 10 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <Button
                    onClick={handleSubmit}
                    className="w-full h-14 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all btn-bouncy bg-primary hover:bg-primary/90 text-white"
                    >
                    Complete Setup
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
        
        {isSubmitting && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full gap-2 text-primary font-semibold"
            >
                <Loader2 className="animate-spin" />
                <span>Creating your safe space...</span>
            </motion.div>
        )}
      </div>
    </div>,

    // Screen 3: Success
    <div
      key="screen-3"
      className="max-w-md w-full flex flex-col items-center justify-center px-6 relative"
    >
      <div className="absolute inset-0 pointer-events-none">
         <Lottie animationData={celebrationAnimation} loop={false} />
      </div>

      <motion.img
        src="/illustrations/welcome.svg"
        alt="Welcome"
        className="w-64 mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
      />

      <motion.h1
        className="text-4xl font-extrabold text-center mb-4 text-foreground leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        You're All Set,<br/>
        <span className="text-primary">{formData.name}!</span>
      </motion.h1>
      
      <motion.p
        className="text-muted-foreground text-center mb-10 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Let's learn and stay safe together.
      </motion.p>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <Button
            onClick={() => {
                setIsExiting(true);
                setTimeout(() => navigate("/profile"), 500);
            }}
            className="w-full h-14 rounded-full text-xl font-bold shadow-lg hover:shadow-2xl transition-all btn-bouncy bg-gradient-to-r from-primary to-purple-600 text-white"
        >
            Start Journey
        </Button>
      </motion.div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden font-sans">
        {/* Background blobs for premium feel */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
            {!isExiting && (
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full flex justify-center sticky"
                >
                    {screens[step]}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
