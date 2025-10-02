import { Button } from "./ui/button";
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Undo,
  Redo,
  ArrowUpDown,
  Filter,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  Sparkles,
  Smile,
  Paintbrush,
  Snowflake,
  Merge,
  Lock,
  Link,
  TrendingUp,
  Bookmark,
  Printer,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ColorPicker } from "./ColorPicker";
import { EmojiPicker } from "./EmojiPicker";
import { QuickActions } from "./QuickActions";

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onColorChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
  onEmojiAdd: (emoji: string) => void;
  onQuickAction: (action: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSort: () => void;
  onFilter: () => void;
  onInsertRow: () => void;
  onDeleteRow: () => void;
  onConditionalFormat: () => void;
  onFreezePanes?: () => void;
  onMergeCells?: () => void;
  onDataValidation?: () => void;
  onInsertLink?: () => void;
  onInsertSparkline?: () => void;
  onNamedRanges?: () => void;
  onCellProtection?: () => void;
  onPrintLayout?: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  onBold,
  onItalic,
  onUnderline,
  onColorChange,
  onBackgroundChange,
  onEmojiAdd,
  onQuickAction,
  onUndo,
  onRedo,
  onSort,
  onFilter,
  onInsertRow,
  onDeleteRow,
  onConditionalFormat,
  onFreezePanes,
  onMergeCells,
  onDataValidation,
  onInsertLink,
  onInsertSparkline,
  onNamedRanges,
  onCellProtection,
  onPrintLayout,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2 flex-wrap">
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

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <ColorPicker onChange={onColorChange}>
                <Button variant="ghost" size="icon">
                  <Palette className="w-4 h-4" />
                </Button>
              </ColorPicker>
            </TooltipTrigger>
            <TooltipContent>Text Color</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ColorPicker onChange={onBackgroundChange}>
                <Button variant="ghost" size="icon">
                  <Paintbrush className="w-4 h-4" />
                </Button>
              </ColorPicker>
            </TooltipTrigger>
            <TooltipContent>Fill Color</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <EmojiPicker onSelect={onEmojiAdd}>
                <Button variant="ghost" size="icon">
                  <Smile className="w-4 h-4" />
                </Button>
              </EmojiPicker>
            </TooltipTrigger>
            <TooltipContent>Add Emoji</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <QuickActions onAction={onQuickAction} />
            </TooltipTrigger>
            <TooltipContent>Quick Actions</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSort}>
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sort</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onFilter}>
                <Filter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filter</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onConditionalFormat}>
                <Sparkles className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Conditional Formatting</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          {onFreezePanes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onFreezePanes}>
                  <Snowflake className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Freeze Panes</TooltipContent>
            </Tooltip>
          )}

          {onMergeCells && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onMergeCells}>
                  <Merge className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Merge Cells</TooltipContent>
            </Tooltip>
          )}

          {onDataValidation && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDataValidation}>
                  <Filter className="w-4 h-4 text-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Data Validation</TooltipContent>
            </Tooltip>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          {onInsertLink && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onInsertLink}>
                  <Link className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Hyperlink</TooltipContent>
            </Tooltip>
          )}

          {onInsertSparkline && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onInsertSparkline}>
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Sparkline</TooltipContent>
            </Tooltip>
          )}

          {onNamedRanges && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onNamedRanges}>
                  <Bookmark className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Named Ranges</TooltipContent>
            </Tooltip>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          {onCellProtection && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onCellProtection}>
                  <Lock className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cell Protection</TooltipContent>
            </Tooltip>
          )}

          {onPrintLayout && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onPrintLayout}>
                  <Printer className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Layout</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onInsertRow}>
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Row</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDeleteRow}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Row</TooltipContent>
          </Tooltip>
        </div>

        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden lg:inline">Press Ctrl+K for shortcuts</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
