export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
};

export type TaskInput = {
  title: string;
  dueDate: string;
};

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};
