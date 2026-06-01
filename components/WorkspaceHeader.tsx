"use client";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
  onPrevWeek: () => void;
  onToday: () => void;
  onNextWeek: () => void;
  onNewTask: () => void;
}

export function WorkspaceHeader({
  onPrevWeek,
  onToday,
  onNextWeek,
  onNewTask,
}: WorkspaceHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <h2 className="text-3xl font-extrabold tracking-tight">My Workspace</h2>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPrevWeek}
            title="Previous Week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-bold"
            onClick={onToday}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNextWeek}
            title="Next Week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={onNewTask} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>
    </div>
  );
}
