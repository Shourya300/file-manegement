import { getGoogleDrive } from "./client";

export async function createFolder(
  accessToken: string,
  folderName: string,
  parentFolderId?: string
) {
  const drive = getGoogleDrive(accessToken);

  const response = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : undefined,
    },
    fields: "id, name",
  });

  return response.data;
}

export async function findStudentDashFolder(accessToken: string) {
  const drive = getGoogleDrive(accessToken);

  const response = await drive.files.list({
    q: "name='StudentDash' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: "files(id, name)",
  });

  return response.data.files?.[0] ?? null;
}

export async function initializeGoogleDrive(accessToken: string) {
  const existingFolder = await findStudentDashFolder(accessToken);

  if (existingFolder?.id) {
    return existingFolder.id;
  }

  const newFolder = await createFolder(accessToken, "StudentDash");

  if (!newFolder.id) {
    throw new Error("Failed to create StudentDash folder.");
  }

  return newFolder.id;
}

export async function createAssignmentFolder(
  accessToken: string,
  assignmentName: string,
  studentDashFolderId: string
) {
  const folder = await createFolder(
    accessToken,
    assignmentName,
    studentDashFolderId
  );

  if (!folder.id) {
    throw new Error("Failed to create assignment folder.");
  }

  return folder.id;
}