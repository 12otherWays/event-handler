"use client";

import { Check } from "lucide-react";
import { Task } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TaskTableProps {
  tasks: Task[];
  dateColumns: Date[];
  isToday: (date: Date) => boolean;
  onToggleDate: (taskId: string, date: Date) => void;
  onSelectTask: (task: Task) => void;
}

export function TaskTable({
  tasks,
  dateColumns,
  isToday,
  onToggleDate,
  onSelectTask,
}: TaskTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[800px] whitespace-nowrap">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="min-w-[280px] px-6 py-4 font-medium">
              Task Title
            </TableHead>
            {dateColumns.map((date, i) => {
              const today = isToday(date);
              return (
                <TableHead
                  key={i}
                  className={`min-w-[90px] border-l px-4 py-4 text-center font-medium ${today
                    ? "bg-blue-50/60 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                    : "text-muted-foreground"
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                    <span
                      className={`mt-0.5 text-sm ${today
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : "text-foreground"
                        }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="group transition-colors hover:bg-muted/30"
            >
              <TableCell className="relative px-6 py-4">
                <span className="font-medium text-foreground pr-4">
                  {task.title}
                </span>
                {task.description && (
                  <div
                    onClick={() => onSelectTask(task)}
                    className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-l-[12px] border-t-red-500 border-l-transparent cursor-pointer hover:border-t-red-600 transition-colors opacity-70 hover:opacity-100"
                    title="View Description"
                  />
                )}
              </TableCell>
              {dateColumns.map((date, i) => {
                const dateStr = date.toISOString().split("T")[0];
                const isMarked = task.completedDates?.includes(dateStr);
                const today = isToday(date);
                return (
                  <TableCell
                    key={i}
                    onClick={() => onToggleDate(task.id, date)}
                    className={`border-l px-4 py-4 cursor-pointer transition-colors ${today
                      ? "bg-blue-50/20 hover:bg-blue-50/40 dark:bg-blue-950/10 dark:hover:bg-blue-950/20"
                      : "hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center justify-center min-h-[1.5rem]">
                      {isMarked ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/45">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border opacity-40 group-hover:opacity-70 transition-opacity">
                          <Check className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
