export interface Cell {
  value: string;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  numberFormat?: 'currency' | 'percentage' | 'number' | 'decimal';
  // New properties
  validation?: CellValidation;
  hyperlink?: string;
  mergedWith?: string; // Cell ID this is merged into
  isMergeParent?: boolean; // True if this is the top-left of merged cells
  mergeSpan?: { rows: number; cols: number };
  locked?: boolean;
  sparkline?: SparklineData;
}

export interface CellValidation {
  type: 'list' | 'number' | 'date' | 'custom';
  options?: string[]; // For dropdown lists
  min?: number;
  max?: number;
  errorMessage?: string;
}

export interface SparklineData {
  type: 'line' | 'bar' | 'winloss';
  range: string; // e.g., "A1:A10"
  color?: string;
}

export interface Sheet {
  id: string;
  _id?: string; // Backend ID
  name: string;
  color?: string;
  cells: Map<string, Cell>;
  frozenRows?: number;
  frozenCols?: number;
  namedRanges?: Map<string, string>; // name -> range (e.g., "Sales" -> "A1:A10")
  protected?: boolean;
  protectionPassword?: string;
  sortState?: SortState;
  filterState?: FilterState;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
  columns?: Array<{ column: string; direction: 'asc' | 'desc' }>;
}

export interface FilterState {
  column: string;
  criteria: string[];
}

export interface SpreadsheetData {
  sheets: Sheet[];
  activeSheetId: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  token?: string; // Auth token for backend
}
