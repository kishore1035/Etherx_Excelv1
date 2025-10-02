import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Palette, Droplet, Sparkles } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  children?: React.ReactNode;
}

const PRESET_COLORS = [
  // Row 1: Basics
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
  // Row 2: Pastels
  "#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#e0bbff", "#ffc9de", "#c9ffc4",
  // Row 3: Vibrant
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dfe6e9", "#74b9ff", "#a29bfe",
  // Row 4: Dark
  "#2d3436", "#636e72", "#b2bec3", "#dfe6e9", "#341f97", "#ee5a6f", "#f368e0", "#ff9ff3",
  // Row 5: Neon
  "#ff006e", "#fb5607", "#ffbe0b", "#8338ec", "#3a86ff", "#06ffa5", "#f72585", "#7209b7",
  // Row 6: Earth tones
  "#8d6e63", "#a1887f", "#bcaaa4", "#d7ccc8", "#6d4c41", "#5d4037", "#4e342e", "#3e2723",
  // Row 7: Blues & Greens
  "#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#06d6a0", "#1de9b6", "#00e676",
  // Row 8: Reds & Pinks
  "#d00000", "#e85d04", "#f48c06", "#faa307", "#ffba08", "#ff006e", "#f72585", "#b5179e",
  // Row 9: Purples & Violets
  "#7209b7", "#560bad", "#480ca8", "#3a0ca3", "#3f37c9", "#4361ee", "#4895ef", "#4cc9f0",
  // Row 10: Warm tones
  "#f94144", "#f3722c", "#f8961e", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e",
  // Row 11: Cool grays
  "#495057", "#6c757d", "#adb5bd", "#ced4da", "#dee2e6", "#e9ecef", "#f8f9fa", "#ffffff",
  // Row 12: Aesthetic Gen Z colors
  "#ffc2d1", "#ffe5b4", "#fff0c9", "#c8e7ed", "#b4c7e7", "#dda0dd", "#ffb6c1", "#ffd1dc",
];

const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ff6ec4 0%, #7873f5 50%, #01cdfe 100%)",
  "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #e17055 100%)",
  "linear-gradient(135deg, #74b9ff 0%, #a29bfe 50%, #fd79a8 100%)",
  "linear-gradient(135deg, #00b894 0%, #00cec9 50%, #0984e3 100%)",
];

export function ColorPicker({ value = "#000000", onChange, children }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);
  const [open, setOpen] = useState(false);

  const handleSelect = (color: string) => {
    onChange(color);
    setOpen(false);
    setCustomColor(color);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Palette className="w-4 h-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preset">
              <Palette className="w-4 h-4 mr-1" />
              Preset
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Droplet className="w-4 h-4 mr-1" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="gradient">
              <Sparkles className="w-4 h-4 mr-1" />
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-3">
            <div className="grid grid-cols-8 gap-2 p-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleSelect(color)}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-3">
            <div className="space-y-3 p-2">
              <div>
                <label className="text-sm mb-2 block">Pick a color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onBlur={(e) => handleSelect(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => handleSelect("transparent")}
                >
                  None
                </Button>
                <button
                  onClick={() => handleSelect("#ffffff")}
                  className="h-12 rounded border-2 border-border bg-white"
                />
                <button
                  onClick={() => handleSelect("#808080")}
                  className="h-12 rounded border-2 border-border bg-gray-500"
                />
                <button
                  onClick={() => handleSelect("#000000")}
                  className="h-12 rounded border-2 border-border bg-black"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gradient" className="space-y-3">
            <div className="space-y-2 p-2">
              <p className="text-sm text-muted-foreground">Aesthetic gradients</p>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(gradient)}
                    className="h-16 rounded border-2 border-border hover:scale-105 transition-transform"
                    style={{ background: gradient }}
                    title={`Gradient ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}