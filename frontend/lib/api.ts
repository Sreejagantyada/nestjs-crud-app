import { getAccessToken } from "@/lib/auth";
import type {
  AuthResponse,
  LoginInput,
  SignupInput,
  Task,
  TaskInput,
  UpdateProfileInput,
  UserProfile,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type ApiRequestOptions = RequestInit & {
  authenticated?: boolean;
};

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text
    ? (JSON.parse(text) as T | { message?: string | string[] })
    : null;

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      data.message
        ? Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message
        : "Request failed";

    throw new Error(message);
  }

  return data as T;
}

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = options.authenticated ? getAccessToken() : null;

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseJson<T>(response);
}

export function signup(payload: SignupInput) {
  return request<{ id: string; email: string }>("/users/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginInput) {
  return request<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchTasks() {
  return request<Task[]>("/tasks", {
    method: "GET",
    authenticated: true,
  });
}

export function createTask(payload: TaskInput) {
  return request<Task>("/tasks", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(payload),
  });
}

export function updateTask(taskId: string, payload: Partial<TaskInput>) {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    authenticated: true,
    body: JSON.stringify(payload),
  });
}

export function removeTask(taskId: string) {
  return request<{ message: string }>(`/tasks/${taskId}`, {
    method: "DELETE",
    authenticated: true,
  });
}

export function fetchProfile() {
  return request<UserProfile>("/users/profile", {
    method: "GET",
    authenticated: true,
  });
}

export function updateProfile(payload: UpdateProfileInput) {
  return request<UserProfile>("/users/profile", {
    method: "PATCH",
    authenticated: true,
    body: JSON.stringify(payload),
  });
}
