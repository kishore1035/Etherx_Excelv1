import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";

interface SignupPageProps {
  onSignup: (name: string, email: string, phone: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onSignup(name, email, phone);
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
            <h1 className="text-3xl mb-2 text-foreground">Create Account</h1>
            <p className="text-foreground/80">Join today</p>
          </div>

          {!otpSent ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
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
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={onSwitchToLogin}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Already have an account? Sign in
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
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-2 text-center tracking-widest"
                  maxLength={6}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  OTP sent to {email}
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
                  "Verify & Sign Up"
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
