import { LoginData,LoginAPIResponse } from "../types/auth.types";
import { SignupData,SignupAPIResponse } from "../types/auth.types";
import { ParsedResumeData } from "../types/auth.types";
export const uploadProfileImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
  
    const response = await fetch("https://web3-job-platform.onrender.com/upload/profile-image", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data.image_url;
  };
  
  export const parseResumeWithAPI = async (file: File): Promise<ParsedResumeData> => {
    const formData = new FormData();
    formData.append("resume", file);
  
    const response = await fetch("https://web3-job-platform.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.json() as ParsedResumeData;
  };
 
  export const signupAPI = async (
    signupData: SignupData
  ): Promise<SignupAPIResponse> => {
    const response = await fetch("https://web3-job-platform.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...signupData,
        role: signupData.role || "applicant",
      }),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.message || "Signup failed");
    }
  
    return result as SignupAPIResponse;
  };
  
  export const loginAPI = async (loginData: LoginData): Promise<LoginAPIResponse> => {
    const response = await fetch("https://web3-job-platform.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }
  
    return result as LoginAPIResponse;
  };
  