"use client";

import React, { useState, useEffect } from "react";
import { Plus, LayoutGrid, List, Settings, Search, Bell } from "lucide-react";
import { Task } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
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
          )}
        </div>
      </main>

      {/* Background Gradient Orbs */}
      <div className="fixed -left-20 -top-20 -z-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="fixed -bottom-20 -right-20 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
    </div>
  );
}
