"use client";

import React, { useState } from "react";
import { Plus, X, BarChart2, MessageSquare, Type } from "lucide-react";
import { Task, ChartDataPoint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task-title" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Title
          </Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-description" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Description (Markdown)
          </Label>
          <Textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details... (Markdown supported)"
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Chart Data (Optional)
          </Label>
          <div className="flex gap-2">
            <Input
              value={newDataName}
              onChange={(e) => setNewDataName(e.target.value)}
              placeholder="Label (e.g. Mon)"
              className="flex-1"
            />
            <Input
              type="number"
              value={newDataValue}
              onChange={(e) => setNewDataValue(e.target.value)}
              placeholder="Value"
              className="w-24"
            />
            <Button type="button" variant="outline" onClick={addDataPoint}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {chartData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chartData.map((point, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                  {point.name}: {point.value}
                  <button
                    type="button"
                    onClick={() => removeDataPoint(index)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          Create Task
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
