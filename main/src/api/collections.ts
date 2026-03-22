/* Collections layer

*/


import { apiFetch } from "./client";

/**
 * List all collections inside an app
 */
export async function listCollections(appName: string) {
  return apiFetch(`/list_collections?app_name=${appName}`);
}

/**
 * Add a collection to an app
 */
export async function addCollection(
  appName: string,
  collectionName: string
) {
  const formData = new FormData();

  formData.append("app_name", appName);
  formData.append("collection_name", collectionName);

  return apiFetch("/add_collection", {
    method: "POST",
    body: formData,
  });
}

/**
 * Delete a collection from an app
 */
export async function deleteCollection(
  appName: string,
  collectionName: string,
  adminPassword: string
) {
  const formData = new FormData();

  formData.append("admin_password", adminPassword);
  formData.append("app_name", appName);
  formData.append("collection_name", collectionName);

  return apiFetch("/delete_collection", {
    method: "POST",
    body: formData,
  });
}

/**
 * Update object inside collection for a userId
 */
export async function updateObject(
  appName: string,
  collectionName: string,
  userId: string,
  obj: object
) {
  const formData = new FormData();

  formData.append("app_name", appName);
  formData.append("collection_name", collectionName);
  formData.append("userId", userId);
  formData.append("obj", JSON.stringify(obj));

  return apiFetch("/update_object", {
    method: "POST",
    body: formData,
  });
}