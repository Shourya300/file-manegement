"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import IndividualProjectsTab from "../components/IndividualProjectsTab";
import GroupProjectsTab from "../components/GroupProjectsTab";
import ProjectDetailView from "../components/ProjectDetailView";
import GroupProjectDetailView from "../components/GroupProjectDetailView";
import CalendarView from "../components/CalendarView";
import { individualProjects, groupProjects } from "../lib/data";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("individual");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedGroupProjectId, setSelectedGroupProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState(individualProjects);
  const [gProjects, setGProjects] = useState(groupProjects);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
    setSelectedGroupProjectId(null);
  };

  const handleSelectProjectFromCalendar = (id: number, type: "individual" | "group") => {
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
      const project = projects.find((p) => p.id === selectedProjectId);
      return project ? project.title : "Project Details";
    }
    if (activeTab === "group" && selectedGroupProjectId) {
      const project = gProjects.find((p) => p.id === selectedGroupProjectId);
      return project ? project.title : "Group Project Details";
    }
    if (activeTab === "calendar") return "My Academic Calendar";
    return activeTab === "individual" ? "My Individual Projects" : "Group Projects";
  };

  const isDetailViewActive = selectedProjectId !== null || selectedGroupProjectId !== null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 transition-colors">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        projects={projects}
        groupProjects={gProjects}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          title={getHeaderTitle()}
          showBackButton={isDetailViewActive}
          onBack={() => {
            setSelectedProjectId(null);
            setSelectedGroupProjectId(null);
          }}
        />

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === "calendar" ? (
              <CalendarView
                projects={projects}
                groupProjects={gProjects}
                onSelectProject={handleSelectProjectFromCalendar}
              />
            ) : activeTab === "individual" ? (
              selectedProjectId !== null ? (
                <ProjectDetailView
                  projectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                  projects={projects}
                  setProjects={setProjects}
                />
              ) : (
                <IndividualProjectsTab projects={projects} onSelectProject={setSelectedProjectId} />
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
