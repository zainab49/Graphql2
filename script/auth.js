// script/auth.js
const API_SIGNIN = "https://learn.reboot01.com/api/auth/signin";

export function saveToken(token) {
  localStorage.setItem("jwt", token);
}

export function getToken() {
  return localStorage.getItem("jwt");
}

export function clearToken() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("userId");
}

export async function loginUser(loginOrEmail, password) {
  const credentials = btoa(`${loginOrEmail}:${password}`);
  const res = await fetch(API_SIGNIN, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  saveToken(data);
  return data;
}

export function logoutUser() {
  clearToken();
  location.reload();
}
