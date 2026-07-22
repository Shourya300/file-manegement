import clientPromise from "./mongodb";
import { Activity } from "@/types/activity";

export async function logActivity(
  activity: Omit<Activity, "_id" | "createdAt">
) {
  const client = await clientPromise;
  const db = client.db("StudentDash");

  await db.collection("activities").insertOne({
    ...activity,
    createdAt: new Date(),
  });
}