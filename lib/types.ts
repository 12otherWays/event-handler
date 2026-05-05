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
  createdAt: number;
  metadata?: Record<string, any>; // For future extensibility
}
