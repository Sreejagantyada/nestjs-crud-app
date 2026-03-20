"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createTask, fetchTasks, removeTask, updateTask } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Task } from "@/types";

function toDateInputValue(date: string) {
  return date.slice(0, 10);
}

function openCreateTaskDialog() {
  const dialog = document.getElementById(
    "create_task_dialog",
  ) as HTMLDialogElement | null;

  dialog?.showModal();
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) =>
        a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title),
      ),
    [tasks],
  );

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    void loadTasks();
  }, [router]);

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const createdTask = await createTask({ title, dueDate });
      setTasks((currentTasks) => [...currentTasks, createdTask]);
      setTitle("");
      setDueDate("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to create task",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing(task: Task) {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDueDate(toDateInputValue(task.dueDate));
  }

  async function handleUpdateTask(taskId: string) {
    setSubmitting(true);
    setError("");

    try {
      const updatedTask = await updateTask(taskId, {
        title: editingTitle,
        dueDate: editingDueDate,
      });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
      setEditingTaskId(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update task",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTask(taskId: string) {
    setSubmitting(true);
    setError("");

    try {
      await removeTask(taskId);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete task",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <main className="min-h-screen px-8 py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-5xl font-medium tracking-tight">My Tasks</h1>
            </div>

            <button
              type="button"
              className="inline-flex h-14 items-center gap-3 rounded-2xl bg-[var(--primary)] px-6 text-xl font-semibold text-white shadow-[0_14px_30px_rgba(51,45,122,0.22)] transition hover:opacity-95"
              onClick={openCreateTaskDialog}
            >
              <span className="text-3xl leading-none">+</span>
              <span>Create Task</span>
            </button>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-[2rem] bg-white px-8 py-20 text-center shadow-[0_24px_60px_rgba(51,45,122,0.08)]">
              <p className="text-lg text-[var(--muted)]">Loading tasks...</p>
            </div>
          ) : null}

          {!loading && sortedTasks.length === 0 ? (
            <div className="rounded-[2rem] bg-white px-8 py-24 text-center shadow-[0_24px_60px_rgba(51,45,122,0.08)]">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#dbeafe] text-5xl text-[#2563eb]">
                ✓
              </div>
              <h2 className="mt-8 text-4xl font-semibold tracking-tight">No tasks yet</h2>
              <p className="mt-4 text-2xl text-[var(--muted)]">
                Get started by creating your first task
              </p>
              <button
                type="button"
                className="mt-10 inline-flex h-14 items-center gap-3 rounded-2xl bg-[var(--primary)] px-8 text-xl font-semibold text-white shadow-[0_14px_30px_rgba(51,45,122,0.22)] transition hover:opacity-95"
                onClick={openCreateTaskDialog}
              >
                <span className="text-3xl leading-none">+</span>
                <span>Create Your First Task</span>
              </button>
            </div>
          ) : null}

          {!loading && sortedTasks.length > 0 ? (
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(51,45,122,0.08)]">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[rgba(237,241,247,0.55)] text-xl">
                  <tr>
                    <th className="border-b border-r border-[var(--border-soft)] px-5 py-4 font-medium">
                      Task Name
                    </th>
                    <th className="border-b border-r border-[var(--border-soft)] px-5 py-4 font-medium">
                      Due Date
                    </th>
                    <th className="border-b px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sortedTasks.map((task) => (
                    <tr key={task.id} className="text-lg">
                      {editingTaskId === task.id ? (
                        <>
                          <td className="border-b border-r border-[var(--border-soft)] px-5 py-4">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(event) => setEditingTitle(event.target.value)}
                              className="h-11 w-full rounded-lg border border-[#a8b5ff] bg-white px-3 outline-none transition focus:border-[var(--primary)]"
                            />
                          </td>
                          <td className="border-b border-r border-[var(--border-soft)] px-5 py-4">
                            <input
                              type="date"
                              value={editingDueDate}
                              onChange={(event) => setEditingDueDate(event.target.value)}
                              className="h-11 w-full rounded-lg border border-[#a8b5ff] bg-white px-3 outline-none transition focus:border-[var(--primary)]"
                            />
                          </td>
                          <td className="border-b px-5 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => void handleUpdateTask(task.id)}
                                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTaskId(null)}
                                className="rounded-lg border border-[var(--border-soft)] px-4 py-2 text-sm font-medium text-[var(--muted)]"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border-b border-r border-[var(--border-soft)] px-5 py-4">
                            {task.title}
                          </td>
                          <td className="border-b border-r border-[var(--border-soft)] px-5 py-4 text-[var(--muted)]">
                            {toDateInputValue(task.dueDate)}
                          </td>
                          <td className="border-b px-5 py-4">
                            <div className="flex items-center gap-3 text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => startEditing(task)}
                                className="rounded-lg bg-[#e8f0ff] px-3 py-2 text-[#2b7cff]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteTask(task.id)}
                                className="rounded-lg bg-[#fff0f0] px-3 py-2 text-[#ef4444]"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <dialog id="create_task_dialog" className="modal">
            <div className="modal-box max-w-lg rounded-[2rem] border border-[var(--border-soft)] bg-white p-8">
              <form method="dialog">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-4 top-4">
                  ✕
                </button>
              </form>

              <h2 className="text-3xl font-semibold tracking-tight">Create Task</h2>
              <p className="mt-2 text-[var(--muted)]">
                Add task name and due date. These are the only task fields returned by your backend.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleCreateTask}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Task Name</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Due Date</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#a8b5ff] bg-white px-4 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(51,45,122,0.08)]"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-xl bg-[var(--primary)] text-base font-semibold text-white shadow-[0_14px_30px_rgba(51,45,122,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Saving..." : "Create Task"}
                </button>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </section>
      </main>
    </AppShell>
  );
}
