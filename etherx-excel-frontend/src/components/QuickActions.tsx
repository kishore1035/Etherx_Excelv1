import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Zap } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QUICK_ACTIONS = [
  { icon: "✅", label: "Done", value: "✅ Done" },
  { icon: "⏳", label: "In Progress", value: "⏳ In Progress" },
  { icon: "📝", label: "To Do", value: "📝 To Do" },
  { icon: "🔥", label: "Urgent", value: "🔥 Urgent" },
  { icon: "⭐", label: "Important", value: "⭐ Important" },
  { icon: "💡", label: "Idea", value: "💡 Idea" },
  { icon: "❌", label: "Cancelled", value: "❌ Cancelled" },
  { icon: "🎯", label: "Goal", value: "🎯 Goal" },
  { icon: "💰", label: "Money", value: "$" },
  { icon: "📅", label: "Date", value: new Date().toLocaleDateString() },
  { icon: "⏰", label: "Time", value: new Date().toLocaleTimeString() },
  { icon: "✨", label: "Sparkles", value: "✨" },
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Zap className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div>
          <h3 className="mb-3">Quick Actions ⚡</h3>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => onAction(action.value)}
                className="p-3 rounded-lg border border-border hover:bg-accent transition-colors flex flex-col items-center gap-1"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}