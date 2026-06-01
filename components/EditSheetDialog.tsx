"use client";

import { Trash2 } from "lucide-react";
import { TabData } from "@/classes/Tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditSheetDialogProps {
  editingTabData: TabData | null;
  canDelete: boolean;
  onChange: (data: TabData) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function EditSheetDialog({
  editingTabData,
  canDelete,
  onChange,
  onClose,
  onSave,
  onDelete,
}: EditSheetDialogProps) {
  return (
    <Dialog open={!!editingTabData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Sheet</DialogTitle>
        </DialogHeader>
        {editingTabData && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="sheet-name">Name</Label>
              <Input
                id="sheet-name"
                value={editingTabData.tabName}
                onChange={(e) =>
                  onChange({ ...editingTabData, tabName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheet-color">Color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="sheet-color"
                  type="color"
                  value={editingTabData.color || "#3b82f6"}
                  onChange={(e) =>
                    onChange({ ...editingTabData, color: e.target.value })
                  }
                  className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="text-sm text-muted-foreground">
                  {editingTabData.color || "#3b82f6"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-1">
              {canDelete ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Sheet
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
