import { useState, useRef, useEffect } from "react";
import { Cell } from "../types/spreadsheet";
import { motion } from "motion/react";
import { FilterDropdown } from "./FilterDropdown";

interface SpreadsheetGridProps {
  cells: Map<string, Cell>;
  selectedCell: string;
  selectedCells?: string[];
  onCellSelect: (cellId: string) => void;
  onMultiSelect?: (cellIds: string[]) => void;
  onCellChange: (cellId: string, value: string) => void;
  onCellDoubleClick: (cellId: string) => void;
  onContextMenu: (cellId: string, x: number, y: number) => void;
  onQuickAnalysis?: (cellIds: string[]) => void;
  onFilter?: (column: string, values: string[]) => void;
  activeFilters?: Map<string, string[]>;
  comments?: Map<string, any[]>;
  images?: Map<string, string>;
}

const ROWS = 100;
const COLS = 26;
const CELL_WIDTH = 120;
const CELL_HEIGHT = 32;
const HEADER_HEIGHT = 32;

function getColumnName(index: number): string {
  let name = "";
  let num = index;
  while (num >= 0) {
    name = String.fromCharCode(65 + (num % 26)) + name;
    num = Math.floor(num / 26) - 1;
  }
  return name;
}

export function SpreadsheetGrid({
  cells,
  selectedCell,
  selectedCells = [],
  onCellSelect,
  onMultiSelect,
  onCellChange,
  onCellDoubleClick,
  onContextMenu,
  onQuickAnalysis,
  onFilter,
  activeFilters = new Map(),
  comments = new Map(),
  images = new Map(),
}: SpreadsheetGridProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [columnWidths, setColumnWidths] = useState<number[]>(Array(COLS).fill(CELL_WIDTH));
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Enable direct typing on selected cell
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) return;
      
      // Check if user is typing alphanumeric or special chars
      if (
        (e.key.length === 1 && !e.ctrlKey && !e.metaKey) ||
        e.key === "=" ||
        e.key === "Backspace" ||
        e.key === "Delete"
      ) {
        const cell = cells.get(selectedCell);
        const currentValue = cell?.formula || cell?.value || "";
        
        if (e.key === "Backspace" || e.key === "Delete") {
          setEditValue("");
        } else {
          setEditValue(e.key);
        }
        
        setEditingCell(selectedCell);
        e.preventDefault();
      } else if (e.key === "Enter" || e.key === "F2") {
        const cell = cells.get(selectedCell);
        setEditValue(cell?.formula || cell?.value || "");
        setEditingCell(selectedCell);
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, editingCell, cells]);

  const handleCellClick = (cellId: string) => {
    if (editingCell && editingCell !== cellId) {
      handleEditComplete();
    }
    onCellSelect(cellId);
    setEditingCell(null);
  };

  const handleCellDoubleClick = (cellId: string) => {
    const cell = cells.get(cellId);
    setEditingCell(cellId);
    setEditValue(cell?.formula || cell?.value || "");
    onCellDoubleClick(cellId);
  };

  const handleEditComplete = () => {
    if (editingCell) {
      onCellChange(editingCell, editValue);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleContextMenu = (e: React.MouseEvent, cellId: string) => {
    e.preventDefault();
    onContextMenu(cellId, e.clientX, e.clientY);
  };

  const handleRowClick = (rowIndex: number) => {
    const cellIds: string[] = [];
    for (let i = 0; i < COLS; i++) {
      cellIds.push(`${getColumnName(i)}${rowIndex + 1}`);
    }
    onMultiSelect?.(cellIds);
    
    // Trigger quick analysis for multi-cell selection
    if (cellIds.length > 1) {
      onQuickAnalysis?.(cellIds);
    }
  };

  const handleColumnClick = (colIndex: number) => {
    const cellIds: string[] = [];
    const colName = getColumnName(colIndex);
    for (let i = 0; i < ROWS; i++) {
      cellIds.push(`${colName}${i + 1}`);
    }
    onMultiSelect?.(cellIds);
    
    // Trigger quick analysis for multi-cell selection
    if (cellIds.length > 1) {
      onQuickAnalysis?.(cellIds);
    }
  };

  const handleColumnResize = (colIndex: number, delta: number) => {
    setColumnWidths(prev => {
      const newWidths = [...prev];
      newWidths[colIndex] = Math.max(50, newWidths[colIndex] + delta);
      return newWidths;
    });
  };

  const handleMouseDown = (e: React.MouseEvent, colIndex: number) => {
    if (e.nativeEvent.offsetX > columnWidths[colIndex] - 10) {
      setDraggedColumn(colIndex);
      setDragStartX(e.clientX);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedColumn !== null) {
      const delta = e.clientX - dragStartX;
      handleColumnResize(draggedColumn, delta);
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setDraggedColumn(null);
  };

  const handleAutoFitColumn = (colIndex: number) => {
    const colName = getColumnName(colIndex);
    let maxWidth = 80;
    
    for (let i = 0; i < ROWS; i++) {
      const cellId = `${colName}${i + 1}`;
      const cell = cells.get(cellId);
      if (cell?.value) {
        const width = Math.min(200, cell.value.toString().length * 8 + 20);
        maxWidth = Math.max(maxWidth, width);
      }
    }
    
    setColumnWidths(prev => {
      const newWidths = [...prev];
      newWidths[colIndex] = maxWidth;
      return newWidths;
    });
  };



  const handleFillDown = (startCell: string) => {
    // Simple fill down implementation
    const match = startCell.match(/([A-Z]+)(\d+)/);
    if (!match) return;
    
    const col = match[1];
    const startRow = parseInt(match[2]);
    const startValue = cells.get(startCell)?.value;
    
    if (startValue) {
      for (let i = startRow + 1; i <= startRow + 5; i++) {
        const cellId = `${col}${i}`;
        onCellChange(cellId, startValue.toString());
      }
    }
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-background">
      <div className="inline-block min-w-full">
        {/* Column Headers */}
        <div className="flex sticky top-0 z-20 bg-muted border-b border-border">
          <div
            className="border-r border-border bg-muted flex items-center justify-center"
            style={{ width: 50, height: HEADER_HEIGHT, minWidth: 50 }}
          />
          {Array.from({ length: COLS }, (_, i) => (
            <div
              key={i}
              className="border-r border-border flex items-center justify-between text-muted-foreground cursor-pointer hover:bg-accent transition-colors relative px-2"
              style={{ width: columnWidths[i], height: HEADER_HEIGHT, minWidth: columnWidths[i] }}
              onMouseDown={(e) => handleMouseDown(e, i)}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onDoubleClick={() => handleAutoFitColumn(i)}
              title={`Select column ${getColumnName(i)} (double-click to auto-fit)`}
            >
              <span onClick={() => handleColumnClick(i)} className="flex-1 text-center">
                {getColumnName(i)}
              </span>
              
              {onFilter && (
                <FilterDropdown
                  column={getColumnName(i)}
                  cells={cells}
                  onFilter={onFilter}
                  activeFilters={activeFilters}
                />
              )}
              
              <div 
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/20"
                style={{ cursor: 'col-resize' }}
              />
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: ROWS }, (_, rowIndex) => (
          <div key={rowIndex} className="flex border-b border-border">
            {/* Row Number */}
            <div
              className="sticky left-0 z-10 bg-muted border-r border-border flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-accent transition-colors"
              style={{ width: 50, height: CELL_HEIGHT, minWidth: 50 }}
              onClick={() => handleRowClick(rowIndex)}
              title={`Select row ${rowIndex + 1}`}
            >
              {rowIndex + 1}
            </div>

            {/* Cells */}
            {Array.from({ length: COLS }, (_, colIndex) => {
              const cellId = `${getColumnName(colIndex)}${rowIndex + 1}`;
              const cell = cells.get(cellId);
              const isSelected = selectedCell === cellId || selectedCells.includes(cellId);
              const isEditing = editingCell === cellId;
              const hasComment = comments.has(cellId) && comments.get(cellId)!.length > 0;
              const hasImage = images.has(cellId);

              return (
                <div
                  key={cellId}
                  className={`border-r border-border relative transition-colors ${
                    isSelected ? "ring-2 ring-blue-500 ring-inset z-10" : ""
                  } ${cell?.backgroundColor ? "" : "hover:bg-accent/50"}`}
                  style={{
                    width: columnWidths[colIndex],
                    height: CELL_HEIGHT,
                    minWidth: columnWidths[colIndex],
                    backgroundColor: cell?.backgroundColor,
                  }}
                  onClick={() => handleCellClick(cellId)}
                  onDoubleClick={() => handleCellDoubleClick(cellId)}
                  onContextMenu={(e) => handleContextMenu(e, cellId)}
                >
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleEditComplete}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditComplete();
                        } else if (e.key === "Escape") {
                          setEditingCell(null);
                          setEditValue("");
                        }
                      }}
                      className="w-full h-full px-2 bg-white dark:bg-gray-900 border-2 border-blue-500 outline-none"
                      style={{
                        fontWeight: cell?.bold ? "600" : "400",
                        fontStyle: cell?.italic ? "italic" : "normal",
                        textDecoration: cell?.underline ? "underline" : "none",
                        color: cell?.color,
                        textAlign: cell?.textAlign || 'left',
                      }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full px-2 flex items-center overflow-hidden text-ellipsis whitespace-nowrap relative ${
                        cell?.textAlign === 'center' ? 'justify-center' : 
                        cell?.textAlign === 'right' ? 'justify-end' : 
                        'justify-start'
                      }`}
                      style={{
                        fontWeight: cell?.bold ? "600" : "400",
                        fontStyle: cell?.italic ? "italic" : "normal",
                        textDecoration: cell?.underline ? "underline" : "none",
                        color: cell?.color,
                        textAlign: cell?.textAlign || 'left',
                      }}
                    >
                      {hasImage ? (
                        <img 
                          src={images.get(cellId)} 
                          alt="cell content" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        cell?.value || ""
                      )}
                      {hasComment && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-t-orange-500 border-r-transparent" />
                      )}
                    </div>
                  )}

                  {isSelected && !isEditing && (
                    <>
                      <motion.div
                        layoutId="selected-cell"
                        className="absolute inset-0 pointer-events-none border-2 border-blue-500"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      {/* Fill Handle */}
                      <div
                        className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-crosshair transform translate-x-1 translate-y-1"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleFillDown(cellId);
                        }}
                        title="Fill handle - drag to copy cell content"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>


    </div>
  );
}