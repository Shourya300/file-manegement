export type ActivityType =
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_UPDATED"
  | "ASSIGNMENT_DELETED"
  | "STATUS_CHANGED"
  | "FILE_UPLOADED"
  | "FILE_DELETED";

export interface Activity {
  _id?: string;

  assignmentId: string;

  userEmail: string;

  type: ActivityType;

  message: string;

  createdAt: Date;

  metadata?: {
  changes?: ActivityChange[];
};
}

export interface ActivityChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}