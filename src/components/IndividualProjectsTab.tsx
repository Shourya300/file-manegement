"use client";
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  MoreVertical,
  Calendar,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

type Assignment = {
  _id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: string;
};

type Props = {
  onSelectProject: (id: string) => void;
};

export default function IndividualProjectsTab({ onSelectProject }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch("/api/assignments");
    const data = await res.json();

    setAssignments(data);
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Active Projects
            </p>
            <p className="text-2xl font-bold text-slate-800">3</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Upcoming Deadlines
            </p>
            <p className="text-2xl font-bold text-slate-800">2</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
          </div>
        </div>
      </div>

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
              className="p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer"
              onClick={() => onSelectProject(assignment._id)}
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
                      className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
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
