"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, ClipboardList, CheckCircle, Smile } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// NOTE: You may need to adjust the API endpoints to your actual backend routes
async function fetchDashboardStats() {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}
async function fetchWeeklyRequests() {
  const res = await fetch("/api/dashboard/weekly-requests");
  if (!res.ok) throw new Error("Failed to fetch weekly requests data");
  return res.json();
}

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<{
    technicians: number;
    activeRequests: number;
    completedToday: number;
    customerSatisfaction: number;
  } | null>(null);

  const [weeklyData, setWeeklyData] = useState<
    { weekDay: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const [statsData, weekly] = await Promise.all([
          fetchDashboardStats(),
          fetchWeeklyRequests(),
        ]);
        setStats(statsData);
        setWeeklyData(weekly);
      } catch (err) {
        // Handle errors as needed
      }
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <UserCheck className="w-6 h-6 text-primary" />
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="text-3xl font-bold">{loading ? "—" : stats?.technicians ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="text-3xl font-bold">{loading ? "—" : stats?.activeRequests ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="text-3xl font-bold">{loading ? "—" : stats?.completedToday ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Smile className="w-6 h-6 text-primary" />
            <CardTitle className="text-sm font-medium">Cust. Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="text-3xl font-bold">
              {loading ? "—" : `${stats?.customerSatisfaction ?? 0}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Service Requests</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekDay" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}