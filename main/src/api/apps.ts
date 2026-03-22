import { apiFetch } from "./client";

export async function createApp(
  appName: string,
  adminPassword: string
) {
  const formData = new FormData();

  formData.append("app_name", appName);
  formData.append("admin_password", adminPassword);

  return apiFetch("/create_app", {
    method: "POST",
    body: formData,
  });
}

export async function listApps() {
  return apiFetch("/apps");
}