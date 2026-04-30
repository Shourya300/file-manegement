"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import IndividualProjectsTab from "../components/IndividualProjectsTab";
import GroupProjectsTab from "../components/GroupProjectsTab";
import ProjectDetailView from "../components/ProjectDetailView";
import GroupProjectDetailView from "../components/GroupProjectDetailView";
import { individualProjects, groupProjects } from "../lib/data";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("individual");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedGroupProjectId, setSelectedGroupProjectId] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedProjectId(null); // Reset detail view when changing tabs
    setSelectedGroupProjectId(null);
  };

  const getHeaderTitle = () => {
    if (activeTab === "individual" && selectedProjectId) {
      const project = individualProjects.find(p => p.id === selectedProjectId);
      return project ? project.title : "Project Details";
    }
    if (activeTab === "group" && selectedGroupProjectId) {
      const project = groupProjects.find(p => p.id === selectedGroupProjectId);
      return project ? project.title : "Group Project Details";
    }
    return activeTab === "individual" ? "My Individual Projects" : "Group Projects";
  };

  const isDetailViewActive = selectedProjectId !== null || selectedGroupProjectId !== null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

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
            {activeTab === "individual" ? (
              selectedProjectId !== null ? (
                <ProjectDetailView projectId={selectedProjectId} />
              ) : (
                <IndividualProjectsTab onSelectProject={setSelectedProjectId} />
              )
            ) : (
              selectedGroupProjectId !== null ? (
                <GroupProjectDetailView projectId={selectedGroupProjectId} />
              ) : (
                <GroupProjectsTab onSelectProject={setSelectedGroupProjectId} />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
