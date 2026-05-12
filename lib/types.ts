export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Task {
  id: string;
  title: string;
  description: string; // Markdown supported
  chartData?: ChartDataPoint[];
  status: 'todo' | 'in-progress' | 'completed';
  completedDates?: string[]; // Array of ISO date strings (Y-m-d)
  createdAt: number;
  sheetId?: string;
  metadata?: Record<string, any>; // For future extensibility
}

export interface Sheet {
  id: string;
  name: string;
  color?: string;
}
