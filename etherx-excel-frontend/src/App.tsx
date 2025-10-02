import { useState, useEffect } from "react";
import { AdvancedFeaturesModal } from "./components/AdvancedFeaturesModal";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { WelcomeSplash } from "./components/WelcomeSplash";
import { Dashboard } from "./components/Dashboard";
import { SimplifiedSpreadsheetApp } from "./components/SimplifiedSpreadsheetApp";
import { Toaster } from "./components/ui/sonner";
import { User } from "./types/spreadsheet";

type Screen = "login" | "signup" | "welcome" | "dashboard" | "app";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<User | null>(null);
  const [showDemoOnStart, setShowDemoOnStart] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleLogin = (emailOrPhone: string) => {
    const newUser: User = {
      name: emailOrPhone.includes("@") ? emailOrPhone.split("@")[0].charAt(0).toUpperCase() + emailOrPhone.split("@")[0].slice(1) : "User",
      email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@example.com`,
      phone: emailOrPhone.includes("@") ? undefined : emailOrPhone,
    };
    setUser(newUser);
    setScreen("welcome");
  };

  const handleSignup = (name: string, email: string, phone: string) => {
    const newUser: User = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      phone: phone || undefined,
    };
    setUser(newUser);
    setScreen("welcome");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  const handleBackToHome = () => {
    setScreen("dashboard");
    setShowDemoOnStart(false);
  };

  return (
    <>
      {screen === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setScreen("signup")}
        />
      )}

      {screen === "signup" && (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setScreen("login")}
        />
      )}

      {screen === "welcome" && user && (
        <WelcomeSplash user={user} onComplete={() => setScreen("dashboard")} />
      )}

      {screen === "dashboard" && user && (
        <Dashboard
          userName={user.name}
          onNewSheet={() => setScreen("app")}
          onLoadTemplates={() => {
            setScreen("app");
            setShowDemoOnStart(true);
          }}
          onShowAdvanced={() => setShowAdvancedModal(true)}
        />
      )}

      {screen === "app" && user && (
        <SimplifiedSpreadsheetApp 
          user={user} 
          onLogout={handleLogout}
          onBackToHome={handleBackToHome}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}

      <AdvancedFeaturesModal open={showAdvancedModal} onClose={() => setShowAdvancedModal(false)} user={user} />
      <Toaster />
    </>
  );
}
