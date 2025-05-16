import axios from "axios";
import { backUrl } from "./config";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<LoginResponse>(`${backUrl}/auth/login`, {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed");
  }
};
