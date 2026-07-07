"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import IndividualProjectsTab from "../../components/IndividualProjectsTab";
import AddAssignmentForm from "../../components/AddAssignmentForm";
import GroupProjectsTab from "../../components/GroupProjectsTab";
import ProjectDetailView from "../../components/ProjectDetailView";
import GroupProjectDetailView from "../../components/GroupProjectDetailView";
import CalendarView from "../../components/CalendarView";
import { useSession } from "next-auth/react";
import { groupProjects } from "../../lib/data";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("individual");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [selectedGroupProjectId, setSelectedGroupProjectId] = useState<
    number | null
  >(null);
  const [gProjects, setGProjects] = useState(groupProjects);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
    setSelectedGroupProjectId(null);
    setIsAddAssignmentOpen(false);
  };

  const handleSelectProjectFromCalendar = (
    id: number,
    type: "individual" | "group",
  ) => {
    setActiveTab(type);
    if (type === "individual") {
      setSelectedProjectId(id);
      setSelectedGroupProjectId(null);
    } else {
      setSelectedGroupProjectId(id);
      setSelectedProjectId(null);
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === "individual" && selectedProjectId) {
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
    selectedProjectId !== null || selectedGroupProjectId !== null;

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
            setSelectedProjectId(null);
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
              selectedProjectId !== null ? (
  <div>Assignment Details Coming Soon...</div>
) : (
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Add a new assignment</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Open the form to create a single assignment for your individual projects.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddAssignmentOpen((current) => !current)}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      {isAddAssignmentOpen ? "Hide Form" : "Add Assignment"}
                    </button>
                  </div>

                  {isAddAssignmentOpen ? <AddAssignmentForm
  onAssignmentAdded={() => {
    setRefreshKey((prev) => prev + 1);
    setIsAddAssignmentOpen(false);
  }}
/> : null}

                  <IndividualProjectsTab
    key={refreshKey}
    onSelectProject={(id) => {
      console.log(id);
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
        </div>
      </main>
    </div>
  );
}
