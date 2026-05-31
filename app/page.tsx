"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Check, Menu, MoreVertical, Trash2, ChevronLeft, ChevronRight, Sun, Moon, Pencil } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Task } from "@/lib/types";
import { Tab, TabData } from "@/classes/Tab";
import { TaskForm } from "@/components/TaskForm";
import { INITIAL_TASKS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const defaultTab = new Tab("Sheet 1", true, "");
  const [tabs, setTabs] = useState<Tab[]>([defaultTab]);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTab.getId());
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTabData, setEditingTabData] = useState<TabData | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);

  const initialized = useRef(false);

  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });

  const adjustStartDate = (days: number) => {
    setStartDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

  const resetToDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setStartDate(d);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Load from file on mount
  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((data) => {
        if (data.tasks?.length) setTasks(data.tasks);
        if (data.tabs?.length) {
          const restored = (data.tabs as TabData[]).map(Tab.fromPlain);
          setTabs(restored);
          setActiveTabId(restored[0].getId());
        }
      })
      .finally(() => {
        initialized.current = true;
      });
  }, []);

  // Debounced save to file on every change
  useEffect(() => {
    if (!initialized.current) return;
    const timer = setTimeout(() => {
      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, tabs: tabs.map((t) => t.toPlain()) }),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [tasks, tabs]);

  const dateColumns = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const addTask = (
    newTask: Omit<Task, "id" | "createdAt" | "status" | "sheetId">
  ) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      status: "todo",
      sheetId: activeTabId,
    };
    setTasks([task, ...tasks]);
    setIsFormOpen(false);
  };

  const toggleTaskDate = (taskId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    setTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const currentDates = t.completedDates || [];
        const newDates = currentDates.includes(dateStr)
          ? currentDates.filter((d) => d !== dateStr)
          : [...currentDates, dateStr];
        return { ...t, completedDates: newDates };
      })
    );
  };

  const visibleTasks = tasks.filter(
    (t) =>
      t.sheetId === activeTabId ||
      (!t.sheetId && activeTabId === tabs[0]?.getId())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 relative">
          <h1 className="text-xl font-bold tracking-tighter text-primary">
            EVENT HANDLER
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Page title + controls */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-3xl font-extrabold tracking-tight">
            My Workspace
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Date navigation */}
            <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => adjustStartDate(-7)}
                title="Previous Week"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-bold"
                onClick={resetToDefaultDate}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => adjustStartDate(7)}
                title="Next Week"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* New Task Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <TaskForm
              onSubmit={addTask}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Main table card */}
        <Card className="overflow-hidden p-0">
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
                {visibleTasks.map((task) => (
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
                          onClick={() => setSelectedTask(task)}
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
                          onClick={() => toggleTaskDate(task.id, date)}
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

          {/* Sheet tabs bar */}
          <div className="flex items-center bg-muted/30 border-t shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex items-center gap-1 px-2 py-1 border-r shrink-0 sticky left-0 bg-muted/30 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Add Sheet"
                onClick={() => {
                  const newTab = new Tab(
                    `Sheet ${tabs.length + 1}`,
                    false,
                    ""
                  );
                  setTabs([...tabs, newTab]);
                  setActiveTabId(newTab.getId());
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="All sheets"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center flex-1">
              {tabs.map((tab) => {
                const tabColor = tab.getColor() || "#3b82f6";
                const isActive = activeTabId === tab.getId();
                return (
                  <button
                    key={tab.getId()}
                    onClick={() => setActiveTabId(tab.getId())}
                    className={`relative px-4 py-2 text-sm font-medium border-r min-w-[120px] max-w-[200px] text-left transition-colors group/tab flex-shrink-0 flex items-center justify-between ${isActive
                      ? "bg-background text-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted/50"
                      }`}
                    style={isActive ? { color: tabColor } : {}}
                  >
                    <span className="truncate block pr-2">
                      {tab.getTabName()}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTabData(tab.toPlain());
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          setEditingTabData(tab.toPlain());
                        }
                      }}
                      className="p-1 rounded hover:bg-muted opacity-0 group-hover/tab:opacity-100 transition-opacity cursor-pointer"
                      title="Edit Sheet"
                    >
                      <MoreVertical className="h-3 w-3 text-muted-foreground" />
                    </div>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ backgroundColor: tabColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </main>

      {/* Task description side drawer */}
      <Sheet
        open={!!selectedTask}
        onOpenChange={(open) => { if (!open) { setSelectedTask(null); setEditingDescription(null); } }}
      >
        <SheetContent className="w-full max-w-md flex flex-col p-0" showCloseButton={false}>
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="truncate">{selectedTask?.title}</SheetTitle>
              <div className="flex items-center gap-1 shrink-0">
                {editingDescription === null ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingDescription(selectedTask?.description ?? "")}
                    title="Edit description"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === selectedTask!.id
                              ? { ...t, description: editingDescription }
                              : t
                          )
                        );
                        setSelectedTask((prev) => prev ? { ...prev, description: editingDescription } : prev);
                        setEditingDescription(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingDescription(null)}>
                      Cancel
                    </Button>
                  </>
                )}
                <SheetClose
                  render={
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Close" />
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
                onChange={(e) => setEditingDescription(e.target.value)}
                autoFocus
              />
            ) : (
              <div className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                {selectedTask?.description && (
                  <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet Dialog */}
      <Dialog
        open={!!editingTabData}
        onOpenChange={(open) => !open && setEditingTabData(null)}
      >
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
                    setEditingTabData({
                      ...editingTabData,
                      tabName: e.target.value,
                    })
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
                      setEditingTabData({
                        ...editingTabData,
                        color: e.target.value,
                      })
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
                {tabs.length > 1 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const remaining = tabs.filter(
                        (t) => t.getId() !== editingTabData.id
                      );
                      setTabs(remaining);
                      if (activeTabId === editingTabData.id) {
                        setActiveTabId(remaining[0].getId());
                      }
                      setTasks(
                        tasks.filter((t) => t.sheetId !== editingTabData.id)
                      );
                      setEditingTabData(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Sheet
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTabData(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setTabs(
                        tabs.map((t) => {
                          if (t.getId() !== editingTabData.id) return t;
                          t.setTabName(editingTabData.tabName);
                          t.setColor(editingTabData.color);
                          return Tab.fromPlain(t.toPlain());
                        })
                      );
                      setEditingTabData(null);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
