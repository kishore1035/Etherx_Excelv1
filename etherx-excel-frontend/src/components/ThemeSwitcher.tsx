import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface ThemeSwitcherProps {
  open: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const THEMES = [
  {
    id: "dark",
    name: "Dark Mode 🌙",
    description: "Classic dark theme",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    colors: {
      background: "#0a0a0f",
      foreground: "#ffffff",
      card: "#1a1a2e",
      border: "#2d2d44",
    },
  },
  {
    id: "vaporwave",
    name: "Vaporwave 🌴",
    description: "80s aesthetic vibes",
    preview: "linear-gradient(135deg, #ff6ec4 0%, #7873f5 50%, #01cdfe 100%)",
    colors: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 100%)",
      foreground: "#ff6ec4",
      card: "#2d1b3d",
      border: "#ff6ec4",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk ⚡",
    description: "Neon future aesthetic",
    preview: "linear-gradient(135deg, #00ff41 0%, #00b8ff 50%, #ff00ff 100%)",
    colors: {
      background: "#0a0e27",
      foreground: "#00ff41",
      card: "#1a1e3a",
      border: "#00ff41",
    },
  },
  {
    id: "pastel",
    name: "Pastel Dreams 🌸",
    description: "Soft and aesthetic",
    preview: "linear-gradient(135deg, #ffd1dc 0%, #ffeaa7 50%, #dfe4ea 100%)",
    colors: {
      background: "#fff5f8",
      foreground: "#2d3436",
      card: "#ffffff",
      border: "#ffd1dc",
    },
  },
  {
    id: "neon",
    name: "Neon Night 💫",
    description: "Bright neon colors",
    preview: "linear-gradient(135deg, #ff006e 0%, #fb5607 50%, #ffbe0b 100%)",
    colors: {
      background: "#000000",
      foreground: "#ffffff",
      card: "#1a1a1a",
      border: "#ff006e",
    },
  },
  {
    id: "forest",
    name: "Forest Vibes 🌲",
    description: "Nature-inspired calm",
    preview: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    colors: {
      background: "#1a2f1a",
      foreground: "#e8f5e9",
      card: "#2d4a2d",
      border: "#56ab2f",
    },
  },
  {
    id: "sunset",
    name: "Sunset Glow 🌅",
    description: "Warm sunset tones",
    preview: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
    colors: {
      background: "#2d1f2d",
      foreground: "#ffe4e1",
      card: "#3d2f3d",
      border: "#ff9966",
    },
  },
  {
    id: "ocean",
    name: "Ocean Breeze 🌊",
    description: "Cool blue waves",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    colors: {
      background: "#0f1e2e",
      foreground: "#e0f7fa",
      card: "#1a2f3e",
      border: "#667eea",
    },
  },
];

export function ThemeSwitcher({ open, onClose, currentTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Aesthetic ✨</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                currentTheme === theme.id
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className="w-full h-24 rounded-lg mb-3"
                style={{ background: theme.preview }}
              />
              <h3 className="mb-1 text-sm">{theme.name}</h3>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
              
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function applyTheme(themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  
  // Apply custom theme colors
  if (themeId === "vaporwave") {
    root.style.setProperty("--background", "#1a1a2e");
    root.style.setProperty("--foreground", "#ff6ec4");
    root.style.setProperty("--card", "#2d1b3d");
    root.style.setProperty("--border", "rgba(255, 110, 196, 0.3)");
    root.style.setProperty("--primary", "#ff6ec4");
  } else if (themeId === "cyberpunk") {
    root.style.setProperty("--background", "#0a0e27");
    root.style.setProperty("--foreground", "#00ff41");
    root.style.setProperty("--card", "#1a1e3a");
    root.style.setProperty("--border", "rgba(0, 255, 65, 0.3)");
    root.style.setProperty("--primary", "#00ff41");
  } else if (themeId === "pastel") {
    root.style.setProperty("--background", "#fff5f8");
    root.style.setProperty("--foreground", "#2d3436");
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--border", "rgba(255, 209, 220, 0.5)");
    root.style.setProperty("--primary", "#ffd1dc");
    root.classList.remove("dark");
  } else if (themeId === "neon") {
    root.style.setProperty("--background", "#000000");
    root.style.setProperty("--foreground", "#ffffff");
    root.style.setProperty("--card", "#1a1a1a");
    root.style.setProperty("--border", "rgba(255, 0, 110, 0.5)");
    root.style.setProperty("--primary", "#ff006e");
  } else if (themeId === "forest") {
    root.style.setProperty("--background", "#1a2f1a");
    root.style.setProperty("--foreground", "#e8f5e9");
    root.style.setProperty("--card", "#2d4a2d");
    root.style.setProperty("--border", "rgba(86, 171, 47, 0.3)");
    root.style.setProperty("--primary", "#56ab2f");
  } else if (themeId === "sunset") {
    root.style.setProperty("--background", "#2d1f2d");
    root.style.setProperty("--foreground", "#ffe4e1");
    root.style.setProperty("--card", "#3d2f3d");
    root.style.setProperty("--border", "rgba(255, 153, 102, 0.3)");
    root.style.setProperty("--primary", "#ff9966");
  } else if (themeId === "ocean") {
    root.style.setProperty("--background", "#0f1e2e");
    root.style.setProperty("--foreground", "#e0f7fa");
    root.style.setProperty("--card", "#1a2f3e");
    root.style.setProperty("--border", "rgba(102, 126, 234, 0.3)");
    root.style.setProperty("--primary", "#667eea");
  } else if (themeId === "dark") {
    // Reset to default dark theme
    root.style.removeProperty("--background");
    root.style.removeProperty("--foreground");
    root.style.removeProperty("--card");
    root.style.removeProperty("--border");
    root.style.removeProperty("--primary");
  }
}