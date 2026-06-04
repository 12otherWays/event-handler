"use client";

import { X, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TaskDetailsDrawerProps {
  task: Task | null;
  editingDescription: string | null;
  onClose: () => void;
  onStartEditing: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onCancelEditing: () => void;
  onSave: () => void;
}

export function TaskDetailsDrawer({
  task,
  editingDescription,
  onClose,
  onStartEditing,
  onChangeDescription,
  onCancelEditing,
  onSave,
}: TaskDetailsDrawerProps) {
  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="w-full max-w-md flex flex-col p-0"
        showCloseButton={false}
      >
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="truncate">{task?.title}</SheetTitle>
            <div className="flex items-center gap-1 shrink-0">
              {editingDescription === null && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onStartEditing(task?.description ?? "")}
                  title="Edit description"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Close"
                  />
                }
              >
                <X className="h-4 w-4" />
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <div className="p-6 overflow-y-auto flex-1">
          {editingDescription !== null ? (
            <textarea
              className="w-full h-full min-h-[60vh] resize-none rounded-md border bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              value={editingDescription}
              onChange={(e) => onChangeDescription(e.target.value)}
              autoFocus
            />
          ) : (
            <div className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert max-w-none text-muted-foreground">
              {task?.description && (
                <ReactMarkdown>{task.description}</ReactMarkdown>
              )}
            </div>
          )}
        </div>
        {editingDescription !== null && (
          <div className="flex items-center justify-end gap-2 border-t p-6">
            <Button variant="ghost" size="sm" onClick={onCancelEditing}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
