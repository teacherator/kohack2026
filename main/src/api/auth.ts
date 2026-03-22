/* Login/logout session layer

Examples
login(email, password)
logout()
getCurrentUser()
*/

import { apiFetch } from "./client";

export async function login(email: string, password: string) {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("password", password);

  return apiFetch("/login", {
    method: "POST",
    body: formData,
  });
}

export async function logout() {
  return apiFetch("/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiFetch("/me");
}