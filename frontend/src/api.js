const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("placement_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  register: body =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    }),

  login: body =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body)
    }),

  me: () => request("/users/me"),

  updateProfile: body =>
    request("/users/me", {
      method: "PUT",
      body: JSON.stringify(body)
    }),

  opportunities: () => request("/opportunities"),

  myOpportunities: () => request("/opportunities/mine"),

  createOpportunity: body =>
    request("/opportunities", {
      method: "POST",
      body: JSON.stringify(body)
    }),

  deleteOpportunity: id =>
    request(`/opportunities/${id}`, {
      method: "DELETE"
    }),

  apply: id =>
    request(`/applications/${id}`, {
      method: "POST"
    }),

  myApplications: () => request("/applications/mine"),

  companyApplications: () => request("/applications/company"),

  allApplications: () => request("/applications/all"),

  updateApplicationStatus: (id, status) =>
    request(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  adminStats: () => request("/admin/stats"),

  students: () => request("/users/students"),

  companies: () => request("/users/companies")
};
