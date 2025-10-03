import { Button } from "./ui/button";
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Undo,
  Redo,
  Save,
  FileDown,
  Paintbrush,
  Snowflake,
  Type,
  FileText,
  FolderOpen,
  SaveAll,
  DollarSign,
  Percent,
  Hash,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ColorPalette } from "./ColorPalette";

interface SimpleToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onTextColor: (color: string) => void;
  onFillColor: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onNew: () => void;
  onOpen: () => void;
  onExport: () => void;
  onFreeze: () => void;
  onNumberFormat: (format: 'currency' | 'percentage' | 'number' | 'decimal') => void;
  onAlign: (alignment: 'left' | 'center' | 'right') => void;
  onSortFilter: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentTextColor?: string;
  currentFillColor?: string;
  currentAlignment?: 'left' | 'center' | 'right';
}

export function SimpleToolbar({
  onBold,
  onItalic,
  onUnderline,
  onTextColor,
  onFillColor,
  onUndo,
  onRedo,
  onSave,
  onSaveAs,
  onNew,
  onOpen,
  onExport,
  onFreeze,
  onNumberFormat,
  onAlign,
  onSortFilter,
  canUndo,
  canRedo,
  currentTextColor,
  currentFillColor,
  currentAlignment = 'left',
}: SimpleToolbarProps) {
  return (
    <TooltipProvider>
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2 flex-wrap">
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onNew}>
                <FileText className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New File (Ctrl+N)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onOpen}>
                <FolderOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open (Ctrl+O)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSave}>
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSaveAs}>
                <SaveAll className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save As (Ctrl+Shift+S)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo}>
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo}>
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onBold}>
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold (Ctrl+B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onItalic}>
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic (Ctrl+I)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onUnderline}>
                <Underline className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline (Ctrl+U)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ColorPalette value={currentTextColor} onChange={onTextColor}>
                <Button variant="ghost" size="icon">
                    <div className="relative">
                      <Type className="w-4 h-4" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 rounded text-color-bar" />
                    </div>
                </Button>
              </ColorPalette>
            </TooltipTrigger>
            <TooltipContent>Text Color</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ColorPalette value={currentFillColor} onChange={onFillColor}>
                <Button variant="ghost" size="icon">
                    <div className="relative">
                      <Paintbrush className="w-4 h-4" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 rounded fill-color-bar" />
                    </div>
                </Button>
              </ColorPalette>
            </TooltipTrigger>
            <TooltipContent>Fill Color</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Number Formatting */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DollarSign className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onNumberFormat('currency')}>
                <DollarSign className="w-4 h-4 mr-2" />
                Currency
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNumberFormat('percentage')}>
                <Percent className="w-4 h-4 mr-2" />
                Percentage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNumberFormat('number')}>
                <Hash className="w-4 h-4 mr-2" />
                Number
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onNumberFormat('percentage')}>
                <Percent className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Percentage (%)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onNumberFormat('decimal')}>
                <Hash className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Decimal Places</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentAlignment === 'left' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => onAlign('left')}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentAlignment === 'center' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => onAlign('center')}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentAlignment === 'right' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => onAlign('right')}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Data Manipulation */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSortFilter}>
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sort & Filter</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onSave}>
                  <FileDown className="w-4 h-4" />
                </Button>
            </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
