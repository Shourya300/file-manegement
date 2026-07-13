"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import IndividualProjectsTab from "../../components/IndividualProjectsTab";
import AddAssignmentForm from "../../components/AddAssignmentForm";
import GroupProjectsTab from "../../components/GroupProjectsTab";
import ProjectDetailView from "../../components/ProjectDetailView";
import GroupProjectDetailView from "../../components/GroupProjectDetailView";
import AssignmentDetailView from "../../components/AssignmentDetailView";
import CalendarView from "../../components/CalendarView";
import { useSession } from "next-auth/react";
import { groupProjects } from "../../lib/data";
import { Assignment } from "../../components/assignmentTypes";
import Modal from "../../components/Modals";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("individual");
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedGroupProjectId, setSelectedGroupProjectId] = useState<
    number | null
  >(null);
  const [gProjects, setGProjects] = useState(groupProjects);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setIsLoadingAssignments(true);
        const response = await fetch("/api/assignments");
        const data = (await response.json()) as Assignment[];

        setAssignments(data);
      } finally {
        setIsLoadingAssignments(false);
      }
    };

    loadAssignments();
  }, []);

  const upsertAssignment = (assignment: Assignment) => {
    setAssignments((currentAssignments) => {
      const exists = currentAssignments.some(
        (currentAssignment) => currentAssignment._id === assignment._id,
      );

      return exists
        ? currentAssignments.map((currentAssignment) =>
            currentAssignment._id === assignment._id
              ? assignment
              : currentAssignment,
          )
        : [assignment, ...currentAssignments];
    });

    setSelectedAssignment((currentSelectedAssignment) =>
      currentSelectedAssignment && currentSelectedAssignment._id === assignment._id
        ? assignment
        : currentSelectedAssignment,
    );
  };

  const handleAssignmentSave = (assignment: Assignment) => {
    upsertAssignment(assignment);
    setSelectedAssignment(assignment);
    setEditingAssignment(null);
    setIsAddAssignmentOpen(false);
  };

  const updateAssignmentStatus = async (
    assignment: Assignment,
    nextStatus: Assignment["status"],
  ) => {
    const response = await fetch(`/api/assignments/${assignment._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...assignment,
        status: nextStatus,
      }),
    });

    const result = (await response.json()) as {
      message?: string;
      error?: string;
      assignment?: Assignment;
    };

    if (!response.ok) {
      throw new Error(
        result.error || result.message || "Unable to update assignment status.",
      );
    }

    if (result.assignment) {
      upsertAssignment(result.assignment);
      return;
    }

    upsertAssignment({
      ...assignment,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const removeAssignment = (assignmentId: string) => {
    setAssignments((currentAssignments) =>
      currentAssignments.filter(
        (currentAssignment) => currentAssignment._id !== assignmentId,
      ),
    );

    setSelectedAssignment((currentSelectedAssignment) =>
      currentSelectedAssignment && currentSelectedAssignment._id === assignmentId
        ? null
        : currentSelectedAssignment,
    );

    setEditingAssignment((currentEditingAssignment) =>
      currentEditingAssignment && currentEditingAssignment._id === assignmentId
        ? null
        : currentEditingAssignment,
    );
    setIsAddAssignmentOpen((currentOpen) =>
      currentOpen && editingAssignment?._id === assignmentId ? false : currentOpen,
    );
  };

  const deleteAssignment = async (assignment: Assignment) => {
    const shouldDelete = window.confirm(
      `Delete \"${assignment.title}\"? This cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/assignments/${assignment._id}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete assignment.");
      }

      removeAssignment(assignment._id);
      setSelectedAssignment(null);
      setEditingAssignment(null);
      setIsAddAssignmentOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedAssignment(null);
    setSelectedGroupProjectId(null);
    setIsAddAssignmentOpen(false);
    setEditingAssignment(null);
  };

  const handleSelectProjectFromCalendar = (
    id: number,
    type: "individual" | "group",
  ) => {
    setActiveTab(type);
    if (type === "individual") {
      const matchingAssignment = assignments.find(
        (assignment) => assignment._id === String(id),
      );

      setSelectedAssignment(matchingAssignment || null);
      setSelectedGroupProjectId(null);
    } else {
      setSelectedGroupProjectId(id);
      setSelectedAssignment(null);
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === "individual" && selectedAssignment) {
      return "Assignment Details";
    }
    if (activeTab === "group" && selectedGroupProjectId) {
      const project = gProjects.find((p) => p.id === selectedGroupProjectId);
      return project ? project.title : "Group Project Details";
    }
    if (activeTab === "calendar") return "My Academic Calendar";
    return activeTab === "individual"
      ? "My Individual Projects"
      : "Group Projects";
  };

  const isDetailViewActive =
    selectedAssignment !== null || selectedGroupProjectId !== null;

  const { data: session } = useSession();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        projects={[]}
        groupProjects={gProjects}
      />

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <Header
          title={getHeaderTitle()}
          showBackButton={isDetailViewActive}
          userName={session?.user?.name}
          onBack={() => {
            setSelectedAssignment(null);
            setSelectedGroupProjectId(null);
          }}
        />

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {activeTab === "calendar" ? (
              <CalendarView
                projects={[]}
                groupProjects={gProjects}
                onSelectProject={handleSelectProjectFromCalendar}
              />
            ) : activeTab === "individual" ? (
              selectedAssignment !== null ? (
                <AssignmentDetailView
                  assignment={selectedAssignment}
                  onEdit={(assignment) => {
                    setEditingAssignment(assignment);
                    setIsAddAssignmentOpen(true);
                    setSelectedAssignment(assignment);
                  }}
                  onDelete={(assignment) => {
                    void deleteAssignment(assignment);
                  }}
                  onStatusChange={updateAssignmentStatus}
                />
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Add a new assignment
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Open the form to create a single assignment for your
                        individual projects.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssignment(null);
                        setIsAddAssignmentOpen((current) => !current);
                      }}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      {isAddAssignmentOpen ? "Hide Form" : "Add Assignment"}
                    </button>
                  </div>

                  {isAddAssignmentOpen ? (
                    <AddAssignmentForm
                      assignment={editingAssignment}
                      onAssignmentAdded={handleAssignmentSave}
                    />
                  ) : null}

                  <IndividualProjectsTab
                    assignments={assignments}
                    onDelete={removeAssignment}
                    onSelectProject={(assignment) => {
                      setSelectedAssignment(assignment);
                    }}
                    onEdit={(assignment) => {
                      setEditingAssignment(assignment);
                      setIsAddAssignmentOpen(true);
                    }}
                  />
                </div>
              )
            ) : selectedGroupProjectId !== null ? (
              <GroupProjectDetailView
                projectId={selectedGroupProjectId}
                groupProjects={gProjects}
                setGroupProjects={setGProjects}
              />
            ) : (
              <GroupProjectsTab onSelectProject={setSelectedGroupProjectId} />
            )}
          </div>
          {isAddAssignmentOpen && editingAssignment ? (
            <Modal
              onClose={() => {
                setIsAddAssignmentOpen(false);
                setEditingAssignment(null);
              }}
            >
              <AddAssignmentForm
                assignment={editingAssignment}
                onAssignmentAdded={handleAssignmentSave}
              />
            </Modal>
          ) : null}
        </div>
      </main>
    </div>
  );
}
