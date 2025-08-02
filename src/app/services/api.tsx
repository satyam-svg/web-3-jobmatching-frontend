import { API_ENDPOINTS } from "../utils/constants";
import { SignupData } from "../types/auth.types";
export const apiService = {
  async login(loginData: { email: string; password: string }) {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    return await response.json();
  },

  async signup(signupData: SignupData) {
    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });
    return await response.json();
  },

  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch(API_ENDPOINTS.UPLOAD_RESUME, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.image_url;
  },
};
