"use client";

import { CheckCircle2, Loader2, PlusCircle, TriangleAlert } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Assignment } from "./assignmentTypes";

type FormState = {
  title: string;
  subject: string;
  description: string;
  dueDate: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type Props = {
  assignment: Assignment | null;
  onAssignmentAdded: (assignment: Assignment) => void;
};

const initialFormState: FormState = {
  title: "",
  subject: "",
  description: "",
  dueDate: "",
};


export default function AddAssignmentForm({
  assignment,
  onAssignmentAdded,
}: Props) {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description,
        dueDate: assignment.dueDate.slice(0, 10),
      });
      return;
    }

    setFormData(initialFormState);
  }, [assignment]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSuccessMessage("");
    setApiError("");
  };

  const validateForm = () => {
    // Validate required fields before the network request starts.
    const nextErrors: FormErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (!formData.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!formData.description.trim())
      nextErrors.description = "Description is required.";
    if (!formData.dueDate) nextErrors.dueDate = "Due date is required.";

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        assignment ? `/api/assignments/${assignment._id}` : "/api/assignments",
        {
          method: assignment ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = (await response.json()) as {
        message?: string;
        error?: string;
        id?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to save assignment.",
        );
      }

      setFormData(initialFormState);
      setSuccessMessage(result.message || "Assignment saved successfully.");

      const savedAssignment: Assignment = assignment
        ? {
            ...assignment,
            ...formData,
            dueDate: formData.dueDate,
            updatedAt: new Date().toISOString(),
          }
        : {
            _id: result.id || "",
            title: formData.title,
            subject: formData.subject,
            description: formData.description,
            dueDate: formData.dueDate,
            status: "To Do",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

      onAssignmentAdded(savedAssignment);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Unable to save assignment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500" />

        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Individual assignment
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {assignment ? "Edit Assignment" : "Add Assignment"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {assignment
                  ? "Update the subject, deadline, and supporting details for this assignment."
                  : "Capture a single assignment with its subject, deadline, and supporting details."}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <PlusCircle size={20} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-1">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </span>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Essay draft"
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.title
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                }`}
              />
              {errors.title ? (
                <p className="mt-2 text-sm text-rose-600">{errors.title}</p>
              ) : null}
            </label>

            <label className="block md:col-span-1">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </span>
              <input
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="English"
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.subject
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                }`}
              />
              {errors.subject ? (
                <p className="mt-2 text-sm text-rose-600">{errors.subject}</p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Summarize the work, expectations, and any submission notes."
                className={`w-full resize-none rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.description
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                }`}
              />
              {errors.description ? (
                <p className="mt-2 text-sm text-rose-600">
                  {errors.description}
                </p>
              ) : null}
            </label>

            <label className="block md:col-span-1">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Due Date
              </span>
              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.dueDate
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                }`}
              />
              {errors.dueDate ? (
                <p className="mt-2 text-sm text-rose-600">{errors.dueDate}</p>
              ) : null}
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-6">
              {apiError ? (
                <p className="flex items-center gap-2 text-sm font-medium text-rose-600">
                  <TriangleAlert size={16} />
                  {apiError}
                </p>
              ) : successMessage ? (
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 size={16} />
                  {successMessage}
                </p>
              ) : null}
            </div>

            {/* Keep the button disabled while the assignment is being saved. */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {isSubmitting
                ? assignment
                  ? "Updating..."
                  : "Saving..."
                : assignment
                  ? "Update Assignment"
                  : "Save Assignment"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
