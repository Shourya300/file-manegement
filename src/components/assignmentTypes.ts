export type AssignmentStatus = "To Do" | "In Progress" | "Completed" | string;

export type Assignment = {
  _id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};