const API_BASE = "http://localhost:5001/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // important for Flask-Login session cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // ignore if no JSON
  }

  if (!res.ok) {
    const error = new Error(data.error || "API request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth helpers
export function loginApi({ username, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export function checkSessionApi() {
  return apiFetch("/auth/check_session", {
    method: "GET"
  });
}

export function logoutApi() {
  return apiFetch("/auth/logout", {
    method: "POST"
  });
}

// Resource helpers
export function fetchMatchmakers() {
  return apiFetch("/matchmakers", { method: "GET" });
}

export function fetchMatchmaker(id) {
  return apiFetch(`/matchmakers/${id}`, { method: "GET" });
}

export function createMatchmaker(payload) {
  return apiFetch("/matchmakers", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchMaleSingles() {
  return apiFetch("/male_singles", { method: "GET" });
}

export function fetchMaleSingle(id) {
  return apiFetch(`/male_singles/${id}`, { method: "GET" });
}

export function createMaleSingle(payload) {
  return apiFetch("/male_singles", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchFemaleSingles() {
  return apiFetch("/female_singles", { method: "GET" });
}

export function fetchFemaleSingle(id) {
  return apiFetch(`/female_singles/${id}`, { method: "GET" });
}

export function createFemaleSingle(payload) {
  return apiFetch("/female_singles", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchMatches() {
  return apiFetch("/matches", { method: "GET" });
}
