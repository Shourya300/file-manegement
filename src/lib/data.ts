export type TimelineEvent = {
  id: number;
  type: "upload" | "status_change" | "comment" | "creation";
  content: string;
  date: string;
  time: string;
  file?: {
    name: string;
    size: string;
    type: string;
  };
};

export type IndividualProject = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
  progress: number;
  recentUpdate: string;
  updateTime: string;
  description: string;
  timeline: TimelineEvent[];
};

export type GroupProjectUpdate = {
  user: string;
  action: string;
  time: string;
};

export type GroupProject = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  team: string[];
  recentUpdates: GroupProjectUpdate[];
};

export const individualProjects: IndividualProject[] = [
  {
    id: 1,
    title: "Operating Systems Assignment 3",
    course: "CS 301",
    dueDate: "May 5, 2026",
    status: "In Progress",
    progress: 60,
    recentUpdate: "Uploaded 'scheduler_v2.c'",
    updateTime: "2 hours ago",
    description: "In this assignment, you are required to implement a Multilevel Feedback Queue (MLFQ) scheduler in the xv6 operating system. You must ensure that I/O bound processes are prioritized and CPU bound processes are appropriately demoted. Submit your patch file and a detailed PDF explaining your design decisions.",
    timeline: [
      {
        id: 104,
        type: "upload",
        content: "Uploaded improved scheduler algorithm.",
        date: "May 1, 2026",
        time: "10:30 AM",
        file: { name: "scheduler_v2.c", size: "14 KB", type: "C Source File" }
      },
      {
        id: 103,
        type: "status_change",
        content: "Progress updated to 60%",
        date: "April 29, 2026",
        time: "04:15 PM"
      },
      {
        id: 102,
        type: "upload",
        content: "Initial draft of the scheduler data structures.",
        date: "April 28, 2026",
        time: "09:00 AM",
        file: { name: "scheduler_draft.c", size: "4 KB", type: "C Source File" }
      },
      {
        id: 101,
        type: "creation",
        content: "Started working on the assignment.",
        date: "April 26, 2026",
        time: "11:00 AM"
      }
    ]
  },
  {
    id: 2,
    title: "Database Design Schema",
    course: "CS 310",
    dueDate: "May 8, 2026",
    status: "Pending",
    progress: 20,
    recentUpdate: "Created 'schema_draft.sql'",
    updateTime: "1 day ago",
    description: "Design a fully normalized database schema (up to 3NF) for a university library management system. Include tables for students, books, authors, borrowing records, and fines. Your submission must include an ER diagram and the SQL DDL commands to create the tables.",
    timeline: [
      {
        id: 202,
        type: "upload",
        content: "Initial tables and foreign keys setup.",
        date: "April 30, 2026",
        time: "02:20 PM",
        file: { name: "schema_draft.sql", size: "2 KB", type: "SQL File" }
      },
      {
        id: 201,
        type: "creation",
        content: "Assignment started. Progress set to 20%.",
        date: "April 29, 2026",
        time: "08:15 PM"
      }
    ]
  },
  {
    id: 3,
    title: "Machine Learning Paper Review",
    course: "CS 450",
    dueDate: "May 10, 2026",
    status: "Completed",
    progress: 100,
    recentUpdate: "Submitted 'final_review.pdf'",
    updateTime: "2 days ago",
    description: "Write a comprehensive 4-page review on the provided paper: 'Attention Is All You Need' (Vaswani et al.). Focus on the novelties of the Transformer architecture, the concept of Self-Attention, and the implications for parallelization compared to RNNs.",
    timeline: [
      {
        id: 304,
        type: "upload",
        content: "Final submission completed.",
        date: "April 29, 2026",
        time: "06:45 PM",
        file: { name: "final_review.pdf", size: "1.2 MB", type: "PDF Document" }
      },
      {
        id: 303,
        type: "status_change",
        content: "Progress updated to 100%. Status changed to Completed.",
        date: "April 29, 2026",
        time: "06:45 PM"
      },
      {
        id: 302,
        type: "upload",
        content: "Uploaded second draft after peer review.",
        date: "April 27, 2026",
        time: "01:10 PM",
        file: { name: "review_draft_v2.docx", size: "850 KB", type: "Word Document" }
      },
      {
        id: 301,
        type: "creation",
        content: "Started writing the review.",
        date: "April 25, 2026",
        time: "10:00 AM"
      }
    ]
  },
];

export const groupProjects: GroupProject[] = [
  {
    id: 1,
    title: "Web App Final Project",
    course: "CS 405",
    dueDate: "May 15, 2026",
    team: ["Alice", "Bob", "Charlie", "You"],
    recentUpdates: [
      { user: "Alice", action: "Updated 'UI_mockups.fig'", time: "1 hr ago" },
      { user: "Bob", action: "Pushed to 'feature/auth' branch", time: "3 hrs ago" },
    ],
  },
  {
    id: 2,
    title: "Network Protocols Implementation",
    course: "CS 320",
    dueDate: "May 12, 2026",
    team: ["Dave", "Eve", "You"],
    recentUpdates: [
      { user: "Dave", action: "Uploaded 'tcp_handshake.md'", time: "5 hrs ago" },
      { user: "You", action: "Modified 'server.py'", time: "1 day ago" },
    ],
  },
];
