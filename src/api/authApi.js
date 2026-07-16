import client from "./client";

export const registerUser = async (payload) => {
  const response = await client.post("/register", payload);
  return response.data;
};

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await client.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};