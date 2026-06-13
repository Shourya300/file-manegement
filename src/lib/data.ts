export type TimelineEvent = {
  id: number;
  type: "upload" | "status_change" | "comment" | "creation" | "commit" | "pr";
  content: string;
  date: string;
  time: string;
  user?: string;
  deadline?: string;
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

export type GroupMember = {
  id: string;
  name: string;
  role: string;
  color: string;
};

export type GroupTask = {
  id: number;
  title: string;
  about?: string;
  deadline?: string;
  status: "todo" | "in-progress" | "done";
  assigneeId: string;
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
  description: string;
  team: GroupMember[];
  recentUpdates: GroupProjectUpdate[];
  timeline: TimelineEvent[];
  tasks: GroupTask[];
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
    description: "Build a full-stack web application using Next.js and TailwindCSS. The application must feature user authentication, real-time database updates, and a responsive mobile-first design. The final deliverable includes a working deployment and a presentation.",
    team: [
      { id: "u1", name: "Alice", role: "Frontend Lead", color: "bg-pink-500" },
      { id: "u2", name: "Bob", role: "Backend Dev", color: "bg-blue-500" },
      { id: "u3", name: "Charlie", role: "Designer", color: "bg-amber-500" },
      { id: "u4", name: "You", role: "Fullstack / DevOps", color: "bg-indigo-500" },
    ],
    recentUpdates: [
      { user: "Alice", action: "Updated 'UI_mockups.fig'", time: "1 hr ago" },
      { user: "Bob", action: "Pushed to 'feature/auth' branch", time: "3 hrs ago" },
    ],
    timeline: [
      { id: 1001, type: "upload", user: "Alice", content: "Updated 'UI_mockups.fig' with new dashboard layout.", date: "May 1, 2026", time: "10:00 AM", file: { name: "UI_mockups.fig", size: "4.2 MB", type: "Figma File" } },
      { id: 1002, type: "commit", user: "Bob", content: "Pushed to 'feature/auth' branch: Added JWT token verification.", date: "May 1, 2026", time: "08:15 AM" },
      { id: 1003, type: "pr", user: "You", content: "Opened Pull Request: 'Setup Vercel deployment pipeline'", date: "April 30, 2026", time: "04:30 PM" },
      { id: 1004, type: "comment", user: "Charlie", content: "Left a comment on the color palette selection.", date: "April 29, 2026", time: "02:00 PM" },
      { id: 1005, type: "creation", user: "You", content: "Project repository initialized.", date: "April 28, 2026", time: "09:00 AM" },
    ],
    tasks: [
      { id: 1, title: "Design Login Screen", about: "Create the first-pass authentication screen with form states and responsive layout.", deadline: "2026-05-04", status: "done", assigneeId: "u3" },
      { id: 2, title: "Implement NextAuth", about: "Wire up the authentication flow and confirm protected route behavior.", deadline: "2026-05-06", status: "in-progress", assigneeId: "u2" },
      { id: 3, title: "Setup CI/CD Actions", about: "Add deployment checks and automate preview builds for each branch.", deadline: "2026-05-08", status: "in-progress", assigneeId: "u4" },
      { id: 4, title: "Build Dashboard UI components", about: "Finish the reusable dashboard cards, nav states, and responsive layout.", deadline: "2026-05-10", status: "todo", assigneeId: "u1" },
      { id: 5, title: "Write API endpoints for user data", about: "Create CRUD endpoints and verify the response contracts for the UI.", deadline: "2026-05-12", status: "todo", assigneeId: "u2" },
    ]
  },
  {
    id: 2,
    title: "Network Protocols Implementation",
    course: "CS 320",
    dueDate: "May 12, 2026",
    description: "Implement a reliable transport protocol on top of UDP. The protocol must handle packet loss, reordering, and corruption. You will be tested against a chaotic network emulator.",
    team: [
      { id: "u5", name: "Dave", role: "Protocol Logic", color: "bg-emerald-500" },
      { id: "u6", name: "Eve", role: "Testing & QA", color: "bg-rose-500" },
      { id: "u4", name: "You", role: "Socket Programming", color: "bg-indigo-500" },
    ],
    recentUpdates: [
      { user: "Dave", action: "Uploaded 'tcp_handshake.md'", time: "5 hrs ago" },
      { user: "You", action: "Modified 'server.py'", time: "1 day ago" },
    ],
    timeline: [
      { id: 2001, type: "upload", user: "Dave", content: "Uploaded documentation for handshake state machine.", date: "May 1, 2026", time: "07:00 AM", file: { name: "tcp_handshake.md", size: "12 KB", type: "Markdown" } },
      { id: 2002, type: "commit", user: "You", content: "Modified 'server.py' to handle dropped ACKs.", date: "April 30, 2026", time: "11:20 PM" },
      { id: 2003, type: "upload", user: "Eve", content: "Added initial packet loss test scripts.", date: "April 29, 2026", time: "01:15 PM", file: { name: "test_loss.py", size: "3 KB", type: "Python Script" } },
    ],
    tasks: [
      { id: 6, title: "Write UDP Wrapper", about: "Build the transport wrapper that normalizes packet send and receive behavior.", deadline: "2026-05-03", status: "done", assigneeId: "u4" },
      { id: 7, title: "Implement Sliding Window", about: "Add windowing logic for reliable delivery and retransmission tracking.", deadline: "2026-05-07", status: "in-progress", assigneeId: "u5" },
      { id: 8, title: "Create test cases for 20% packet loss", about: "Cover packet loss behavior, retries, and recovery edge cases.", deadline: "2026-05-09", status: "todo", assigneeId: "u6" },
      { id: 9, title: "Handle out-of-order packets", about: "Buffer and reorder packets before handing data to the application layer.", deadline: "2026-05-11", status: "todo", assigneeId: "u4" },
    ]
  },
];
