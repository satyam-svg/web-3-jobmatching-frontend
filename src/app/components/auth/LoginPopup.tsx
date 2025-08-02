import React, { useState } from "react";
import toast from "react-hot-toast";
import { FormDataType } from "../../types/auth.types";
import { loginAPI } from "../../utils/api.utils";
import { mapExperienceFromAPIResponse } from "../../utils/auth.utils";
import Cookies from "js-cookie";

// Define proper TypeScript interfaces
interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: FormDataType) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface APIExperienceItem {
  years?: string; // Add this to match the ExperienceItem
  company?: string;
  position?: string;
  duration?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface APIUser {
  full_name?: string;
  title?: string;
  location?: string;
  current_company?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills?: string;
  education?: Array<{
    degree?: string;
    institution?: string;
  }>;
  experience?: APIExperienceItem[] | string; // Use API-specific type here
  image?: string;
}

interface LoginAPIResponse {
  token: string;
  user: APIUser;
}

const LoginPopup: React.FC<LoginPopupProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "alex@example.com",
    password: "password123",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const actionToast = toast.loading("Logging in...");

    try {
      const result: LoginAPIResponse = await loginAPI(formData);

      // Store token and user data in cookies
      Cookies.set("token", result.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(result.user), { expires: 7 });

      // Map API response to our form structure
      const userFormData: FormDataType = {
        name: result.user?.full_name || "User",
        title: result.user?.title || "Professional",
        location: result.user?.location || "Location",
        currentCompany: result.user?.current_company || "Company",
        phone: result.user?.phone || "",
        email: result.user?.email || formData.email,
        linkedin: result.user?.linkedin || "",
        github: result.user?.github || "",
        portfolio: result.user?.portfolio || "",
        skills: result.user?.skills ? result.user.skills.split(", ") : [],
        education: result.user?.education?.[0]?.degree || "Bachelor's Degree",
        institution: result.user?.education?.[0]?.institution || "University",
        experience:
          result.user?.experience && Array.isArray(result.user.experience)
            ? mapExperienceFromAPIResponse(result.user.experience)
            : "Fresher",
        image: result.user?.image || "",
        role: result.user?.title || "Professional", // Added missing role property
        // Fields not in API response
        password: formData.password,
        confirmPassword: formData.password,
        status: "Active now",
        resume: null,
        jobType: "Full-time",
        remotePreference: "Hybrid",
      };

      toast.success("Login successful!", { id: actionToast });
      onLogin(userFormData);
      onClose();
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed", {
        id: actionToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mb-4 flex items-center justify-center ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-purple-700 hover:to-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>

            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="px-3 text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-lg text-white hover:bg-gray-800/50 transition-colors"
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.667-4.166-2.685-6.735-2.685-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-lg text-white hover:bg-gray-800/50 transition-colors"
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
