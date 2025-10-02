import { useState, useCallback, useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { FormulaBar } from "./FormulaBar";
import { SpreadsheetGrid } from "./SpreadsheetGrid";
import { SheetTabs } from "./SheetTabs";
import { CellContextMenu } from "./CellContextMenu";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { ConditionalFormatting, ConditionalRule } from "./ConditionalFormatting";
import { ChartDialog } from "./ChartDialog";
import { FindReplace } from "./FindReplace";
import { DemoData, generateDemoData } from "./DemoData";
import { Templates, generateTemplate } from "./Templates";
import { ThemeSwitcher, applyTheme } from "./ThemeSwitcher";
import { HelpGuide } from "./HelpGuide";
import { CellComment, Comment } from "./CellComment";
import { ImageInsert } from "./ImageInsert";
import { ImportDialog } from "./ImportDialog";
import { useMockCollaboration } from "./CollaborativeCursors";
import { CollaborationPanel, Collaborator, ShareSettings } from "./CollaborationPanel";
import { VersionHistory, Version } from "./VersionHistory";
import { ActivityLog, ActivityEvent } from "./ActivityLog";
import { NotificationCenter, Notification } from "./NotificationCenter";
import { SettingsDialog, AppSettings } from "./SettingsDialog";
import { DataValidation } from "./DataValidation";
import { FreezePanes } from "./FreezePanes";
import { MergeCells } from "./MergeCells";
import { SortFilter } from "./SortFilter";
import { Sparklines } from "./Sparklines";
import { NamedRanges } from "./NamedRanges";
import { PrintLayout, PrintSettings } from "./PrintLayout";
import { CellProtection } from "./CellProtection";
import { Hyperlinks } from "./Hyperlinks";
import { InsertMenu } from "./InsertMenu";
import { PivotTable, PivotTableData } from "./PivotTable";
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  CloudUpload,
  Keyboard,
  BarChart3,
  Search,
  FileDown,
  FileUp,
  Sparkles,
  Palette,
  LayoutTemplate,
  Home,
  HelpCircle,
  Users,
  Clock,
  Activity,
  Settings as SettingsIcon,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, Cell, User } from "../types/spreadsheet";
import { toast } from "sonner@2.0.3";
import { parseFormula } from "../utils/formulaParser";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX, saveToLocalStorage, loadFromLocalStorage } from "../utils/exportImport";

interface SpreadsheetAppProps {
  user: User;
  onLogout: () => void;
  onBackToHome: () => void;
  showTemplatesOnStart?: boolean;
}

export function SpreadsheetApp({ user, onLogout, onBackToHome, showTemplatesOnStart }: SpreadsheetAppProps) {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState("");
  const [selectedCell, setSelectedCell] = useState("A1");
  const [formula, setFormula] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    cellId: string;
    x: number;
    y: number;
  } | null>(null);
  const [history, setHistory] = useState<Map<string, Cell>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSaving, setIsSaving] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showConditionalFormat, setShowConditionalFormat] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showDemoData, setShowDemoData] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const [aestheticTheme, setAestheticTheme] = useState("dark");
  const [copiedCell, setCopiedCell] = useState<{ cellId: string; cell: Cell } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentCellId, setCommentCellId] = useState("");
  const [comments, setComments] = useState<Map<string, Comment[]>>(new Map());
  const [showImageInsert, setShowImageInsert] = useState(false);
  const [imageCellId, setImageCellId] = useState("");
  const [images, setImages] = useState<Map<string, string>>(new Map());
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [showImport, setShowImport] = useState(false);
  
  // New state for collaboration and advanced features
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // New state for advanced features
  const [showDataValidation, setShowDataValidation] = useState(false);
  const [showFreezePanes, setShowFreezePanes] = useState(false);
  const [showMergeCells, setShowMergeCells] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [showSparklines, setShowSparklines] = useState(false);
  const [showNamedRanges, setShowNamedRanges] = useState(false);
  const [showPrintLayout, setShowPrintLayout] = useState(false);
  const [showCellProtection, setShowCellProtection] = useState(false);
  const [showHyperlinks, setShowHyperlinks] = useState(false);
  const [showPivotTable, setShowPivotTable] = useState(false);
  
  // Mock data for collaboration features
  const [collaboratorsList, setCollaboratorsList] = useState<Collaborator[]>([
    {
      id: "user-1",
      name: user.name,
      email: user.email,
      role: "owner",
      status: "active",
      lastActive: new Date(),
    },
  ]);
  
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    linkSharing: false,
    linkAccess: "viewer",
    allowComments: true,
    allowDownload: true,
    requireLogin: false,
  });
  
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "v1",
      timestamp: new Date(),
      author: user.name,
      authorEmail: user.email,
      changesSummary: "Initial version",
      changesCount: 0,
      isCurrent: true,
      size: "12 KB",
    },
  ]);
  
  const [activities, setActivities] = useState<ActivityEvent[]>([
    {
      id: "a1",
      type: "edit",
      user: user.name,
      userEmail: user.email,
      description: "Created new spreadsheet",
      timestamp: new Date(),
    },
  ]);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    autoSave: true,
    autoSaveInterval: 30,
    showGridLines: true,
    showFormulas: false,
    defaultZoom: 100,
    enableNotifications: true,
    emailNotifications: true,
    commentNotifications: true,
    shareNotifications: true,
    shareUsageData: true,
    allowTracking: false,
    theme: "dark",
    compactMode: false,
    fontSize: "medium",
    enableBetaFeatures: false,
    maxUndoSteps: 50,
    cellLimit: 10,
  });

  const activeSheet = sheets.find((s) => s.id === activeSheetId);
  const collaborators = useMockCollaboration();
  const shareLink = `https://etherx-excel.app/share/${activeSheetId}`;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.sheets.length > 0) {
      setSheets(saved.sheets);
      setActiveSheetId(saved.activeSheetId);
      toast.success("Loaded previous session");
    } else {
      const defaultSheet: Sheet = {
        id: "sheet-1",
        name: "Sheet 1",
        cells: new Map(),
      };
      setSheets([defaultSheet]);
      setActiveSheetId(defaultSheet.id);
    }

    // Show templates if requested
    if (showTemplatesOnStart) {
      setTimeout(() => setShowTemplates(true), 500);
    }
  }, [showTemplatesOnStart]);

  // Auto-save to localStorage
  useEffect(() => {
    if (sheets.length > 0 && activeSheetId) {
      const timer = setTimeout(() => {
        saveToLocalStorage(sheets, activeSheetId);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sheets, activeSheetId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const cell = activeSheet?.cells.get(selectedCell);
    setFormula(cell?.formula || cell?.value || "");
  }, [selectedCell, activeSheet]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "z":
            e.preventDefault();
            handleUndo();
            break;
          case "y":
            e.preventDefault();
            handleRedo();
            break;
          case "c":
            if (!e.shiftKey) {
              e.preventDefault();
              handleCopy();
            }
            break;
          case "x":
            e.preventDefault();
            handleCut();
            break;
          case "v":
            e.preventDefault();
            handlePaste();
            break;
          case "f":
            e.preventDefault();
            setShowFindReplace(true);
            break;
          case "k":
            e.preventDefault();
            setShowShortcuts(true);
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, activeSheet, copiedCell, historyIndex]);

  const saveToHistory = useCallback(
    (cells: Map<string, Cell>) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, new Map(cells)];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleCellChange = useCallback(
    (cellId: string, value: string) => {
      if (!activeSheet) return;

      const newCells = new Map(activeSheet.cells);
      const existingCell = newCells.get(cellId) || {};

      if (value.startsWith("=")) {
        const { value: computedValue, error } = parseFormula(value, newCells);
        newCells.set(cellId, {
          ...existingCell,
          formula: value,
          value: error ? "#ERROR" : computedValue,
        });
      } else {
        newCells.set(cellId, {
          ...existingCell,
          value,
          formula: undefined,
        });
      }

      saveToHistory(activeSheet.cells);

      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
        )
      );
    },
    [activeSheet, activeSheetId, saveToHistory]
  );

  const applyFormatting = useCallback(
    (format: Partial<Cell>) => {
      if (!activeSheet) return;

      const newCells = new Map(activeSheet.cells);
      const existingCell = newCells.get(selectedCell) || {};

      newCells.set(selectedCell, {
        ...existingCell,
        ...format,
      });

      saveToHistory(activeSheet.cells);

      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
        )
      );
    },
    [activeSheet, activeSheetId, selectedCell, saveToHistory]
  );

  const handleUndo = () => {
    if (historyIndex > 0 && activeSheet) {
      const previousCells = history[historyIndex - 1];
      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId ? { ...sheet, cells: previousCells } : sheet
        )
      );
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && activeSheet) {
      const nextCells = history[historyIndex + 1];
      setSheets((prev) =>
        prev.map((sheet) =>
          sheet.id === activeSheetId ? { ...sheet, cells: nextCells } : sheet
        )
      );
      setHistoryIndex((prev) => prev + 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    saveToLocalStorage(sheets, activeSheetId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("Spreadsheet saved!");
  };

  const handleCopy = () => {
    if (!activeSheet) return;
    const cell = activeSheet.cells.get(selectedCell);
    if (cell) {
      setCopiedCell({ cellId: selectedCell, cell });
      toast.success(`Copied ${selectedCell}`);
    }
  };

  const handleCut = () => {
    if (!activeSheet) return;
    const cell = activeSheet.cells.get(selectedCell);
    if (cell) {
      setCopiedCell({ cellId: selectedCell, cell });
      handleCellChange(selectedCell, "");
      toast.success(`Cut ${selectedCell}`);
    }
  };

  const handlePaste = () => {
    if (!copiedCell || !activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    newCells.set(selectedCell, { ...copiedCell.cell });

    saveToHistory(activeSheet.cells);

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    toast.success(`Pasted to ${selectedCell}`);
  };

  const handleConditionalFormat = (rule: ConditionalRule) => {
    if (!activeSheet) return;

    const newCells = new Map(activeSheet.cells);
    
    newCells.forEach((cell, cellId) => {
      let shouldFormat = false;
      const cellValue = parseFloat(cell.value) || 0;
      const ruleValue = parseFloat(rule.value) || 0;

      switch (rule.condition) {
        case "greater":
          shouldFormat = cellValue > ruleValue;
          break;
        case "less":
          shouldFormat = cellValue < ruleValue;
          break;
        case "equal":
          shouldFormat = cellValue === ruleValue;
          break;
        case "between":
          const ruleValue2 = parseFloat(rule.value2 || "0") || 0;
          shouldFormat = cellValue >= ruleValue && cellValue <= ruleValue2;
          break;
        case "contains":
          shouldFormat = cell.value?.toLowerCase().includes(rule.value.toLowerCase()) || false;
          break;
      }

      if (shouldFormat) {
        newCells.set(cellId, {
          ...cell,
          backgroundColor: rule.backgroundColor,
          color: rule.textColor,
        });
      }
    });

    saveToHistory(activeSheet.cells);

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );

    toast.success("Conditional formatting applied!");
  };

  const handleExportCSV = () => {
    if (activeSheet) {
      exportToCSV(activeSheet);
      toast.success("Exported to CSV!");
    }
  };

  const handleExportJSON = () => {
    exportToJSON(sheets);
    toast.success("Exported to JSON!");
  };

  const handleDemoDataGenerate = (type: "sales" | "expenses" | "grades") => {
    if (!activeSheet) return;
    
    const demoCells = generateDemoData(type);
    saveToHistory(activeSheet.cells);
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: demoCells } : sheet
      )
    );
    
    toast.success("Sample data loaded!");
  };

  const handleTemplateSelect = (templateId: string) => {
    if (!activeSheet) return;
    
    const templateCells = generateTemplate(templateId);
    saveToHistory(activeSheet.cells);
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: templateCells } : sheet
      )
    );
    
    toast.success("Template loaded! ✨");
  };

  const handleThemeChange = (themeId: string) => {
    setAestheticTheme(themeId);
    applyTheme(themeId);
    toast.success(`Theme changed to ${themeId}! 🎨`);
  };

  const handleEmojiAdd = (emoji: string) => {
    if (!activeSheet) return;
    const cell = activeSheet.cells.get(selectedCell);
    const currentValue = cell?.value || "";
    handleCellChange(selectedCell, currentValue + emoji);
    toast.success("Emoji added! " + emoji);
  };

  const handleQuickAction = (action: string) => {
    if (!activeSheet) return;
    handleCellChange(selectedCell, action);
    toast.success("Quick action applied!");
  };

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36),
      author: user.name,
      authorInitials: user.name.substring(0, 2).toUpperCase(),
      content,
      timestamp: new Date(),
    };
    
    setComments((prev) => {
      const newMap = new Map(prev);
      const cellComments = newMap.get(commentCellId) || [];
      newMap.set(commentCellId, [...cellComments, newComment]);
      return newMap;
    });
    
    toast.success("Comment added!");
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => {
      const newMap = new Map(prev);
      const cellComments = newMap.get(commentCellId) || [];
      newMap.set(
        commentCellId,
        cellComments.filter((c) => c.id !== commentId)
      );
      return newMap;
    });
    
    toast.success("Comment deleted!");
  };

  const handleInsertImage = (imageUrl: string) => {
    setImages((prev) => {
      const newMap = new Map(prev);
      newMap.set(imageCellId, imageUrl);
      return newMap;
    });
  };

  const handleMultiSelect = (cellIds: string[]) => {
    setSelectedCells(cellIds);
    if (cellIds.length > 0) {
      setSelectedCell(cellIds[0]);
      toast.info(`Selected ${cellIds.length} cells`);
    }
  };

  // Export handlers
  const handleExportPDF = () => {
    if (!activeSheet) return;
    exportToPDF(activeSheet);
    toast.success("Opened PDF preview!");
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "download",
        user: user.name,
        userEmail: user.email,
        description: "Exported spreadsheet to PDF",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  const handleExportXLSX = () => {
    if (!activeSheet) return;
    exportToXLSX(activeSheet);
    toast.success("Exported to Excel format!");
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "download",
        user: user.name,
        userEmail: user.email,
        description: "Exported spreadsheet to XLSX",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  // Collaboration handlers
  const handleInvite = (email: string, role: string) => {
    const newCollaborator: Collaborator = {
      id: Math.random().toString(36),
      name: email.split("@")[0],
      email,
      role: role as "editor" | "viewer",
      status: "pending",
      lastActive: new Date(),
    };
    
    setCollaboratorsList((prev) => [...prev, newCollaborator]);
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "invite",
        user: user.name,
        userEmail: user.email,
        description: `Invited ${email} as ${role}`,
        timestamp: new Date(),
        details: `Role: ${role}`,
      },
      ...prev,
    ]);
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    const collaborator = collaboratorsList.find((c) => c.id === collaboratorId);
    setCollaboratorsList((prev) => prev.filter((c) => c.id !== collaboratorId));
    
    if (collaborator) {
      setActivities((prev) => [
        {
          id: Math.random().toString(36),
          type: "delete",
          user: user.name,
          userEmail: user.email,
          description: `Removed ${collaborator.name} from collaborators`,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    
    toast.success("Collaborator removed");
  };

  const handleChangeRole = (collaboratorId: string, role: string) => {
    setCollaboratorsList((prev) =>
      prev.map((c) => (c.id === collaboratorId ? { ...c, role: role as any } : c))
    );
    toast.success("Role updated");
  };

  const handleUpdateShareSettings = (settings: Partial<ShareSettings>) => {
    setShareSettings((prev) => ({ ...prev, ...settings }));
    toast.success("Share settings updated");
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "share",
        user: user.name,
        userEmail: user.email,
        description: "Updated sharing settings",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  // Version history handlers
  const handleRestoreVersion = (versionId: string) => {
    toast.success("Version restored");
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "edit",
        user: user.name,
        userEmail: user.email,
        description: "Restored previous version",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  const handlePreviewVersion = (versionId: string) => {
    toast.info("Version preview opened");
  };

  const handleExportVersion = (versionId: string) => {
    toast.success("Version exported");
  };

  // Notification handlers
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Handle navigation based on notification type
    if (notification.actionUrl) {
      // Navigate to the URL
    }
  };

  // Settings handlers
  const handleUpdateSettings = (settings: Partial<AppSettings>) => {
    setAppSettings((prev) => ({ ...prev, ...settings }));
  };

  const handleUpdateProfile = (profile: Partial<typeof user>) => {
    // This would update the user in the parent component
    toast.success("Profile updated");
  };

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear all cached data?")) {
      localStorage.clear();
      toast.success("Cache cleared");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      localStorage.clear();
      onLogout();
      toast.success("Account deleted");
    }
  };

  // Import handler
  const handleImport = (cells: Map<string, any>) => {
    if (!activeSheet) return;
    saveToHistory(activeSheet.cells);
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells } : sheet
      )
    );
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "edit",
        user: user.name,
        userEmail: user.email,
        description: "Imported data from file",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  // Data Validation handlers
  const handleApplyValidation = (validation: any) => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell) || {};
    
    newCells.set(selectedCell, {
      ...existingCell,
      validation,
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Validation added to cell!");
  };

  const handleRemoveValidation = () => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell);
    
    if (existingCell) {
      const { validation, ...rest } = existingCell;
      newCells.set(selectedCell, rest);
    }
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Validation removed!");
  };

  // Freeze Panes handlers
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

  // Merge Cells handlers
  const handleMergeCells = (rows: number, cols: number) => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell) || {};
    
    newCells.set(selectedCell, {
      ...existingCell,
      isMergeParent: true,
      mergeSpan: { rows, cols },
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Cells merged!");
  };

  const handleUnmergeCells = () => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell);
    
    if (existingCell) {
      const { isMergeParent, mergeSpan, ...rest } = existingCell;
      newCells.set(selectedCell, rest);
    }
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Cells unmerged!");
  };

  // Sort & Filter handlers
  const handleSort = (columns: Array<{ column: string; direction: 'asc' | 'desc' }>) => {
    toast.success("Data sorted!");
  };

  const handleFilter = (column: string, values: string[]) => {
    toast.success("Filter applied!");
  };

  const handleClearFilter = () => {
    toast.success("Filter cleared!");
  };

  // Sparkline handlers
  const handleAddSparkline = (sparkline: any) => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell) || {};
    
    newCells.set(selectedCell, {
      ...existingCell,
      sparkline,
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Sparkline added!");
  };

  const handleRemoveSparkline = () => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell);
    
    if (existingCell) {
      const { sparkline, ...rest } = existingCell;
      newCells.set(selectedCell, rest);
    }
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Sparkline removed!");
  };

  // Named Ranges handlers
  const handleAddNamedRange = (name: string, range: string) => {
    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === activeSheetId) {
          const namedRanges = new Map(sheet.namedRanges || new Map());
          namedRanges.set(name, range);
          return { ...sheet, namedRanges };
        }
        return sheet;
      })
    );
    toast.success(`Named range "${name}" created!`);
  };

  const handleDeleteNamedRange = (name: string) => {
    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === activeSheetId) {
          const namedRanges = new Map(sheet.namedRanges || new Map());
          namedRanges.delete(name);
          return { ...sheet, namedRanges };
        }
        return sheet;
      })
    );
    toast.success(`Named range "${name}" deleted!`);
  };

  const handleEditNamedRange = (oldName: string, newName: string, range: string) => {
    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === activeSheetId) {
          const namedRanges = new Map(sheet.namedRanges || new Map());
          namedRanges.delete(oldName);
          namedRanges.set(newName, range);
          return { ...sheet, namedRanges };
        }
        return sheet;
      })
    );
    toast.success("Named range updated!");
  };

  // Print Layout handler
  const handlePrint = (settings: PrintSettings) => {
    toast.success("Opening print preview...");
    // In a real app, this would generate a PDF or print preview
    window.print();
  };

  // Cell Protection handlers
  const handleProtectCell = (locked: boolean) => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell) || {};
    
    newCells.set(selectedCell, {
      ...existingCell,
      locked,
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success(locked ? "Cell locked!" : "Cell unlocked!");
  };

  const handleProtectSheet = (password?: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId
          ? { ...sheet, protected: true, protectionPassword: password }
          : sheet
      )
    );
    toast.success("Sheet protected!");
  };

  const handleUnprotectSheet = (password?: string) => {
    const sheet = sheets.find((s) => s.id === activeSheetId);
    if (sheet?.protectionPassword && sheet.protectionPassword !== password) {
      toast.error("Incorrect password!");
      return;
    }
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId
          ? { ...sheet, protected: false, protectionPassword: undefined }
          : sheet
      )
    );
    toast.success("Sheet unprotected!");
  };

  // Hyperlink handlers
  const handleAddHyperlink = (url: string, display?: string) => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell) || {};
    
    newCells.set(selectedCell, {
      ...existingCell,
      hyperlink: url,
      value: display || existingCell.value || url,
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Hyperlink added!");
  };

  const handleRemoveHyperlink = () => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const existingCell = newCells.get(selectedCell);
    
    if (existingCell) {
      const { hyperlink, ...rest } = existingCell;
      newCells.set(selectedCell, rest);
    }
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Hyperlink removed!");
  };

  // Pivot Table handler
  const handleInsertPivotTable = (pivotData: PivotTableData) => {
    if (!activeSheet) return;
    
    // In a real implementation, this would calculate the pivot table
    // For now, we'll insert a mock pivot table
    const newCells = new Map(activeSheet.cells);
    
    // Insert header
    newCells.set(pivotData.targetCell, {
      value: "Pivot Table",
      bold: true,
      backgroundColor: "#e9ecef",
    });
    
    toast.success("Pivot table created successfully!");
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    setActivities((prev) => [
      {
        id: Math.random().toString(36),
        type: "edit",
        user: user.name,
        userEmail: user.email,
        description: "Created a pivot table",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  // Insert menu handlers
  const handleInsertCheckbox = () => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    
    newCells.set(selectedCell, {
      value: "☐",
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Checkbox inserted!");
  };

  const handleInsertDate = () => {
    if (!activeSheet) return;
    const newCells = new Map(activeSheet.cells);
    const today = new Date().toLocaleDateString();
    
    newCells.set(selectedCell, {
      value: today,
    });
    
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, cells: newCells } : sheet
      )
    );
    
    toast.success("Date inserted!");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="w-10 h-10 object-contain"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <>
                <CloudUpload className="w-3 h-3 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-green-500" />
                <span>Auto-saved</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToHome}
            className="hidden md:flex"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTemplates(true)}
            className="hidden lg:flex"
            title="Templates"
          >
            <LayoutTemplate className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThemeSwitcher(true)}
            className="hidden lg:flex"
            title="Themes"
          >
            <Palette className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDemoData(true)}
            className="hidden lg:flex"
            title="Demo Data"
          >
            <Sparkles className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShortcuts(true)}
            className="hidden md:flex"
            title="Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChart(true)}
            className="hidden md:flex"
            title="Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowImport(true)}
            className="hidden md:flex"
            title="Import"
          >
            <FileUp className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFindReplace(true)}
            className="hidden md:flex"
            title="Find & Replace"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp(true)}
            className="hidden md:flex"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md">
            <Users className="w-3 h-3 text-green-500" />
            <span className="text-xs text-muted-foreground">{collaborators.length + 1} online</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCollaboration(true)}
            className="hidden lg:flex"
            title="Share & Collaborate"
          >
            <Users className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVersionHistory(true)}
            className="hidden lg:flex"
            title="Version History"
          >
            <Clock className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActivityLog(true)}
            className="hidden lg:flex"
            title="Activity Log"
          >
            <Activity className="w-4 h-4" />
          </Button>

          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDismiss={handleDismissNotification}
            onNotificationClick={handleNotificationClick}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Export">
                <FileDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileText className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportXLSX}>
                <FileText className="w-4 h-4 mr-2" />
                Export as XLSX/Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <FileText className="w-4 h-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

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
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
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

      {/* Insert Menu & Toolbar */}
      <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2">
        <InsertMenu
          onPivotTable={() => setShowPivotTable(true)}
          onInsertChart={() => setShowChart(true)}
          onInsertImage={() => setShowImageInsert(true)}
          onInsertLink={() => setShowHyperlinks(true)}
          onInsertSparkline={() => setShowSparklines(true)}
          onInsertComment={() => {
            setCommentCellId(selectedCell);
            setShowComment(true);
          }}
          onInsertCheckbox={handleInsertCheckbox}
          onInsertDate={handleInsertDate}
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        onBold={() => {
          const current = activeSheet?.cells.get(selectedCell);
          applyFormatting({ bold: !current?.bold });
        }}
        onItalic={() => {
          const current = activeSheet?.cells.get(selectedCell);
          applyFormatting({ italic: !current?.italic });
        }}
        onUnderline={() => {
          const current = activeSheet?.cells.get(selectedCell);
          applyFormatting({ underline: !current?.underline });
        }}
        onColorChange={(color) => applyFormatting({ color })}
        onBackgroundChange={(color) => applyFormatting({ backgroundColor: color })}
        onEmojiAdd={handleEmojiAdd}
        onQuickAction={handleQuickAction}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSort={() => setShowSortFilter(true)}
        onFilter={() => setShowSortFilter(true)}
        onInsertRow={() => toast.info("Insert row: Right-click on row number")}
        onDeleteRow={() => toast.info("Delete row: Right-click on row number")}
        onConditionalFormat={() => setShowConditionalFormat(true)}
        onFreezePanes={() => setShowFreezePanes(true)}
        onMergeCells={() => setShowMergeCells(true)}
        onDataValidation={() => setShowDataValidation(true)}
        onInsertLink={() => setShowHyperlinks(true)}
        onInsertSparkline={() => setShowSparklines(true)}
        onNamedRanges={() => setShowNamedRanges(true)}
        onCellProtection={() => setShowCellProtection(true)}
        onPrintLayout={() => setShowPrintLayout(true)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
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
        <SpreadsheetGrid
          cells={activeSheet.cells}
          selectedCell={selectedCell}
          selectedCells={selectedCells}
          onCellSelect={setSelectedCell}
          onMultiSelect={handleMultiSelect}
          onCellChange={handleCellChange}
          onCellDoubleClick={(cellId) => setSelectedCell(cellId)}
          onContextMenu={(cellId, x, y) => {
            setSelectedCell(cellId);
            setContextMenu({ cellId, x, y });
          }}
          comments={comments}
          images={images}
        />
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

      {/* Context Menu */}
      {contextMenu && (
        <CellContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onDelete={() => {
            handleCellChange(contextMenu.cellId, "");
            toast.info("Cell cleared");
          }}
          onBold={() => {
            const current = activeSheet?.cells.get(contextMenu.cellId);
            applyFormatting({ bold: !current?.bold });
          }}
          onItalic={() => {
            const current = activeSheet?.cells.get(contextMenu.cellId);
            applyFormatting({ italic: !current?.italic });
          }}
          onUnderline={() => {
            const current = activeSheet?.cells.get(contextMenu.cellId);
            applyFormatting({ underline: !current?.underline });
          }}
          onColor={() => applyFormatting({ color: "#3b82f6" })}
          onComment={() => {
            setCommentCellId(contextMenu.cellId);
            setShowComment(true);
            setContextMenu(null);
          }}
          onInsertImage={() => {
            setImageCellId(contextMenu.cellId);
            setShowImageInsert(true);
            setContextMenu(null);
          }}
        />
      )}

      {/* Dialogs */}
      <KeyboardShortcuts open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      
      <Templates
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleTemplateSelect}
      />

      <ThemeSwitcher
        open={showThemeSwitcher}
        onClose={() => setShowThemeSwitcher(false)}
        currentTheme={aestheticTheme}
        onThemeChange={handleThemeChange}
      />
      
      <DemoData
        open={showDemoData}
        onClose={() => setShowDemoData(false)}
        onGenerate={handleDemoDataGenerate}
      />
      
      <ConditionalFormatting
        open={showConditionalFormat}
        onClose={() => setShowConditionalFormat(false)}
        onApply={handleConditionalFormat}
      />

      <HelpGuide
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <CellComment
        open={showComment}
        onClose={() => setShowComment(false)}
        cellId={commentCellId}
        comments={comments.get(commentCellId) || []}
        currentUser={user}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />

      <ImageInsert
        open={showImageInsert}
        onClose={() => setShowImageInsert(false)}
        onInsert={handleInsertImage}
      />

      <ImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <CollaborationPanel
        open={showCollaboration}
        onClose={() => setShowCollaboration(false)}
        collaborators={collaboratorsList}
        shareSettings={shareSettings}
        shareLink={shareLink}
        currentUserId={collaboratorsList[0]?.id}
        onInvite={handleInvite}
        onRemoveCollaborator={handleRemoveCollaborator}
        onChangeRole={handleChangeRole}
        onUpdateShareSettings={handleUpdateShareSettings}
      />

      <VersionHistory
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        versions={versions}
        onRestore={handleRestoreVersion}
        onPreview={handlePreviewVersion}
        onExport={handleExportVersion}
      />

      <ActivityLog
        open={showActivityLog}
        onClose={() => setShowActivityLog(false)}
        activities={activities}
      />

      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={appSettings}
        user={user}
        onUpdateSettings={handleUpdateSettings}
        onUpdateProfile={handleUpdateProfile}
        onClearCache={handleClearCache}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Advanced Feature Dialogs */}
      <DataValidation
        open={showDataValidation}
        onClose={() => setShowDataValidation(false)}
        currentValidation={activeSheet?.cells.get(selectedCell)?.validation}
        onApply={handleApplyValidation}
        onRemove={handleRemoveValidation}
      />

      <FreezePanes
        open={showFreezePanes}
        onClose={() => setShowFreezePanes(false)}
        currentFrozenRows={activeSheet?.frozenRows}
        currentFrozenCols={activeSheet?.frozenCols}
        onApply={handleApplyFreeze}
        onUnfreeze={handleUnfreeze}
      />

      <MergeCells
        open={showMergeCells}
        onClose={() => setShowMergeCells(false)}
        isMerged={activeSheet?.cells.get(selectedCell)?.isMergeParent}
        onMerge={handleMergeCells}
        onUnmerge={handleUnmergeCells}
      />

      <SortFilter
        open={showSortFilter}
        onClose={() => setShowSortFilter(false)}
        columns={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']}
        onSort={handleSort}
        onFilter={handleFilter}
        onClearFilter={handleClearFilter}
      />

      <Sparklines
        open={showSparklines}
        onClose={() => setShowSparklines(false)}
        currentSparkline={activeSheet?.cells.get(selectedCell)?.sparkline}
        onAdd={handleAddSparkline}
        onRemove={handleRemoveSparkline}
      />

      <NamedRanges
        open={showNamedRanges}
        onClose={() => setShowNamedRanges(false)}
        namedRanges={activeSheet?.namedRanges || new Map()}
        onAdd={handleAddNamedRange}
        onDelete={handleDeleteNamedRange}
        onEdit={handleEditNamedRange}
      />

      <PrintLayout
        open={showPrintLayout}
        onClose={() => setShowPrintLayout(false)}
        onPrint={handlePrint}
      />

      <CellProtection
        open={showCellProtection}
        onClose={() => setShowCellProtection(false)}
        onProtectCell={handleProtectCell}
        onProtectSheet={handleProtectSheet}
        onUnprotectSheet={handleUnprotectSheet}
        isSheetProtected={activeSheet?.protected || false}
        isCellLocked={activeSheet?.cells.get(selectedCell)?.locked || false}
      />

      <Hyperlinks
        open={showHyperlinks}
        onClose={() => setShowHyperlinks(false)}
        currentLink={activeSheet?.cells.get(selectedCell)?.hyperlink}
        onAdd={handleAddHyperlink}
        onRemove={handleRemoveHyperlink}
      />

      <PivotTable
        open={showPivotTable}
        onClose={() => setShowPivotTable(false)}
        cells={activeSheet?.cells || new Map()}
        onInsert={handleInsertPivotTable}
      />

      {activeSheet && (
        <>
          <ChartDialog
            open={showChart}
            onClose={() => setShowChart(false)}
            cells={activeSheet.cells}
          />

          <FindReplace
            open={showFindReplace}
            onClose={() => setShowFindReplace(false)}
            cells={activeSheet.cells}
            onReplace={(updates) => {
              saveToHistory(activeSheet.cells);
              setSheets((prev) =>
                prev.map((sheet) =>
                  sheet.id === activeSheetId ? { ...sheet, cells: updates } : sheet
                )
              );
            }}
          />
        </>
      )}
    </div>
  );
}
