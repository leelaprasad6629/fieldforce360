export const mockTechnicians = [
  {
    _id: "tech-1",
    name: "Alice Johnson",
    role: "technician",
    location: "37.7749,-122.4194",
    isActive: true,
  },
  {
    _id: "tech-2",
    name: "Bob Smith",
    role: "technician",
    location: "37.7849,-122.4094",
    isActive: true,
  },
  {
    _id: "tech-3",
    name: "Carlos Rivera",
    role: "technician",
    location: "37.7649,-122.4294",
    isActive: false,
  },
];

export const mockCustomers = [
  { _id: "cust-1", name: "Acme Corp" },
  { _id: "cust-2", name: "Globex Industries" },
  { _id: "cust-3", name: "Initech" },
];

export const mockRequests = [
  {
    _id: "req-1",
    title: "HVAC Maintenance",
    description: "Quarterly HVAC inspection",
    status: "In Progress",
    assignedTo: { _id: "tech-1", name: "Alice Johnson" },
    customerId: { _id: "cust-1", name: "Acme Corp" },
    location: "123 Market St, San Francisco, CA",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "req-2",
    title: "Network Outage",
    description: "Office network down",
    status: "Pending",
    assignedTo: { _id: "tech-2", name: "Bob Smith" },
    customerId: { _id: "cust-2", name: "Globex Industries" },
    location: "456 Mission St, San Francisco, CA",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "req-3",
    title: "Security Audit",
    description: "Annual security review",
    status: "Completed",
    assignedTo: { _id: "tech-3", name: "Carlos Rivera" },
    customerId: { _id: "cust-3", name: "Initech" },
    location: "789 Howard St, San Francisco, CA",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const mockTasks = [
  {
    _id: "task-1",
    title: "Replace router",
    priority: "High" as const,
    status: "Assigned" as const,
    location: "456 Mission St, San Francisco, CA",
    customerName: "Globex Industries",
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    _id: "task-2",
    title: "HVAC filter change",
    priority: "Medium" as const,
    status: "Completed" as const,
    location: "123 Market St, San Francisco, CA",
    customerName: "Acme Corp",
    scheduledDate: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export const mockDashboardStats = {
  technicians: 12,
  activeRequests: 8,
  completedToday: 5,
  customerSatisfaction: 92,
};

export const mockWeeklyRequests = [
  { weekDay: "Mon", value: 12 },
  { weekDay: "Tue", value: 18 },
  { weekDay: "Wed", value: 15 },
  { weekDay: "Thu", value: 22 },
  { weekDay: "Fri", value: 19 },
  { weekDay: "Sat", value: 8 },
  { weekDay: "Sun", value: 5 },
];
