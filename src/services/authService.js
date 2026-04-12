import api from "./api";

/*
---------------------------------------
LOGIN USER
Calls FastAPI /login
Stores JWT in localStorage
---------------------------------------
*/
export async function loginUser(email, password) {
  const response = await api.post("/login", null, {
    params: { email, password },
  });

  const token = response.data.access_token;

  localStorage.setItem("access_token", token);

  return {
  token: response.data.access_token,
  role: response.data.role,
  userId: response.data.user_id
};
}

/*
---------------------------------------
REGISTER USER
Calls FastAPI /register
---------------------------------------
*/
export async function registerUser({ name, email, password, role, admin_access_code }) {
  const response = await api.post("/register", null, {
    params: { name, email, password, role, admin_access_code },
  });

  return response.data;
}
/*
---------------------------------------
LOGOUT USER
---------------------------------------
*/
export function logoutUser() {
  localStorage.removeItem("access_token");
}

/*
---------------------------------------
GET STORED TOKEN
---------------------------------------
*/
export function getToken() {
  return localStorage.getItem("access_token");
}
