export const API_ENDPOINTS = {
  LOGIN: "https://web3-job-platform.onrender.com/login",
  SIGNUP: "https://web3-job-platform.onrender.com/signup",
  UPLOAD_RESUME: "https://web3-job-platform.onrender.com/upload",
  UPLOAD_IMAGE: "https://web3-job-platform.onrender.com/profile-image",
};

export const EXPERIENCE_OPTIONS = [
  { value: "", label: "Select" },
  { value: "Fresher", label: "Fresher" },
  { value: "1-3 years", label: "1-3 years" },
  { value: "3-5 years", label: "3-5 years" },
  { value: "5+ years", label: "5+ years" },
  { value: "10+ years", label: "10+ years" },
];

export const EDUCATION_OPTIONS = [
  { value: "", label: "Select" },
  { value: "High School", label: "High School" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PhD", label: "PhD" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPE_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
];

export const REMOTE_PREFERENCE_OPTIONS = [
  { value: "On-site", label: "On-site" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

export const DEFAULT_USER_DATA = {
  name: "Alex Morgan",
  title: "Product Designer",
  status: "Active now",
  experience: "5 years",
  location: "San Francisco, CA",
  currentCompany: "Tech Innovations Inc.",
  phone: "+1 (555) 123-4567",
  email: "alex@example.com",
  linkedin: "",
  github: "",
  portfolio: "",
  skills: ["UI/UX", "Figma", "User Research"],
  education: "Bachelor's in Design",
  institution: "Stanford University",
  image: "",
  role: "", // Add this line
};
