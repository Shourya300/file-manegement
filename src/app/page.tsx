"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import IndividualProjectsTab from "../components/IndividualProjectsTab";
import GroupProjectsTab from "../components/GroupProjectsTab";
import ProjectDetailView from "../components/ProjectDetailView";
import { individualProjects } from "../lib/data";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("individual");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedProjectId(null); // Reset detail view when changing tabs
  };

  const getHeaderTitle = () => {
    if (selectedProjectId) {
      const project = individualProjects.find(p => p.id === selectedProjectId);
      return project ? project.title : "Project Details";
    }
    return activeTab === "individual" ? "My Individual Projects" : "Group Projects";
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          title={getHeaderTitle()} 
          showBackButton={selectedProjectId !== null}
          onBack={() => setSelectedProjectId(null)}
        />

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {selectedProjectId !== null ? (
              <ProjectDetailView projectId={selectedProjectId} />
            ) : (
              activeTab === "individual" ? (
                <IndividualProjectsTab onSelectProject={setSelectedProjectId} />
              ) : (
                <GroupProjectsTab />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
