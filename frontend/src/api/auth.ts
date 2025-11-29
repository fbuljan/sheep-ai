import { API_URL } from "../config/api"; 

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  preferredWebsites: string[];
  phoneNumber?: string;
  preferences?: Record<string, any>;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message || "Registration failed");
  }

  return res.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  return res.json(); 
}
