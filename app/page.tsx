"use client";

import { useState } from "react";
import { Plus, List, Settings, Search, Bell, CheckCircle2, Circle, MoreVertical, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Task } from "@/lib/types";
import { TaskForm } from "@/components/TaskForm";
import { cn } from "@/lib/utils";

// Initial sample data to showcase the "wow" factor
const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Project Milestone: UI Foundation",
    description: "Build the core design system using **Tailwind CSS 4**. \n\n- [x] Color palette selection\n- [ ] Typography integration\n- [ ] Component library setup",
    status: "in-progress",
    createdAt: Date.now() - 86400000,
    chartData: [
      { name: "Progress", value: 65 },
      { name: "Remaining", value: 35 },
    ],
  },
  {
    id: "2",
    title: "Weekly Performance Metrics",
    description: "Analyze the traffic and engagement for the last 7 days. *Data source: Internal Analytics*",
    status: "todo",
    createdAt: Date.now() - 172800000,
    chartData: [
      { name: "Mon", value: 40 },
      { name: "Tue", value: 30 },
      { name: "Wed", value: 65 },
      { name: "Thu", value: 45 },
      { name: "Fri", value: 90 },
    ],
  },
];

type ViewRange = "1" | "3" | "7" | "30";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewRange, setViewRange] = useState<ViewRange>("7");

  const dateColumns = Array.from({ length: parseInt(viewRange) }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const addTask = (newTask: Omit<Task, "id" | "createdAt" | "status">) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      status: "todo",
    };
    setTasks([task, ...tasks]);
    setIsFormOpen(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
            ...t,
            status: t.status === "completed" ? "todo" : "completed",
          }
          : t
      )
    );
  };

  const handleInlineAdd = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
    });
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInlineAdd();
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Navigation */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tighter text-blue-600 dark:text-blue-500">
              EVENT HANDLER
            </h1>
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Dashboard</a>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Tasks</a>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Projects</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
            <button className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
              <Bell className="h-5 w-5" />
            </button>
            <button className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Workspace
            </h2>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
              Manage your tasks with rich data and visualization.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={viewRange}
              onChange={(e) => setViewRange(e.target.value as ViewRange)}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-medium text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">Week</option>
              <option value="30">Month</option>
            </select>
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

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
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
              {filteredTasks.map((task) => {
                const isCompleted = task.status === "completed";
                return (
                  <tr key={task.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4 relative group/cell">
                      <span className={cn("font-medium pr-4", isCompleted ? "text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-50")}>
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
                    {dateColumns.map((_, i) => (
                      <td key={i} className="px-6 py-4 border-l border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                        {/* Empty interactive cell */}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={1 + dateColumns.length} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-900">
                        <List className="h-10 w-10 text-zinc-400" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        No tasks found
                      </h3>
                      <p className="mt-2 text-zinc-500">
                        Start by creating your first task with a rich description.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
}
