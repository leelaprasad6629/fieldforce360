"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

// Dummy API endpoints or use actual endpoints in production
const TASKS_API = "/api/technician/assignedTasks";
const CHECKIN_API = "/api/technician/checkin";
const REPORT_API = "/api/technician/submitReport";

type Task = {
  _id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Assigned" | "InProgress" | "Completed";
  location: string;
  customerName?: string;
  scheduledDate?: string;
  completedAt?: string;
};

const priorityColors: Record<Task["priority"], string> = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-green-500 text-white",
};

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);
  const [checkinMsg, setCheckinMsg] = useState<string | null>(null);
  const [submittingReport, setSubmittingReport] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const res = await fetch(TASKS_API);
        const data = await res.json();
        setTasks(data.tasks);
        // Count tasks completed today
        const today = format(new Date(), "yyyy-MM-dd");
        const completed = data.tasks.filter(
          (t: Task) =>
            t.status === "Completed" &&
            t.completedAt &&
            format(new Date(t.completedAt), "yyyy-MM-dd") === today
        );
        setCompletedToday(completed.length);
      } catch (e) {
        setTasks([]);
        setCompletedToday(0);
      }
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const handleCheckin = () => {
    setCheckinMsg(null);
    setCheckinLoading(true);

    if (!navigator.geolocation) {
      setCheckinMsg("Geolocation is not supported by your browser.");
      setCheckinLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(CHECKIN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
          const result = await res.json();
          if (res.ok) setCheckinMsg("Check-In successful!");
          else setCheckinMsg(result.message || "Check-In failed.");
        } catch {
          setCheckinMsg("Failed to submit check-in.");
        }
        setCheckinLoading(false);
      },
      () => {
        setCheckinMsg("Failed to retrieve geolocation.");
        setCheckinLoading(false);
      }
    );
  };

  const openGoogleMapsRoute = (task: Task) => {
    // Assumes current user position as start, or can set a default
    if (task.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        task.location
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleSubmitReport = async (taskId: string) => {
    setSubmittingReport(taskId);
    try {
      // You would normally use a form/modal for actual reports
      const res = await fetch(REPORT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, report: "Task completed successfully." }),
      });
      if (res.ok) {
        alert("Report submitted!");
      } else {
        alert("Failed to submit report.");
      }
    } catch {
      alert("Error submitting report.");
    }
    setSubmittingReport(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <CardTitle className="text-lg font-bold">Today's Completed Tasks</CardTitle>
          <div className="ml-auto text-3xl font-mono">{completedToday}</div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">My Assigned Tasks</CardTitle>
          <Button size="sm" variant="outline" onClick={handleCheckin} disabled={checkinLoading}>
            {checkinLoading ? "Checking In..." : "Check-In"}
          </Button>
        </CardHeader>
        <CardContent>
          {checkinMsg && (
            <div
              className={`mb-3 text-sm ${
                checkinMsg.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {checkinMsg}
            </div>
          )}

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No assigned tasks.</div>
          ) : (
            <ul className="divide-y">
              {tasks.map((task) => (
                <li key={task._id} className="py-4 flex flex-col md:flex-row gap-3 md:items-center">
                  <div className="flex-1">
                    <div className="flex flex-row gap-2 items-center">
                      <span className="font-medium text-lg">{task.title}</span>
                      <Badge className={`ml-2 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                      <Badge variant="secondary" className="ml-2">
                        {task.status}
                      </Badge>
                    </div>
                    {task.customerName && (
                      <div className="text-sm text-gray-600">
                        Customer: {task.customerName}
                      </div>
                    )}
                    {task.scheduledDate && (
                      <div className="text-sm text-gray-500">
                        Scheduled: {format(new Date(task.scheduledDate), "yyyy-MM-dd HH:mm")}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row flex-wrap gap-2 items-center mt-2 md:mt-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openGoogleMapsRoute(task)}
                      disabled={!task.location}
                    >
                      Route
                    </Button>
                    {task.status === "Completed" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSubmitReport(task._id)}
                        disabled={submittingReport === task._id}
                      >
                        {submittingReport === task._id ? "Submitting..." : "Submit Report"}
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}