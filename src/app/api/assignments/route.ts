import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

if (!session?.user?.email) {
  return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
  const client = await clientPromise;
  const db = client.db("StudentDash");

  const assignmentsCollection = db.collection("assignments");

const assignments = await assignmentsCollection
  .find({
  userEmail: session.user.email,
})
  .sort({ dueDate: 1 })
  .toArray();

  return Response.json(assignments); 
}

export async function POST(request: Request) {
  const body = await request.json();
if (!body.title || !body.description || !body.subject || !body.dueDate) {
  return Response.json(
    { error: "All fields are required" },
    { status: 400 }
  );
}
const session = await getServerSession(authOptions);

if (!session?.user?.email) {
  return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
  const client = await clientPromise;
  const db = client.db("StudentDash");
  const assignmentsCollection = db.collection("assignments");

  const result = await assignmentsCollection.insertOne({
    userEmail: session.user.email,

    title: body.title,
    description: body.description,
    subject: body.subject,
    dueDate: new Date(body.dueDate),
    status: "To Do",
    createdAt: new Date(),
    updatedAt: new Date(),
});

  return Response.json(
  {
    message: "Assignment created successfully",
    id: result.insertedId,
  },
  { status: 201 }
);
}