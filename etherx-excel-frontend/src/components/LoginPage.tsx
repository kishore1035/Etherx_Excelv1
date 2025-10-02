import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";

interface LoginPageProps {
  onLogin: (email: string) => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!emailOrPhone) {
      toast.error("Please enter your email or phone number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setOtpSent(true);
    toast.success("OTP sent successfully! (Demo: use any 6 digits)");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onLogin(emailOrPhone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto bg-card p-2">
                <img src={logoImage} alt="EtherX Excel" className="w-full h-full object-contain" />
              </div>
            </motion.div>
            <h1 className="text-3xl mb-2 text-foreground">EtherX Excel</h1>
            <p className="text-foreground/80">Sign in to continue</p>
          </div>

          {!otpSent ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact" className="text-foreground">Email or Phone</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
                  <Input
                    id="contact"
                    type="text"
                    placeholder="email@example.com or +1234567890"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="pl-10 text-foreground"
                    onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={onSwitchToSignup}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="otp" className="text-foreground">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-2 text-center tracking-widest text-foreground"
                  maxLength={6}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                />
                <p className="text-sm text-foreground/70 mt-2">
                  OTP sent to {emailOrPhone}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <Button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                variant="outline"
                className="w-full"
              >
                Back
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
