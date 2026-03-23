/* Requests Layer (the other three files use this to send requests)


apiFetch(endpoint, options)
*/

const API_BASE =
  "https://lionfish-app-5f4rk.ondigitalocean.app/mishnah-yomi";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include", // REQUIRED for session cookies
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "API request failed");
  }

  return response.json();
}