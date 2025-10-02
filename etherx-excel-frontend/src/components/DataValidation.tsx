import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { CellValidation } from "../types/spreadsheet";
import { X, Plus } from "lucide-react";

interface DataValidationProps {
  open: boolean;
  onClose: () => void;
  currentValidation?: CellValidation;
  onApply: (validation: CellValidation) => void;
  onRemove: () => void;
}

export function DataValidation({
  open,
  onClose,
  currentValidation,
  onApply,
  onRemove,
}: DataValidationProps) {
  const [validationType, setValidationType] = useState<'list' | 'number' | 'date' | 'custom'>(
    currentValidation?.type || 'list'
  );
  const [listItems, setListItems] = useState<string[]>(
    currentValidation?.options || ['Option 1', 'Option 2', 'Option 3']
  );
  const [newItem, setNewItem] = useState("");
  const [minValue, setMinValue] = useState(currentValidation?.min?.toString() || "0");
  const [maxValue, setMaxValue] = useState(currentValidation?.max?.toString() || "100");
  const [errorMessage, setErrorMessage] = useState(
    currentValidation?.errorMessage || "Invalid input"
  );

  const handleAddItem = () => {
    if (newItem.trim()) {
      setListItems([...listItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setListItems(listItems.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    const validation: CellValidation = {
      type: validationType,
      errorMessage,
    };

    if (validationType === 'list') {
      validation.options = listItems;
    } else if (validationType === 'number') {
      validation.min = parseFloat(minValue);
      validation.max = parseFloat(maxValue);
    }

    onApply(validation);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Data Validation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Validation Type</Label>
            <Select value={validationType} onValueChange={(v: any) => setValidationType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">Dropdown List</SelectItem>
                <SelectItem value="number">Number Range</SelectItem>
                <SelectItem value="date">Date Range</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {validationType === 'list' && (
            <div>
              <Label>Dropdown Options</Label>
              <div className="space-y-2 mt-2">
                {listItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} readOnly className="flex-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new option"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <Button onClick={handleAddItem} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {validationType === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum</Label>
                <Input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div>
                <Label>Maximum</Label>
                <Input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <Label>Error Message</Label>
            <Textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Message to show when validation fails"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {currentValidation && (
            <Button variant="destructive" onClick={onRemove}>
              Remove Validation
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
