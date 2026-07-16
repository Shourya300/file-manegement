import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadFile } from "@/lib/googleDrive";
import { ObjectId } from "mongodb";

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

  const assignmentsCollection = db.collection("assignments");
  const filesCollection = db.collection("files");

  const assignment = await assignmentsCollection.findOne({
  _id: new ObjectId(assignmentId),
  userEmail: session.user.email,
});

if (!assignment) {
  return Response.json(
    { error: "Assignment not found" },
    { status: 404 }
  );
}

  const files = await filesCollection
    .find({
      assignmentId,
      userEmail: session.user.email,
    })
    .sort({
      uploadedAt: -1,
    })
    .toArray();
  return Response.json(files);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    const assignmentId = formData.get("assignmentId") as string | null;

    if (!file || !assignmentId) {
      return Response.json(
        {
          error: "File and assignmentId are required",
        },
        {
          status: 400,
        },
      );
    }

    const client = await clientPromise;
    const db = client.db("StudentDash");

    const assignmentsCollection = db.collection("assignments");
    const filesCollection = db.collection("files");

    const assignment = await assignmentsCollection.findOne({
      _id: new ObjectId(assignmentId),
      userEmail: session.user.email,
    });

    if (!assignment) {
      return Response.json({ error: "Assignment not found" }, { status: 404 });
    }

    const accessToken = session.accessToken;

    if (!accessToken) {
      return Response.json(
        { error: "Google Drive not authenticated" },
        { status: 401 },
      );
    }

    const uploadedFile = await uploadFile(
      accessToken,
      file,
      assignment.driveFolderId,
    );

    await filesCollection.insertOne({
      assignmentId,

      userEmail: session.user.email,

      driveFileId: uploadedFile.id,

      fileName: uploadedFile.name,

      mimeType: uploadedFile.mimeType,

      size: Number(uploadedFile.size),

      uploadedAt: new Date(),
    });

    return Response.json(
      {
        message: "File uploaded successfully",
        file: uploadedFile,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
