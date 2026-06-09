"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

type ServiceRequest = {
  _id: string;
  title: string;
  status: string;
  assignedTo: { _id: string; name: string } | null;
  customerId: { _id: string; name: string } | null;
  createdAt: string;
};

type User = {
  _id: string;
  name: string;
};

type Customer = {
  _id: string;
  name: string;
};

const statusColors: Record<string, string> = {
  "Pending": "bg-yellow-200 text-yellow-800",
  "In Progress": "bg-blue-200 text-blue-800",
  "Completed": "bg-green-200 text-green-800",
}

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    assignedTo: "",
    customerId: "",
    location: ""
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch requests
      const reqRes = await fetch("/api/requests");
      const reqData = await reqRes.json();
      setRequests(reqData || []);

      // Fetch users (technicians)
      const userRes = await fetch("/api/users?role=technician");
      const userData = await userRes.json();
      setUsers(userData || []);

      // Fetch customers
      const custRes = await fetch("/api/customers");
      const custData = await custRes.json();
      setCustomers(custData || []);

      setLoading(false);
    }
    fetchData();
  }, [openDialog]); // re-fetch on close of dialog for updates

  const filteredRequests = filteredStatus
    ? requests.filter((r) => r.status === filteredStatus)
    : requests;

  const handleFilter = (status: string | null) => setFilteredStatus(status);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setCreating(false);
    setOpenDialog(false);
    setForm({
      title: "",
      description: "",
      status: "Pending",
      assignedTo: "",
      customerId: "",
      location: ""
    });
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Service Requests</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Create New Request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create Service Request</DialogTitle>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={form.title} onChange={handleFormChange} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={form.description} onChange={handleFormChange} required />
              </div>
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select value={form.assignedTo} onValueChange={(v) => handleSelectChange("assignedTo", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerId">Customer</Label>
                <Select value={form.customerId} onValueChange={(v) => handleSelectChange("customerId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={form.location} onChange={handleFormChange} required />
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          variant={!filteredStatus ? "default" : "outline"}
          onClick={() => handleFilter(null)}
        >
          All
        </Button>
        {statusOptions.map(({ value }) => (
          <Button
            key={value}
            variant={filteredStatus === value ? "default" : "outline"}
            onClick={() => handleFilter(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="border rounded-md overflow-x-auto bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No requests found.</TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell className="max-w-[100px] truncate" title={req._id}>{req._id.slice(-8)}</TableCell>
                  <TableCell>{req.customerId?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge className={`
                      rounded px-2 py-1 font-semibold text-xs 
                      ${statusColors[req.status] || "bg-gray-200 text-gray-800"}
                    `}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{req.assignedTo?.name || "—"}</TableCell>
                  <TableCell>
                    {req.createdAt ? format(new Date(req.createdAt), "yyyy-MM-dd HH:mm") : "—"}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}