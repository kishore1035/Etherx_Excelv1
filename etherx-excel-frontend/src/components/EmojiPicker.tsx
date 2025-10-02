import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Smile, Heart, Star, Zap } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  children?: React.ReactNode;
}

const EMOJI_CATEGORIES = {
  smileys: {
    icon: Smile,
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴"],
  },
  hearts: {
    icon: Heart,
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐"],
  },
  symbols: {
    icon: Star,
    emojis: ["⭐", "🌟", "✨", "💫", "⚡", "🔥", "💥", "☄️", "💢", "💦", "💨", "🕳️", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤", "✅", "✔️", "☑️", "❌", "❎", "➕", "➖", "➗", "✖️", "🟰", "💯", "🔢", "🔠", "🔡", "🔤"],
  },
  activities: {
    icon: Zap,
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂"],
  },
  flags: {
    icon: Star,
    emojis: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇺🇳", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿"],
  },
};

export function EmojiPicker({ onSelect, children }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredEmojis = search
    ? Object.values(EMOJI_CATEGORIES)
        .flatMap((cat) => cat.emojis)
        .filter((emoji) => emoji.includes(search))
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Smile className="w-4 h-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Search emoji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          {search ? (
            <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto p-2">
              {filteredEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(emoji);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="text-2xl hover:bg-accent rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <Tabs defaultValue="smileys" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {Object.entries(EMOJI_CATEGORIES).map(([key, { icon: Icon }]) => (
                  <TabsTrigger key={key} value={key} className="px-0">
                    <Icon className="w-4 h-4" />
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(EMOJI_CATEGORIES).map(([key, { emojis }]) => (
                <TabsContent key={key} value={key}>
                  <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto p-2">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelect(emoji)}
                        className="text-2xl hover:bg-accent rounded p-1 transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}