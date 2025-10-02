import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { FormulaHelper } from "./FormulaHelper";

interface FormulaBarProps {
  selectedCell: string;
  formula: string;
  onFormulaChange: (value: string) => void;
  onFormulaSubmit: () => void;
}

export function FormulaBar({
  selectedCell,
  formula,
  onFormulaChange,
  onFormulaSubmit,
}: FormulaBarProps) {
  const [showHelper, setShowHelper] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [helperPosition, setHelperPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setShowHelper(formula.startsWith("=") && formula.length > 1);
    
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setHelperPosition({
        x: rect.left,
        y: rect.bottom + 10,
      });
    }
  }, [formula]);

  return (
    <TooltipProvider>
      <div className="border-b border-border bg-card px-4 py-3 flex items-center gap-4 relative">
        <div className="flex items-center gap-2 min-w-[100px]">
          <Label className="text-muted-foreground">Cell:</Label>
          <div className="px-3 py-1 bg-muted rounded border border-border">
            {selectedCell}
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="mb-2">Enter formulas starting with "="</p>
              <p className="text-sm">Examples: =SUM(A1:A10), =A1+B1, =AVERAGE(B2:B20)</p>
            </TooltipContent>
          </Tooltip>

          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter value or formula (e.g., =SUM(A1:A10))"
            value={formula}
            onChange={(e) => onFormulaChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onFormulaSubmit();
              }
            }}
            className="flex-1"
          />
        </div>

        <FormulaHelper
          formula={formula}
          visible={showHelper}
          position={helperPosition}
        />
      </div>
    </TooltipProvider>
  );
}
