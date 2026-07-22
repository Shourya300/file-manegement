import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const assignmentId = searchParams.get("assignmentId");

  if (!assignmentId) {
    return Response.json(
      { error: "assignmentId is required" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db("StudentDash");

  const activitiesCollection = db.collection("activities");

  const activities = await activitiesCollection
    .find({
      assignmentId,
      userEmail: session.user.email,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return Response.json(activities);
}
