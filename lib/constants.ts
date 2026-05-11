import { Task } from "@/lib/types";

export const INITIAL_TASKS: Task[] = [
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
