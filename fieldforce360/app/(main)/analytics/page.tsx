"use client";

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock data for charts
const customerSatisfactionData = [
  { date: "Mon", satisfaction: 80 },
  { date: "Tue", satisfaction: 83 },
  { date: "Wed", satisfaction: 88 },
  { date: "Thu", satisfaction: 85 },
  { date: "Fri", satisfaction: 90 },
  { date: "Sat", satisfaction: 91 },
  { date: "Sun", satisfaction: 95 },
];

const tasksPerTechnician = [
  { name: "Alice", tasks: 20 },
  { name: "Bob", tasks: 13 },
  { name: "Carlos", tasks: 16 },
  { name: "Diana", tasks: 22 },
  { name: "Elena", tasks: 10 },
];

const requestStatusData = [
  { status: "Completed", value: 190 },
  { status: "In Progress", value: 65 },
  { status: "Pending", value: 28 },
];

const REQUEST_STATUS_COLORS = ["#34d399", "#fbbf24", "#6366f1"];

const kpiCards = [
  {
    title: "Faster Response",
    value: "40%",
    sub: "response improvement",
    color: "from-green-400 to-blue-500",
  },
  {
    title: "Cost Reduction",
    value: "30%",
    sub: "lower costs",
    color: "from-purple-400 to-amber-500",
  },
];

export default function AnalyticsDashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* KPI Cards */}
      {kpiCards.map((kpi, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <span
              className={`text-4xl font-bold mr-2 bg-gradient-to-r ${kpi.color} text-transparent bg-clip-text`}
            >
              {kpi.value}
            </span>
            <span className="text-gray-500 font-medium">{kpi.sub}</span>
          </CardContent>
        </Card>
      ))}

      {/* Line Chart: Customer Satisfaction */}
      <Card className="col-span-1 md:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Customer Satisfaction (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerSatisfactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => `${value ?? 0}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="satisfaction"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart: Tasks Per Technician */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Tasks Completed per Technician</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tasksPerTechnician}
              margin={{ top: 8, right: 16, left: 0, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart: Request Status Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Request Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={requestStatusData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                label={({ name, percent }) =>
                  `${name}: ${Math.round((percent ?? 0) * 100)}%`
                }
                paddingAngle={2}
              >
                {requestStatusData.map((entry, idx) => (
                  <Cell key={entry.status} fill={REQUEST_STATUS_COLORS[idx % REQUEST_STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip formatter={(value, name) => [`${value ?? 0}`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}