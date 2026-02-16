// // helper service for global delete endpoints
// const GLOBAL_BASE_DEFAULT = "https://api.yaadigo.com/secure/api/global/global";

// async function callGlobal(path, method = "GET", apiKey = "", body = null) {
//   const url = `${GLOBAL_BASE_DEFAULT}${path.startsWith("/") ? "" : "/"}${path}`;
//   const opts = {
//     method,
//     headers: {
//       accept: "application/json",
//       "x-api-key": apiKey || "",
//     }
//   };
//   if (method !== "GET" && body) {
//     opts.body = body;
//   }
//   const res = await fetch(url, opts);
//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw data || new Error("Global API error");
//   return data;
// }

// // Soft delete single
// export async function softDeleteOne(table, id, base = GLOBAL_BASE_DEFAULT, apiKey = "") {
//   const url = `${base}/soft-delete?table=${encodeURIComponent(table)}&id=${encodeURIComponent(id)}`;
//   const res = await fetch(url, { method: "POST", headers: { accept: "application/json", "x-api-key": apiKey || "" } });
//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw data || new Error("soft-delete failed");
//   return data;
// }

// // Soft delete multiple (sequential)
// export async function softDeleteBulk(ids = [], base = GLOBAL_BASE_DEFAULT, apiKey = "") {
//   for (const id of ids) {
//     // call one by one
//     await softDeleteOne("quotations", id, base, apiKey);
//   }
//   return { success: true };
// }

// export async function restoreOne(table, id, base = GLOBAL_BASE_DEFAULT, apiKey = "") {
//   const url = `${base}/restore?table=${encodeURIComponent(table)}&id=${encodeURIComponent(id)}`;
//   const res = await fetch(url, { method: "POST", headers: { accept: "application/json", "x-api-key": apiKey || "" } });
//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw data || new Error("restore failed");
//   return data;
// }

// export async function hardDeleteOne(table, id, base = GLOBAL_BASE_DEFAULT, apiKey = "") {
//   const url = `${base}/hard-delete?table=${encodeURIComponent(table)}&id=${encodeURIComponent(id)}`;
//   const res = await fetch(url, { method: "DELETE", headers: { accept: "application/json", "x-api-key": apiKey || "" } });
//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw data || new Error("hard-delete failed");
//   return data;
// }

// export async function fetchTrash(table, base = GLOBAL_BASE_DEFAULT, apiKey = "") {
//   const url = `${base}/trash?table=${encodeURIComponent(table)}`;
//   const res = await fetch(url, { method: "GET", headers: { accept: "application/json", "x-api-key": apiKey || "" } });
//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw data || new Error("fetch trash failed");
//   return data.data || data || [];
// }
