import { useEffect } from "react";
import { motion } from "motion/react";
import { User } from "../types/spreadsheet";
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";

interface WelcomeSplashProps {
  user: User;
  onComplete: () => void;
}

export function WelcomeSplash({ user, onComplete }: WelcomeSplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mx-auto w-full max-w-md p-6 sm:p-8 bg-card rounded-2xl shadow-2xl border border-border"
        style={{ minWidth: 280, minHeight: 280 }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl bg-card p-3">
            <img src={logoImage} alt="EtherX Excel" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-4xl mb-3">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground text-xl">
            Loading your workspace...
          </p>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ delay: 1, duration: 1.5 }}
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-8"
        />
      </motion.div>
    </div>
  );
}
