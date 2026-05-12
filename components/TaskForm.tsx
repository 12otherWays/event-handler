"use client";

import React, { useState } from "react";
import { Plus, X, BarChart2, MessageSquare, Type } from "lucide-react";
import { Task, ChartDataPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "status" | "sheetId">) => void;
  onCancel: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [newDataName, setNewDataName] = useState("");
  const [newDataValue, setNewDataValue] = useState("");

  const addDataPoint = () => {
    if (newDataName && newDataValue) {
      setChartData([
        ...chartData,
        { name: newDataName, value: parseFloat(newDataValue) },
      ]);
      setNewDataName("");
      setNewDataValue("");
    }
  };

  const removeDataPoint = (index: number) => {
    setChartData(chartData.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({ title, description, chartData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create New Task
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <Type className="h-4 w-4" />
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <MessageSquare className="h-4 w-4" />
            Description (Markdown)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details... (Markdown supported)"
            rows={4}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <BarChart2 className="h-4 w-4" />
            Chart Data (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDataName}
              onChange={(e) => setNewDataName(e.target.value)}
              placeholder="Label (e.g. Mon)"
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
            />
            <input
              type="number"
              value={newDataValue}
              onChange={(e) => setNewDataValue(e.target.value)}
              placeholder="Value"
              className="w-24 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={addDataPoint}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Add
            </button>
          </div>

          {chartData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chartData.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {point.name}: {point.value}
                  <button
                    type="button"
                    onClick={() => removeDataPoint(index)}
                    className="hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
        >
          Create Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-zinc-200 px-6 py-3 font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
