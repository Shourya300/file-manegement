"use client";
import { useState } from "react";

import { Activity } from "@/types/activity";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="border rounded-lg p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <p className="text-sm font-medium">{activity.message}</p>

      <p className="text-xs text-gray-500 mt-1">
        {new Date(activity.createdAt).toLocaleString()}
      </p>
      {expanded &&
        activity.metadata?.changes &&
        activity.metadata.changes.length > 0 && (
          <div className="mt-3 border-t pt-3 space-y-2">
            {activity.metadata.changes.map((change, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{change.field}</p>

                <p className="text-gray-600">
                  {String(change.oldValue)} → {String(change.newValue)}
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
