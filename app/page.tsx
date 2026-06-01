"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "@/lib/types";
import { Tab, TabData } from "@/classes/Tab";
import { TaskForm } from "@/components/TaskForm";
import { AppHeader } from "@/components/AppHeader";
import { WorkspaceHeader } from "@/components/WorkspaceHeader";
import { TaskTable } from "@/components/TaskTable";
import { SheetTabsBar } from "@/components/SheetTabsBar";
import { TaskDetailsDrawer } from "@/components/TaskDetailsDrawer";
import { EditSheetDialog } from "@/components/EditSheetDialog";
import { INITIAL_TASKS } from "@/lib/constants";

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Home() {
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

  const addTab = () => {
    const newTab = new Tab(`Sheet ${tabs.length + 1}`, false, "");
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.getId());
  };

  const saveTaskDescription = () => {
    if (!selectedTask || editingDescription === null) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id ? { ...t, description: editingDescription } : t
      )
    );
    setSelectedTask((prev) =>
      prev ? { ...prev, description: editingDescription } : prev
    );
    setEditingDescription(null);
  };

  const saveTab = () => {
    if (!editingTabData) return;
    setTabs(
      tabs.map((t) => {
        if (t.getId() !== editingTabData.id) return t;
        t.setTabName(editingTabData.tabName);
        t.setColor(editingTabData.color);
        return Tab.fromPlain(t.toPlain());
      })
    );
    setEditingTabData(null);
  };

  const deleteTab = () => {
    if (!editingTabData) return;
    const remaining = tabs.filter((t) => t.getId() !== editingTabData.id);
    setTabs(remaining);
    if (activeTabId === editingTabData.id) {
      setActiveTabId(remaining[0].getId());
    }
    setTasks(tasks.filter((t) => t.sheetId !== editingTabData.id));
    setEditingTabData(null);
  };

  const visibleTasks = tasks.filter(
    (t) =>
      t.sheetId === activeTabId ||
      (!t.sheetId && activeTabId === tabs[0]?.getId())
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <WorkspaceHeader
          onPrevWeek={() => adjustStartDate(-7)}
          onToday={resetToDefaultDate}
          onNextWeek={() => adjustStartDate(7)}
          onNewTask={() => setIsFormOpen(true)}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <TaskForm onSubmit={addTask} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>

        <Card className="overflow-hidden p-0">
          <TaskTable
            tasks={visibleTasks}
            dateColumns={dateColumns}
            isToday={isToday}
            onToggleDate={toggleTaskDate}
            onSelectTask={setSelectedTask}
          />
          <SheetTabsBar
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onAddTab={addTab}
            onEditTab={setEditingTabData}
          />
        </Card>
      </main>

      <TaskDetailsDrawer
        task={selectedTask}
        editingDescription={editingDescription}
        onClose={() => {
          setSelectedTask(null);
          setEditingDescription(null);
        }}
        onStartEditing={setEditingDescription}
        onChangeDescription={setEditingDescription}
        onCancelEditing={() => setEditingDescription(null)}
        onSave={saveTaskDescription}
      />

      <EditSheetDialog
        editingTabData={editingTabData}
        canDelete={tabs.length > 1}
        onChange={setEditingTabData}
        onClose={() => setEditingTabData(null)}
        onSave={saveTab}
        onDelete={deleteTab}
      />
    </div>
  );
}
