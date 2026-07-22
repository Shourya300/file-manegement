"use client";

import { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem";
import { Activity } from "@/types/activity";

interface ActivityTimelineProps {
  assignmentId: string;
  refreshKey?: number;
}

export default function ActivityTimeline({
  assignmentId,
  refreshKey = 0,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [assignmentId, refreshKey]);

  async function fetchActivities() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/activities?assignmentId=${assignmentId}`
      );

      const data = await response.json();

      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Activity Timeline
        </h2>

        <p className="text-gray-500">
          Loading activities...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">
        Activity Timeline
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500">
          No activity yet.
        </p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
  {activities.map((activity) => (
    <ActivityItem
      key={activity._id}
      activity={activity}
    />
  ))}
</div>
      )}
    </div>
  );
}