"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { CheckCircle2, Circle, Clock, MoreVertical } from "lucide-react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TaskCard({ task, onToggleStatus }: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleStatus(task.id)}
            className="text-zinc-400 transition-colors hover:text-blue-500"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>
          <h3
            className={cn(
              "text-lg font-semibold tracking-tight transition-all",
              isCompleted && "text-zinc-400 line-through"
            )}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <Clock className="h-3 w-3" />
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <button className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <MoreVertical className="h-4 w-4 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
        <ReactMarkdown>{task.description}</ReactMarkdown>
      </div>

      {task.chartData && task.chartData.length > 0 && (
        <div className="mt-4 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={task.chartData}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="#888888"
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {task.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
