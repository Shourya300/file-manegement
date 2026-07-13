"use client";
import {
  MoreVertical,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { Assignment } from "./assignmentTypes";

type Props = {
  assignments: Assignment[];
  onSelectProject: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
};

export default function IndividualProjectsTab({
  assignments,
  onSelectProject,
  onEdit,
  onDelete,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDeleteAssignment = async (assignmentId: string) => {
    const confirmDelete = window.confirm(
      "Delete this assignment? This action cannot be undone.",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete assignment.");
      }

      onDelete(assignmentId);
      setOpenMenuId(null);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Unable to delete assignment.",
      );
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Projects</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
            View all
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="relative p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer"
              onClick={() => onSelectProject(assignment)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md mb-2 transition-colors">
                        {assignment.subject}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {assignment.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((currentMenuId: string | null) =>
                          currentMenuId === assignment._id
                            ? null
                            : assignment._id,
                        );
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openMenuId === assignment._id ? (
                      <div
                        className="absolute right-6 top-14 z-10 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                          onClick={() => {
                            onEdit(assignment);
                            setOpenMenuId(null);
                          }}
                        >
                          Edit Assignment
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => handleDeleteAssignment(assignment._id)}
                        >
                          Delete Assignment
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    {assignment.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-slate-400" />
                      <span>
                        Due:{" "}
                        <span className="font-medium text-slate-700">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          assignment.status === "Completed"
                            ? "bg-emerald-500"
                            : assignment.status === "In Progress"
                              ? "bg-amber-500"
                              : "bg-slate-300"
                        }`}
                      ></span>
                      <span>{assignment.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
