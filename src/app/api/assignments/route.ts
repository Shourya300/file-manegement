import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("StudentDash");

  const assignmentsCollection = db.collection("assignments");

  const assignments = await assignmentsCollection
    .find({})
    .sort({ createdAt: -1 })
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
  const client = await clientPromise;
  const db = client.db("StudentDash");
  const assignmentsCollection = db.collection("assignments");

  const result = await assignmentsCollection.insertOne({
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