import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FormDataType, SignupPopupProps } from "../../types/auth.types";
import {
  uploadProfileImage,
  parseResumeWithAPI,
  signupAPI,
  loginAPI,
} from "../../utils/api.utils";
import {
  mapExperienceLevel,
  mapEducationLevel,
  mapInstitutionFromEducation,
} from "../../utils/auth.utils";
import Cookies from "js-cookie";

// Define types for parsed resume data
interface ParsedResumeData {
  full_name?: string;
  email?: string;
  phone?: string;
  title?: string;
  current_company?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  skills?: string[];
  experience?: Array<{ years?: string }>;
  education?: Array<{ degree?: string; institution?: string }>;
}

const SignupPopup = ({ isOpen, onClose, onLogin }: SignupPopupProps) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    password: "password123",
    confirmPassword: "password123",
    title: "Product Designer",
    experience: "5 years",
    skills: ["UI/UX", "Figma", "User Research"],
    education: "Bachelor's in Design",
    institution: "Stanford University",
    location: "San Francisco, CA",
    status: "Active now",
    resume: null,
    linkedin: "",
    portfolio: "",
    github: "",
    currentCompany: "Tech Innovations Inc.",
    jobType: "Full-time",
    remotePreference: "Hybrid",
    image: "",
    role: "applicant",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData({ ...formData, skills });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setIsLoading(true);
      const uploadToast = toast.loading("Uploading profile image...");

      try {
        const imageUrl = await uploadProfileImage(file);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        toast.success("Profile image uploaded successfully!", {
          id: uploadToast,
        });
      } catch (error) {
        console.error("Image upload failed:", error);
        setImagePreview(null);
        toast.error("Failed to upload image. Please try again.", {
          id: uploadToast,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setIsLoading(true);
      setParseError("");

      const parsingToast = toast.loading("Parsing resume...");
      setFormData((prev) => ({ ...prev, resume: file }));

      try {
        const parsedData: ParsedResumeData = await parseResumeWithAPI(file);

        // Safely map parsed data to form fields
        const mappedData = {
          name: parsedData.full_name || formData.name,
          email: parsedData.email || formData.email,
          phone: parsedData.phone || formData.phone,
          title: parsedData.title || formData.title,
          currentCompany: parsedData.current_company || formData.currentCompany,
          location: parsedData.location || formData.location,
          linkedin: parsedData.linkedin || formData.linkedin,
          portfolio: parsedData.portfolio || formData.portfolio,
          github: parsedData.github || formData.github,
          skills: parsedData.skills || formData.skills,
          experience:
            mapExperienceLevel(parsedData.experience) || formData.experience,
          education:
            mapEducationLevel(parsedData.education) || formData.education,
          institution:
            mapInstitutionFromEducation(parsedData.education) ||
            formData.institution,
        };

        setFormData((prev) => ({ ...prev, ...mappedData, resume: file }));
        toast.success("Resume parsed successfully!", { id: parsingToast });
      } catch (error) {
        console.error("Resume parsing failed:", error);
        setParseError(
          error instanceof Error ? error.message : "Failed to parse resume"
        );
        toast.error("Failed to parse resume. Please try again.", {
          id: parsingToast,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password validation only for signup
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setIsLoading(true);
    const actionToast = toast.loading(
      isLoginMode ? "Logging in..." : "Creating account..."
    );

    try {
      if (isLoginMode) {
        // Handle login
        const loginData = {
          email: formData.email,
          password: formData.password,
        };

        const result = await loginAPI(loginData);

        Cookies.set("token", result.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(result.user), { expires: 7 });
        Cookies.set("role", result.user?.role || formData.role, { expires: 7 });
        Cookies.set("UserId", result.user?.id, { expires: 7 });

        const userFormData: FormDataType = {
          ...formData,
          name: result.user?.full_name || formData.name,
          title: result.user?.title || formData.title,
          location: result.user?.location || formData.location,
          currentCompany:
            result.user?.current_company || formData.currentCompany,
          phone: result.user?.phone || formData.phone,
          email: result.user?.email || formData.email,
          linkedin: result.user?.linkedin || formData.linkedin,
          github: result.user?.github || formData.github,
          portfolio: result.user?.portfolio || formData.portfolio,
          skills: result.user?.skills
            ? result.user.skills.split(", ")
            : formData.skills,
          education: result.user?.education?.[0]?.degree || formData.education,
          institution:
            result.user?.education?.[0]?.institution || formData.institution,
          image: result.user?.image || formData.image,
          role: result.user?.role || formData.role,
        };

        toast.success("Login successful!", { id: actionToast });
        onLogin(userFormData);
        onClose();

        // Auto reload page after successful login
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Handle signup
        const signupData = {
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          title: formData.title,
          location: formData.location,
          phone: formData.phone,
          current_company: formData.currentCompany,
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
          skills: formData.skills.join(", "),
          image: formData.image,
          role: formData.role,
          education:
            formData.role === "applicant"
              ? [
                  {
                    institution: formData.institution,
                    location: formData.location,
                    degree: formData.education,
                    gpa: "8.5",
                    years: "2021-2025",
                  },
                ]
              : [],
          experience:
            formData.role === "applicant"
              ? [
                  {
                    company: formData.currentCompany,
                    location: formData.location,
                    title: formData.title,
                    years: "2024",
                    description: "Professional experience",
                  },
                ]
              : [],
        };

        const result = await signupAPI(signupData);

        Cookies.set("token", result.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(result.user), { expires: 7 });
        Cookies.set("role", result.user?.role || formData.role, { expires: 7 });
        Cookies.set("UserId", result.user?.id, { expires: 7 });

        const userFormData: FormDataType = {
          ...formData,
          name: result.user?.full_name || formData.name,
          title: result.user?.title || formData.title,
          location: result.user?.location || formData.location,
          currentCompany:
            result.user?.current_company || formData.currentCompany,
          phone: result.user?.phone || formData.phone,
          email: result.user?.email || formData.email,
          linkedin: result.user?.linkedin || formData.linkedin,
          github: result.user?.github || formData.github,
          portfolio: result.user?.portfolio || formData.portfolio,
          skills: result.user?.skills
            ? result.user.skills.split(", ")
            : formData.skills,
          education: result.user?.education?.[0]?.degree || formData.education,
          institution:
            result.user?.education?.[0]?.institution || formData.institution,
          image: result.user?.image || formData.image,
          role: result.user?.role || formData.role,
        };

        toast.success("Account created successfully!", { id: actionToast });
        onLogin(userFormData);
        onClose();

        // Auto reload page after successful signup
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(isLoginMode ? "Login Error:" : "Signup Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isLoginMode
          ? "Login failed"
          : "Signup failed",
        {
          id: actionToast,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setParseError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md max-h-[90vh] my-8 overflow-y-auto flex flex-col scrollbar-hide">
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
            {isLoginMode
              ? "Login to Your Account"
              : "Join Our Professional Network"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Role Selection - Only for signup */}
            {!isLoginMode && (
              <div className="mb-6">
                <label
                  htmlFor="role"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="applicant">Job Applicant</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            )}

            {/* Profile Photo Section - Only for signup */}
            {!isLoginMode && (
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {imagePreview || formData.image ? (
                      <img
                        src={imagePreview || formData.image}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {formData.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={triggerImageInput}
                      className="absolute -bottom-1 -right-1 bg-gray-800 border border-gray-700 rounded-full p-1.5 hover:bg-gray-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">
                      Recommended: 300x300 px
                    </p>
                    <button
                      type="button"
                      onClick={triggerImageInput}
                      className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {formData.image || imagePreview
                        ? "Change Photo"
                        : "Upload Photo"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Upload - Only for signup and applicants */}
            {!isLoginMode && formData.role === "applicant" && (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Upload Resume (Auto-fill profile)
                  {isLoading && (
                    <span className="ml-2 text-blue-400 text-xs">
                      Parsing resume...
                    </span>
                  )}
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Choose File
                  </button>
                  <span className="ml-3 text-gray-400 text-sm truncate max-w-xs">
                    {formData.resume ? formData.resume.name : "No file chosen"}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
                {parseError && (
                  <p className="mt-2 text-red-400 text-xs">{parseError}</p>
                )}
              </div>
            )}

            {/* Form Fields - Only show name, title, location in signup mode */}
            {!isLoginMode && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Professional Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>
                </div>

                {/* Recruiter-specific fields */}
                {formData.role === "recruiter" && (
                  <div className="mb-4">
                    <label
                      htmlFor="currentCompany"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="currentCompany"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {/* Applicant-specific fields */}
                {formData.role === "applicant" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="experience"
                          className="block text-gray-300 text-sm font-medium mb-2"
                        >
                          Experience
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Fresher">Fresher</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5+ years">5+ years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="education"
                          className="block text-gray-300 text-sm font-medium mb-2"
                        >
                          Education
                        </label>
                        <select
                          id="education"
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select</option>
                          <option value="High School">High School</option>
                          <option value="Bachelor's Degree">
                            Bachelor Degree
                          </option>
                          <option value="Master's Degree">Master Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="institution"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Institution Name
                      </label>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Stanford University"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="skills"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skills.join(", ")}
                        onChange={handleSkillsChange}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. JavaScript, React, UI/UX"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="location"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}

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

            <div className="mb-4">
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

            {!isLoginMode && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="linkedin"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    LinkedIn Profile (optional)
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="github"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    GitHub Profile (optional)
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="portfolio"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    Portfolio Website (optional)
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </>
            )}

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
                  Processing...
                </>
              ) : isLoginMode ? (
                "Log In"
              ) : (
                "Create Professional Profile"
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
                  className="w-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLoginMode ? (
              <p>
                Dont have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPopup;
