import { useState, useCallback, useEffect } from "react";
import { SimpleToolbar } from "./SimpleToolbar";
import { FormulaBar } from "./FormulaBar";
import { SpreadsheetGrid } from "./SpreadsheetGrid";
import { SheetTabs } from "./SheetTabs";
import { SaveDialog } from "./SaveDialog";
import { ExportDialog } from "./ExportDialog";
import { FreezePanes } from "./FreezePanes";
import { FormulaHelper } from "./FormulaHelper";
import { QuickAnalysisMenu } from "./QuickAnalysisMenu";
import { DataTransformationEditor } from "./DataTransformationEditor";
import { DataModelView } from "./DataModelView";
import { AdvancedPivotTableBuilder } from "./AdvancedPivotTableBuilder";
import { DashboardBuilder } from "./DashboardBuilder";
import { AdvancedVersionHistory } from "./AdvancedVersionHistory";
import { AdvancedFeaturesMenu } from "./AdvancedFeaturesMenu";
import { WelcomeModal } from "./WelcomeModal";
import { GuidedTour } from "./GuidedTour";
import { GamesHub } from "./GamesHub";
import { GradebookGuruGame } from "./GradebookGuruGame";
import { AchievementsPage } from "./AchievementsPage";
import { BadgeNotification } from "./BadgeNotification";
import { LearningStreak } from "./LearningStreak";
import logoImage from "../assets/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  LogOut,
  Moon,
  Sun,
  Home,
  Bell,
  Check,
  /* Bot icon removed */
  Database,
  Workflow,
  LayoutDashboard,
  TableIcon,
  Clock,
  Sparkles,
  Trophy,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Sheet, Cell, User } from "../types/spreadsheet";
import { toast } from "sonner";
import { parseFormula } from "../utils/formulaParser";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX, saveToLocalStorage, loadFromLocalStorage } from "../utils/exportImport";

interface SimplifiedSpreadsheetAppProps {
  user: User;
  onLogout: () => void;
  onBackToHome: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export function SimplifiedSpreadsheetApp({ user, onLogout, onBackToHome, theme, onThemeChange }: SimplifiedSpreadsheetAppProps) {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState("");
  const [selectedCell, setSelectedCell] = useState("A1");
  const [formula, setFormula] = useState("");
  const [history, setHistory] = useState<Map<string, Cell>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [filename, setFilename] = useState("Untitled");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFreezePanes, setShowFreezePanes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; read: boolean }>>([
    { id: "1", message: "Welcome to EtherX Excel! Your work auto-saves.", read: false },
  ]);

  // Advanced features state
  // AIChatbot removed
  const [showDataTransformation, setShowDataTransformation] = useState(false);
  const [showDataModel, setShowDataModel] = useState(false);
  const [showPivotBuilder, setShowPivotBuilder] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Learning features state
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [showGamesHub, setShowGamesHub] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [badgeNotification, setBadgeNotification] = useState<any>(null);

  // Formula helper state
  const [showFormulaHelper, setShowFormulaHelper] = useState(false);
  const [formulaHelperPosition, setFormulaHelperPosition] = useState({ x: 0, y: 0 });

  // Quick analysis state
  const [showQuickAnalysis, setShowQuickAnalysis] = useState(false);
  const [quickAnalysisPosition, setQuickAnalysisPosition] = useState({ x: 0, y: 0 });
  const [quickAnalysisRange, setQuickAnalysisRange] = useState("");

  const activeSheet = sheets.find((s) => s.id === activeSheetId);

  // Initialize
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.sheets.length > 0) {
      setSheets(saved.sheets);
      setActiveSheetId(saved.activeSheetId);
      toast.success("Loaded previous session");
    } else {
      const newSheet: Sheet = {
        id: "sheet-1",
        name: "Sheet 1",
        cells: new Map(),
      };
      setSheets([newSheet]);
      setActiveSheetId(newSheet.id);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (sheets.length > 0) {
      const timer = setTimeout(() => {
      saveToLocalStorage(sheets, activeSheetId);
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sheets, activeSheetId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
          e.preventDefault();
          handleSave();
        } else if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  const saveToHistory = (cells: Map<string, Cell>) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(new Map(cells));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && activeSheet) {
      setHistoryIndex(historyIndex - 1);
      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId
            ? { ...sheet, cells: new Map(history[historyIndex - 1]) }
            : sheet
        )
      );
      toast.success("Undone");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && activeSheet) {
      setHistoryIndex(historyIndex + 1);
      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId
            ? { ...sheet, cells: new Map(history[historyIndex + 1]) }
            : sheet
        )
      );
      toast.success("Redone");
    }
  };

  const handleCellChange = useCallback(
    (cellId: string, value: string) => {
      if (!activeSheet) return;

      saveToHistory(activeSheet.cells);

      const newCells = new Map(activeSheet.cells);
      const existingCell = newCells.get(cellId) || {};

      if (value.startsWith("=")) {
        const result = parseFormula(value, newCells);
        newCells.set(cellId, {
          ...existingCell,
          value: result.value,
          formula: value,
        });
      } else {
        newCells.set(cellId, {
          ...existingCell,
          value,
          formula: undefined,
        });
      }

      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
        )
      );

      setFormula("");
    },
    [activeSheet, activeSheetId]
  );

  const applyFormatting = (formatting: Partial<Cell>) => {
    if (!activeSheet) return;

    saveToHistory(activeSheet.cells);

    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell) || {};

    newCells.set(selectedCell, {
      ...existingCell,
      ...formatting,
      value: ("value" in existingCell ? (existingCell as Cell).value : "")
    });

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
  };

  const handleNumberFormat = (format: 'currency' | 'percentage' | 'number' | 'decimal') => {
    if (!activeSheet) return;
    
    const currentCell = activeSheet.cells.get(selectedCell);
    const currentValue = currentCell?.value || "";
    
    let formattedValue = currentValue;
    let numberFormat = format;
    
    // Try to parse the current value as a number
    let numericValue = parseFloat(currentValue.replace(/[$,%]/g, ''));
    if (isNaN(numericValue)) {
      toast.error("Selected cell does not contain a valid number");
      return;
    }
    
    if (format === 'currency') {
      formattedValue = `${numericValue.toFixed(2)}`;
    } else if (format === 'percentage') {
      // If the value is already between 0-1, multiply by 100; otherwise assume it's already a percentage
      const percentValue = numericValue <= 1 ? numericValue * 100 : numericValue;
      formattedValue = `${percentValue.toFixed(2)}%`;
    } else if (format === 'number') {
      formattedValue = numericValue.toLocaleString();
    } else if (format === 'decimal') {
      formattedValue = numericValue.toFixed(2);
    }
    
    applyFormatting({ value: formattedValue, numberFormat: format });
    toast.success(`Applied ${format} formatting to ${selectedCell}: ${formattedValue}`);
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    applyFormatting({ textAlign: alignment });
    toast.success(`Text aligned ${alignment}`);
  };

  const handleNewFile = () => {
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      name: "Sheet 1",
      cells: new Map(),
    };
    setSheets([newSheet]);
    setActiveSheetId(newSheet.id);
    setFilename("Untitled");
    setHistory([]);
    setHistoryIndex(-1);
    toast.success("New file created");
  };

  const handleOpenFile = () => {
    // For demo purposes, simulate opening a file
    toast.info("File open dialog would appear here");
  };

  const handleSortFilter = () => {
    // For demo purposes, show a simple message
    toast.info("Sort & Filter panel would open here");
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleSaveAs = async (newFilename: string) => {
    setFilename(newFilename);
    // If user is logged in, save to backend
    if (user && user.token) {
      try {
        const sheetToSave = sheets.find(s => s.id === activeSheetId);
        if (!sheetToSave) throw new Error("No active sheet to save");
        const payload = {
          name: newFilename,
          data: { cells: Array.from(sheetToSave.cells.entries()) }
        };
        // If sheet has a backend ID, update, else create
        const url = sheetToSave._id
          ? `/api/spreadsheets/${sheetToSave._id}`
          : `/api/spreadsheets`;
        const method = sheetToSave._id ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to save to backend");
        const savedSheet = await res.json();
        // Update local sheet with backend ID if new
        if (!sheetToSave._id && savedSheet._id) {
          setSheets(prev => prev.map(s =>
            s.id === sheetToSave.id ? { ...s, _id: savedSheet._id } : s
          ));
        }
        toast.success(`Saved to cloud as "${newFilename}"`);
      } catch (err) {
        toast.error("Cloud save failed, saving locally.");
        saveToLocalStorage(sheets, activeSheetId);
      }
    } else {
      saveToLocalStorage(sheets, activeSheetId);
      toast.success(`Saved locally as "${newFilename}"`);
    }
  };

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf' | 'json') => {
    if (!activeSheet) return;

    switch (format) {
      case 'csv':
        exportToCSV(activeSheet);
        break;
      case 'xlsx':
        exportToXLSX(activeSheet);
        break;
      case 'pdf':
        exportToPDF(activeSheet);
        break;
      case 'json':
        exportToJSON(sheets);
        break;
    }

    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handleApplyFreeze = (rows: number, cols: number) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId
          ? { ...sheet, frozenRows: rows, frozenCols: cols }
          : sheet
      )
    );
    toast.success(`Frozen ${rows} row(s) and ${cols} column(s)!`);
  };

  const handleUnfreeze = () => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId
          ? { ...sheet, frozenRows: 0, frozenCols: 0 }
          : sheet
      )
    );
    toast.success("Panes unfrozen!");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle formula helper visibility
  useEffect(() => {
    if (formula && formula.startsWith("=")) {
      setShowFormulaHelper(true);
      // Position near the formula bar with better viewport awareness
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
      
      // Position below the formula bar but ensure it stays in viewport
      const x = Math.min(300, windowWidth - 350); // Leave space for the tooltip width
      const y = Math.min(140, windowHeight - 250); // Leave space for the tooltip height
      
      setFormulaHelperPosition({ x, y });
    } else {
      setShowFormulaHelper(false);
    }
  }, [formula]);

  const handleQuickAnalysis = (cellIds: string[]) => {
    if (cellIds.length > 1) {
      // Calculate position relative to viewport center to avoid edge issues
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
      const x = Math.max(100, windowWidth / 2 - 150);
      const y = Math.max(100, windowHeight / 2 - 200);
      
      setQuickAnalysisPosition({ x, y });
      setQuickAnalysisRange(`${cellIds[0]}:${cellIds[cellIds.length - 1]}`);
      setShowQuickAnalysis(true);
    }
  };

  const handleQuickAnalysisAction = (action: string, type?: string) => {
    if (!activeSheet) return;

    // Implement actual functionality for the quick analysis
    if (action === "total" && type) {
      // Calculate and apply the requested total function
      const rangeCells = getRangeFromString(quickAnalysisRange);
      const values = rangeCells.map(cellId => {
        const cell = activeSheet.cells.get(cellId);
        const num = parseFloat(cell?.value || "0");
        return isNaN(num) ? 0 : num;
      }).filter(val => val !== 0);
      
      let result = 0;
      switch (type) {
        case "sum":
          result = values.reduce((a, b) => a + b, 0);
          break;
        case "average":
          result = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          break;
        case "count":
          result = values.length;
          break;
        case "max":
          result = values.length > 0 ? Math.max(...values) : 0;
          break;
        case "min":
          result = values.length > 0 ? Math.min(...values) : 0;
          break;
      }
      
      // Find the next empty cell below the selection to put the result
      const lastCell = rangeCells[rangeCells.length - 1];
      const match = lastCell.match(/([A-Z]+)(\d+)/);
      if (match) {
        const col = match[1];
        const row = parseInt(match[2]) + 1;
        const resultCell = `${col}${row}`;
        handleCellChange(resultCell, result.toString());
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} calculated: ${result}`);
    } else if (action === "chart") {
  toast.success(`${(type ?? "").charAt(0).toUpperCase() + (type ?? "").slice(1)} chart created from selection`);
    } else if (action === "format") {
      // Apply conditional formatting to the selected range
      const rangeCells = getRangeFromString(quickAnalysisRange);
      rangeCells.forEach(cellId => {
        const cell = activeSheet.cells.get(cellId);
        const value = parseFloat(cell?.value || "0");
        
        if (type === "colorscale" && !isNaN(value)) {
          // Simple red-yellow-green color scale
          const color = value > 50 ? "#22c55e" : value > 25 ? "#eab308" : "#ef4444";
          applyFormattingToCell(cellId, { backgroundColor: color });
        } else if (type === "databars") {
          // Add a subtle background for data bars effect
          applyFormattingToCell(cellId, { backgroundColor: "#3b82f620" });
        } else if (type === "iconsets") {
          // Add different background colors to simulate icon sets
          const bgColor = value > 50 ? "#22c55e20" : value > 25 ? "#eab30820" : "#ef444420";
          applyFormattingToCell(cellId, { backgroundColor: bgColor });
        }
      });
      
  toast.success(`${(type ?? "").charAt(0).toUpperCase() + (type ?? "").slice(1)} formatting applied`);
    }
    
    setShowQuickAnalysis(false);
  };

  // Helper function to get all cells in a range
  const getRangeFromString = (range: string): string[] => {
    const [start, end] = range.split(':');
    if (!end) return [start];
    
    const startMatch = start.match(/([A-Z]+)(\d+)/);
    const endMatch = end.match(/([A-Z]+)(\d+)/);
    
    if (!startMatch || !endMatch) return [start];
    
    const startCol = startMatch[1];
    const startRow = parseInt(startMatch[2]);
    const endCol = endMatch[1];
    const endRow = parseInt(endMatch[2]);
    
    const cells: string[] = [];
    const startColIndex = startCol.charCodeAt(0) - 65;
    const endColIndex = endCol.charCodeAt(0) - 65;
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startColIndex; col <= endColIndex; col++) {
        const colName = String.fromCharCode(65 + col);
        cells.push(`${colName}${row}`);
      }
    }
    
    return cells;
  };

  // Helper function to apply formatting to a specific cell
  const applyFormattingToCell = (cellId: string, formatting: Partial<Cell>) => {
    if (!activeSheet) return;

    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(cellId) || {};

    newCells.set(cellId, {
      ...existingCell,
      ...formatting,
      value: ("value" in existingCell ? (existingCell as Cell).value : "")
    });

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoImage} alt="Logo" className="w-10 h-10 object-contain" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">{filename}</h1>
            {isSaving && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Learning Streak */}
          <LearningStreak
            currentStreak={3}
            longestStreak={7}
            totalDays={15}
          />

          {/* Advanced Features Menu */}
          <AdvancedFeaturesMenu
            onAIChatbot={() => {}}
            onPowerQuery={() => setShowDataTransformation(true)}
            onDataModel={() => setShowDataModel(true)}
            onPivotTable={() => setShowPivotBuilder(true)}
            onDashboard={() => setShowDashboard(true)}
            onVersionHistory={() => setShowVersionHistory(true)}
            onFlashFill={() => toast.info("Flash Fill: Start typing a pattern and we'll suggest completions")}
          />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b border-border">
                <h3 className="font-medium">Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-2 p-3"
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  )}
                  <span className={notification.read ? "text-muted-foreground" : ""}>
                    {notification.message}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Advanced Features */}
          <Button
            variant="ghost"
            size="icon"
            // onClick for AIChatbot removed
            title="AI Assistant"
          >
            {/* Bot icon removed */}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            title="Version History"
          >
            <Clock className="w-4 h-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-2">
                <p className="text-sm">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onBackToHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowGamesHub(true)}>
                <Trophy className="w-4 h-4 mr-2" />
                Formula Games
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAchievements(true)}>
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Advanced Features Toolbar */}
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowDataTransformation(true)}
        >
          <Workflow className="w-4 h-4" />
          Power Query
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowDataModel(true)}
        >
          <Database className="w-4 h-4" />
          Data Model
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowPivotBuilder(true)}
        >
          <TableIcon className="w-4 h-4" />
          PivotTable
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowDashboard(true)}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Flash Fill
        </Button>
      </div>

      {/* Toolbar */}
      <SimpleToolbar
        onBold={() => {
          const current = activeSheet?.cells.get(selectedCell);
          const newBold = !current?.bold;
          applyFormatting({ bold: newBold });
          toast.success(`Text ${newBold ? 'bold' : 'normal'} applied`);
        }}
        onItalic={() => {
          const current = activeSheet?.cells.get(selectedCell);
          const newItalic = !current?.italic;
          applyFormatting({ italic: newItalic });
          toast.success(`Text ${newItalic ? 'italic' : 'normal'} applied`);
        }}
        onUnderline={() => {
          const current = activeSheet?.cells.get(selectedCell);
          const newUnderline = !current?.underline;
          applyFormatting({ underline: newUnderline });
          toast.success(`Text ${newUnderline ? 'underlined' : 'normal'} applied`);
        }}
        onTextColor={(color) => {
          applyFormatting({ color });
          toast.success(`Text color applied`);
        }}
        onFillColor={(color) => {
          applyFormatting({ backgroundColor: color });
          toast.success(`Fill color applied`);
        }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onSaveAs={() => setShowSaveDialog(true)}
        onNew={handleNewFile}
        onOpen={handleOpenFile}
        onExport={() => setShowExportDialog(true)}
        onFreeze={() => setShowFreezePanes(true)}
        onNumberFormat={handleNumberFormat}
        onAlign={handleAlign}
        onSortFilter={handleSortFilter}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        currentTextColor={activeSheet?.cells.get(selectedCell)?.color}
        currentFillColor={activeSheet?.cells.get(selectedCell)?.backgroundColor}
        currentAlignment={activeSheet?.cells.get(selectedCell)?.textAlign || 'left'}
      />

      {/* Formula Bar */}
      <FormulaBar
        selectedCell={selectedCell}
        formula={formula}
        onFormulaChange={setFormula}
        onFormulaSubmit={() => handleCellChange(selectedCell, formula)}
      />

      {/* Spreadsheet Grid */}
      {activeSheet && (
        <div className="spreadsheet-container flex-1">
          <SpreadsheetGrid
            cells={activeSheet.cells}
            selectedCell={selectedCell}
            selectedCells={[]}
            onCellSelect={setSelectedCell}
            onMultiSelect={handleQuickAnalysis}
            onCellChange={handleCellChange}
            onCellDoubleClick={(cellId) => {
              setSelectedCell(cellId);
              const cell = activeSheet.cells.get(cellId);
              if (cell?.formula) {
                setFormula(cell.formula);
              }
            }}
            onContextMenu={() => {}}
            onQuickAnalysis={handleQuickAnalysis}
            onFilter={(column, values) => {
              toast.success(`Applied filter to column ${column}: ${values.length} items selected`);
            }}
            activeFilters={new Map()}
            comments={new Map()}
            images={new Map()}
          />
        </div>
      )}

      {/* Sheet Tabs */}
      <SheetTabs
        sheets={sheets}
        activeSheetId={activeSheetId}
        onSheetSelect={setActiveSheetId}
        onSheetAdd={() => {
          const newSheet: Sheet = {
            id: `sheet-${Date.now()}`,
            name: `Sheet ${sheets.length + 1}`,
            cells: new Map(),
          };
          setSheets([...sheets, newSheet]);
          setActiveSheetId(newSheet.id);
          toast.success(`Created ${newSheet.name}`);
        }}
        onSheetDelete={(sheetId) => {
          if (sheets.length === 1) {
            toast.error("Cannot delete the last sheet");
            return;
          }
          const newSheets = sheets.filter((s) => s.id !== sheetId);
          setSheets(newSheets);
          if (activeSheetId === sheetId) {
            setActiveSheetId(newSheets[0].id);
          }
          toast.success("Sheet deleted");
        }}
        onSheetRename={(sheetId, newName) => {
          setSheets((prev) =>
            prev.map((sheet) =>
              sheet.id === sheetId ? { ...sheet, name: newName } : sheet
            )
          );
          toast.success("Sheet renamed");
        }}
      />

      {/* Dialogs */}
      <SaveDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveAs}
        currentFilename={filename}
      />

      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
      />

      <FreezePanes
        open={showFreezePanes}
        onClose={() => setShowFreezePanes(false)}
        currentFrozenRows={activeSheet?.frozenRows}
        currentFrozenCols={activeSheet?.frozenCols}
        onApply={handleApplyFreeze}
        onUnfreeze={handleUnfreeze}
      />

      {/* Advanced Features Components */}
      {/* AIChatbot removed */}

      <AdvancedVersionHistory
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
      />

      <AdvancedPivotTableBuilder
        open={showPivotBuilder}
        onClose={() => setShowPivotBuilder(false)}
      />

      <DataTransformationEditor
        open={showDataTransformation}
        onClose={() => setShowDataTransformation(false)}
        onApply={(steps) => {
          toast.success(`Applied ${steps.length} transformation steps`);
          setShowDataTransformation(false);
        }}
      />

      <DataModelView
        open={showDataModel}
        onClose={() => setShowDataModel(false)}
      />

      <DashboardBuilder
        open={showDashboard}
        onClose={() => setShowDashboard(false)}
      />

      {/* Learning Features Components */}
      <WelcomeModal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onStartTour={() => setShowGuidedTour(true)}
        onOpenGames={() => setShowGamesHub(true)}
        userName={user.name}
      />

      <GuidedTour
        active={showGuidedTour}
        onComplete={() => {
          setShowGuidedTour(false);
          setBadgeNotification({
            title: "First Steps",
            description: "You completed the guided tour!",
            rarity: "common",
          });
          toast.success("Guided tour completed! 🎉");
        }}
        onSkip={() => setShowGuidedTour(false)}
      />

      <GamesHub
        open={showGamesHub}
        onClose={() => setShowGamesHub(false)}
        onStartGame={(gameId) => {
          setActiveGame(gameId);
          setShowGamesHub(false);
        }}
      />

      {activeGame === "gradebook-guru" && (
        <GradebookGuruGame
          onComplete={() => {
            setActiveGame(null);
            setBadgeNotification({
              title: "Gradebook Master",
              description: "Completed The Gradebook Guru game!",
              rarity: "rare",
            });
            toast.success("Game completed! Badge earned! 🏆");
          }}
          onClose={() => setActiveGame(null)}
        />
      )}

      <AchievementsPage
        open={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      {badgeNotification && (
        <BadgeNotification
          {...badgeNotification}
          show={!!badgeNotification}
          onClose={() => setBadgeNotification(null)}
        />
      )}

      {/* Formula Helper */}
      <FormulaHelper
        formula={formula}
        visible={showFormulaHelper}
        position={formulaHelperPosition}
      />

      {/* Quick Analysis Menu */}
      {showQuickAnalysis && (
        <QuickAnalysisMenu
          position={quickAnalysisPosition}
          selectedRange={quickAnalysisRange}
          onAction={handleQuickAnalysisAction}
          onClose={() => setShowQuickAnalysis(false)}
        />
      )}
    </div>
  );
}
