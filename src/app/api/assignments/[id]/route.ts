import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { logActivity } from "@/lib/activity";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ActivityChange } from "@/types/activity";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const assignmentsCollection = db.collection("assignments");

    const result = await assignmentsCollection.deleteOne({
      _id: new ObjectId(id),
      userEmail: session.user.email,
    });
    await logActivity({
      assignmentId: id,
      userEmail: session.user.email,
      type: "ASSIGNMENT_DELETED",
      message: "Deleted assignment",
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const changes: ActivityChange[] = [];

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const assignmentsCollection = db.collection("assignments");

    const oldAssignment = await assignmentsCollection.findOne({
      _id: new ObjectId(id),
      userEmail: session.user.email,
    });

    if (!oldAssignment) {
      return Response.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (oldAssignment.title !== body.title) {
      changes.push({
        field: "Title",
        oldValue: oldAssignment.title,
        newValue: body.title,
      });
    }

    if (oldAssignment.subject !== body.subject) {
      changes.push({
        field: "Subject",
        oldValue: oldAssignment.subject,
        newValue: body.subject,
      });
    }

    if (oldAssignment.description !== body.description) {
      changes.push({
        field: "Description",
        oldValue: oldAssignment.description,
        newValue: body.description,
      });
    }

    if (body.status !== undefined && oldAssignment.status !== body.status) {
      changes.push({
        field: "Status",
        oldValue: oldAssignment.status,
        newValue: body.status,
      });
    }

    const oldDate = new Date(oldAssignment.dueDate).toISOString();
const newDate = new Date(body.dueDate).toISOString();

if (oldDate !== newDate) {
  changes.push({
    field: "Due Date",
    oldValue: oldAssignment.dueDate,
    newValue: body.dueDate,
  });
}

    const updateFields: Record<string, unknown> = {
      title: body.title,
      subject: body.subject,
      description: body.description,
      dueDate: new Date(body.dueDate),
      updatedAt: new Date(),
    };

    if (body.status !== undefined) {
      updateFields.status = body.status;
    }

    const result = await assignmentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updateFields,
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
      userEmail: session.user.email,
    });

    await logActivity({
      assignmentId: id,
      userEmail: session.user.email,
      type: "ASSIGNMENT_UPDATED",
      message: "Updated assignment",
      metadata: {
        changes,
      },
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
