import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const assignmentsCollection = db.collection("assignments");

    const result = await assignmentsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Assignment not found" }, { status: 404 });
    }

    return Response.json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete assignment" },
      { status: 500 },
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const assignmentsCollection = db.collection("assignments");

    const result = await assignmentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: body.title,
          subject: body.subject,
          description: body.description,
          status: body.status,
          dueDate: new Date(body.dueDate),
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return Response.json(
        {
          error: "Assignment not found",
        },
        {
          status: 404,
        },
      );
    }

    const updatedAssignment = await assignmentsCollection.findOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to update assignment",
      },
      {
        status: 500,
      },
    );
  }
}
