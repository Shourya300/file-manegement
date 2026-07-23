"use client";

import { useEffect, useState } from "react";
import { Assignment } from "./assignmentTypes";
import FileSection from "./FileSection";
import ActivityTimeline from "./ActivityTimeline";
import {
  CalendarDays,
  Clock3,
  FileText,
  MoreVertical,
  Paperclip,
  PencilLine,
  Trash2,
  WandSparkles,
} from "lucide-react";

type Props = {
  assignment: Assignment;
  activityRefresh: number;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onStatusChange: (
    assignment: Assignment,
    status: Assignment["status"],
  ) => Promise<void> | void;
};

const formatDate = (value?: string | Date) => {
  if (!value) return "Not available";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusStyles = (status: Assignment["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "In Progress":
      return "bg-amber-50 text-amber-700 ring-amber-100";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
};

const statusOptions: Assignment["status"][] = [
  "To Do",
  "In Progress",
  "Completed",
];

export default function AssignmentDetailView({
  assignment,
  activityRefresh,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const [currentStatus, setCurrentStatus] = useState(assignment.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [fileRefreshKey, setFileRefreshKey] = useState(0);

  useEffect(() => {
    setCurrentStatus(assignment.status);
    setStatusError("");
  }, [assignment.status, assignment._id]);

  const createdAt = formatDate(assignment.createdAt);
  const updatedAt = formatDate(assignment.updatedAt);
  const dueDate = formatDate(assignment.dueDate);

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextStatus = event.target.value as Assignment["status"];

    if (nextStatus === currentStatus) {
      return;
    }

    const previousStatus = currentStatus;
    setCurrentStatus(nextStatus);
    setStatusError("");
    setIsUpdatingStatus(true);

    try {
      await onStatusChange(assignment, nextStatus);
    } catch (error) {
      setCurrentStatus(previousStatus);
      setStatusError(
        error instanceof Error ? error.message : "Unable to update status.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
        <div className="space-y-6">
          <header className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500" />

            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 ring-1 ring-inset ring-sky-100">
                    {assignment.subject}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyles(
                      currentStatus,
                    )}`}
                  >
                    {currentStatus}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Individual Assignment
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {assignment.title}
                  </h1>
                  <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={15} className="text-slate-400" />
                      Due {dueDate}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={15} className="text-slate-400" />
                      Created {createdAt}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-500">
                <MoreVertical size={16} />
                Detail view
              </div>
            </div>
          </header>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                <p className="text-sm text-slate-500">Full assignment details</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600 sm:p-6 sm:text-[15px]">
              {assignment.description}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ActivityTimeline
              assignmentId={assignment._id}
              refreshKey={activityRefresh + fileRefreshKey}
            />
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Assignment Information
                </h2>
              </div>
            </div>

            <dl className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Update Status
                </dt>
                <dd className="mt-3">
                  <select
                    onChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    aria-label="Update assignment status"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {statusError ? (
                    <p className="mt-2 text-sm text-rose-600">{statusError}</p>
                  ) : null}
                </dd>
              </div>
              
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Last Updated
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-900">
                  {updatedAt}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="rounded-full bg-slate-100 p-2 text-slate-400">
                <WandSparkles size={16} />
              </div>
            </div>

            {/* TODO: Wire edit, delete, and status changes to the assignment workflow later. */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onEdit(assignment)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <PencilLine size={16} />
                Edit Assignment
              </button>
              <button
                type="button"
                onClick={() => onDelete(assignment)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 size={16} />
                Delete Assignment
              </button>
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Paperclip size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Files</h2>
                <p className="mt-1 text-sm text-slate-500">Uploaded attachments</p>
              </div>
            </div>

            {/* TODO: Integrate this section with Google Drive file attachments later. */}
            <FileSection
              assignmentId={assignment._id}
              onFilesChanged={() => setFileRefreshKey((prev) => prev + 1)}
            />
          </article>
        </aside>
      </div>
    </section>
  );
}