"use client";

import { useState, useEffect } from "react";
import { Plus, X, Check, Menu, MoreVertical, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Task, Sheet } from "@/lib/types";
import { TaskForm } from "@/components/TaskForm";
import { INITIAL_TASKS } from "@/lib/constants";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sheets, setSheets] = useState<Sheet[]>([{ id: "sheet-1", name: "Sheet1" }]);
  const [activeSheetId, setActiveSheetId] = useState("sheet-1");
  const [editingSheet, setEditingSheet] = useState<Sheet | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("event-handler-tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        console.error("Failed to parse tasks from localStorage");
      }
    }
    const savedSheets = localStorage.getItem("event-handler-sheets");
    if (savedSheets) {
      try {
        const parsed = JSON.parse(savedSheets);
        if (parsed && parsed.length > 0) {
          setSheets(parsed);
          setActiveSheetId(parsed[0].id);
        }
      } catch {
        console.error("Failed to parse sheets from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("event-handler-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("event-handler-sheets", JSON.stringify(sheets));
  }, [sheets]);

  const dateColumns = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const addTask = (newTask: Omit<Task, "id" | "createdAt" | "status" | "sheetId">) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      status: "todo",
      sheetId: activeSheetId,
    };
    setTasks([task, ...tasks]);
    setIsFormOpen(false);
  };

  const toggleTaskDate = (taskId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Navigation */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tighter text-blue-600 dark:text-blue-500">
              EVENT HANDLER
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Workspace
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              New Task
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
              <TaskForm
                onSubmit={addTask}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
            <thead className="border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 min-w-[300px]">Task Title</th>
                {dateColumns.map((date, i) => (
                  <th key={i} className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400 text-center border-l border-zinc-200 dark:border-zinc-800 min-w-[100px]">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-zinc-900 dark:text-zinc-50 mt-1">{date.getDate()}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {tasks.filter(t => t.sheetId === activeSheetId || (!t.sheetId && activeSheetId === sheets[0]?.id)).map((task) => {
                return (
                  <tr key={task.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4 relative group/cell">
                      <span className="font-medium pr-4 text-zinc-900 dark:text-zinc-50">
                        {task.title}
                      </span>
                      {task.description && (
                        <div
                          onClick={() => setSelectedTask(task)}
                          className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-l-[12px] border-t-red-500 border-l-transparent cursor-pointer hover:border-t-red-600 transition-colors opacity-70 hover:opacity-100"
                          title="View Description"
                        />
                      )}
                    </td>
                    {dateColumns.map((date, i) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isMarked = task.completedDates?.includes(dateStr);
                      return (
                        <td
                          key={i}
                          onClick={() => toggleTaskDate(task.id, date)}
                          className="px-6 py-4 border-l border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <div className="flex items-center justify-center min-h-[1.5rem]">
                            {isMarked ? (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/45">
                                <Check className="h-4 w-4 text-emerald-600" />
                              </div>
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 opacity-0 opacity-100 dark:border-zinc-600 transition-opacity">
                                <Check className="h-3 w-3 text-zinc-300" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>

          {/* Sheets Tabs */}
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex items-center gap-1 px-2 py-1 border-r border-zinc-200 dark:border-zinc-800 shrink-0 sticky left-0 bg-zinc-50 dark:bg-zinc-900 z-10">
              <button 
                onClick={() => {
                  const newSheet: Sheet = {
                    id: Math.random().toString(36).substring(2, 9),
                    name: `Sheet ${sheets.length + 1}`
                  };
                  setSheets([...sheets, newSheet]);
                  setActiveSheetId(newSheet.id);
                }}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md text-zinc-500 dark:text-zinc-400 transition-colors"
                title="Add Sheet"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md text-zinc-500 dark:text-zinc-400 transition-colors"
                title="All sheets"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center flex-1">
              {sheets.map(sheet => {
                const sheetColor = sheet.color || '#3b82f6';
                const isActive = activeSheetId === sheet.id;
                return (
                <button
                  key={sheet.id}
                  onClick={() => setActiveSheetId(sheet.id)}
                  className={`relative px-4 py-2 text-sm font-medium border-r border-zinc-200 dark:border-zinc-800 min-w-[120px] max-w-[200px] text-left transition-colors group flex-shrink-0 flex items-center justify-between ${
                    isActive 
                      ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50" 
                      : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                  style={isActive ? { color: sheetColor } : {}}
                >
                  <span className="truncate block pr-4">{sheet.name}</span>
                  
                  <div 
                    onClick={(e) => { e.stopPropagation(); setEditingSheet(sheet); }}
                    className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit Sheet"
                  >
                    <MoreVertical className="h-3 w-3 text-zinc-500" />
                  </div>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: sheetColor }} />
                  )}
                </button>
              )})}
            </div>
          </div>
        </div>
      </main>

      {/* Background Gradient Orbs */}
      <div className="fixed -left-20 -top-20 -z-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="fixed -bottom-20 -right-20 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

      {/* Side Drawer */}
      {selectedTask && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTask(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {selectedTask.title}
              </h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 prose prose-sm sm:prose-base prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
              <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
            </div>
          </div>
        </>
      )}

      {editingSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Edit Sheet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                <input 
                  type="text" 
                  value={editingSheet.name}
                  onChange={(e) => setEditingSheet({...editingSheet, name: e.target.value})}
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 text-zinc-900 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Color</label>
                <div className="flex items-center gap-3">
                   <input 
                    type="color" 
                    value={editingSheet.color || '#3b82f6'}
                    onChange={(e) => setEditingSheet({...editingSheet, color: e.target.value})}
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="text-sm text-zinc-500">{editingSheet.color || '#3b82f6'}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              {sheets.length > 1 ? (
                <button
                  onClick={() => {
                    const remainingSheets = sheets.filter(s => s.id !== editingSheet.id);
                    setSheets(remainingSheets);
                    if (activeSheetId === editingSheet.id) {
                      setActiveSheetId(remainingSheets[0].id);
                    }
                    setTasks(tasks.filter(t => t.sheetId !== editingSheet.id));
                    setEditingSheet(null);
                  }}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Sheet
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingSheet(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setSheets(sheets.map(s => s.id === editingSheet.id ? editingSheet : s));
                    setEditingSheet(null);
                  }}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
