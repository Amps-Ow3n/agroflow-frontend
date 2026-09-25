import client, {
  setCsrfToken,
  clearCsrfToken,
} from "./client";

export async function login(email, password) {
  const body = new URLSearchParams();

  body.set("username", email);
  body.set("password", password);

  const response = await client.post(
    "/login",
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (response.data?.csrf_token) {
    setCsrfToken(response.data.csrf_token);
  }

  return response.data;
}

export async function register(payload) {
  const response = await client.post("/register", payload);
  return response.data;
}

export async function logout() {
  const response = await client.post("/logout");

  clearCsrfToken();

  return response.data;
}

export async function getCsrfToken() {
  const response = await client.get("/csrf");

  if (response.data?.csrf_token) {
    setCsrfToken(response.data.csrf_token);
  }

  return response.data;
}

export async function getCurrentIdentity() {
  const response = await client.get("/identity/me");

  await getCsrfToken();

  return response.data;
}